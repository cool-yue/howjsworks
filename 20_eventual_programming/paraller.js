// parallel函数是最复杂的因为可选requestor数组
// parallel,race,fallback,sequence都是工厂
// 这些工厂将接收的requestor数组通过run方法,根据它们指定的方式(通常是方法字面上的意思)来运行

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
    // 以上的代码合并了requestor
    // 同时检查requestor是符合要求,也就是每个requestor都有2个参数,一个回调,一个原始输入值

    // 将传入的requestor又转换成一个更大的requestor
    // number_of_required; 标志着required的个数
    // requestor_array;标志着required和optional的个数
    return function parallel_requestor(callback,initial_value) {
        // 检查回调
        check_callback(callback,factory_name);
        // 拿到所有的requestor的个数
        let number_of_pending = requestor_array.length;
        // 拿到所有的required的
        let number_of_pending_required = number_of_required;
        let results = [];
        // 执行run,run返回一个cancel函数
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