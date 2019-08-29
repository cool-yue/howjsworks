// parallel函数是最复杂的因为可选requestor数组

function parallel(
    required_array,
    optional_array,
    time_limit,
    time_option,
    throttle,
    factory_name = "parallel"
) {
    // parallel工厂是这些工厂中最复杂的一个
    // 它接收一个第二个requestor的数组,这个数组可以以更宽松的策略来对处理
    // 它返回一个制造一个数组值的requestor
    let number_of_required;
    let requestor_array;
    // 有4个情况因为require_array和optional_array都可以是空
    if (required_array === undefined || required_array.length === 0) {
        number_of_required = 0;
        if (optional_array === undefined || optional_array.length === 0) {
            // 如果2个都是空的,可能有就有一个错误
            throw make_reason(
                factory_name,
                "Missing requestor array.",
                required_array
            );
        }
        // 如果只有optional_array,那么它就是requetor_array
        requestor_array = optional_array;
        time_option = true;
    } else {
        // 如果只有required_array,那么它就是requestor_array
        number_of_required = required_array.length;
        if (optional_array === undefined || optional_array.length === 0) {
            requestor_array = required_array;
            time_option = undefined;
        } else {
            // 如果2个array都提供了
            // 我们把他们拼接在一起
            requestor_array = required_array.concat(optional_array);
            if (time_option !== undefined && typeof time_option !== "boolean") {
                throw make_reason(
                    factory_name,
                    "Bad time_option.",
                    time_option
                );
            }
        }
    }
    check_requestor_array(requestor_array,factory_name);
    return function parallel_requestor(callback,initial_value) {
        check_callback(callback,factory_name);
        let number_of_pending = requestor_array.length;
        let number_of_pending_required = number_of_required;
        let results = [];
        // ran让它开始
        let cancel = run(
            factory_name,
            requestor_array,
            initial_value,
            function parallel_action(value,reason,number) {
                // action函数拿到每一个在数组中的requestor的结果
                // parallel需要返回一个它得到的所有的值的数组
                results[number] = value;
                number_of_pending -= 1;
                // 如果requestor是需要的requestor,保证它成功
                // 如果它失败了,parallel操作失败
                // 如果可选的requestor失败了,我们仍然可以继续
                if (number < number_of_required) {
                    number_of_pending_required -= 1;
                    if (value === undefined) {
                        cancel(reason);
                        callback(undefined,reason);
                        callback = undefined;
                        return;
                    }
                }
                // 如果所有的都被处理了,或者必须的requestor都成功了
                // 我们没有一个time_option,我们就完成了
                if (
                    number_of_pending < 1
                    || (
                        time_option === undefined
                        && number_of_pending_required < 1
                    )
                ) {
                    cancel(make_reason(factory_name,"Optional."));
                    callback(
                        factory_name === "sequence"
                        ? results.pop()
                        : results
                    );
                    callback = undefined;
                }
            },
            function parallel_timeout() {
                // 当定时器触发,除非time_option给了个false，就停止工作
                // false time_option 就是对于必须的requestor没有时间限制
                // 允许让可选的requestor运行,直到requeireds完成或者时间过期
                // 这个2个看哪个时间晚,以晚的为主
                const reason = make_reason(
                    factory_name,
                    "Timeout.",
                    time_limit
                );
                if (time_option === false) {
                    time_option = undefined;
                    if (number_of_pending_required < 1) {
                        cancel(reason);
                        callback(results);
                    }
                } else {
                    // 时间过期了
                    // 如果所有的必须requestor都成功了
                    // parallel操作就成功了
                    cancel(reason);
                    if (number_of_pending_required < 1) {
                        callback(results);
                    } else {
                        callback(undefined,reason);
                    }
                    callback = undefined;
                }
            },
            time_limit,
            throttle
        );
        return cancel;
    }
}