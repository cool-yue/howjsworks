// race函数比parallel要简单很多
// 因为它不需要收集所有的结果
// 它仅仅只需一个简单的结果

function race(requestor_array,time_limit,throttle) {
    // race工厂返回一个requestor,这个requesotr一次开启所有的requestor_array只能怪的requestor
    // 第一个赢的,返回它的结果
    const  factory_name = (
        throttle === 1
        ? "fallback"
        : "race"
    );

    check_requestor_array(requestor_array,factory_name);
    return function race_requestor(callback,initial_value) {
        check_callback(call_back,factory_name);
        let number_of_pending = requestor_array.length;
        let cancel = (
            factory_name,
            requestor_array,
            initial_value,
            function race_action(value,reason,number) {
                number_of_pending -= 1;
                // 我们有一个胜者
                // 取消掉输者然后把之传送给callback
                if (value !== undefined) {
                    // 这里调用cancel是因为要取消掉timeout
                    cancel(make_reason(factory_name,"Loser.",number));
                    callback(value);
                    callback = undefined;
                }
                // 没有胜者,给个失败信号
                if (number_of_pending < 1) {
                    // 这里调用cancel是因为要取消掉timeout
                    cancel(reason);
                    callback(undefined,reason);
                    callback = undefined;
                }
            },
            function race_timeout() {
                let reason = make_reason(
                    factory_name,
                    "Timeout.",
                    time_limit
                );
                // 这里调用cancel是因为时间已经到了
                // 这里要清理还没执行的requestor
                cancel(reason);
                callback(undefined,reason);
                callback = undefined;
            },
            time_limit,
            throttle
        );
        return cancel;
    }
}

// 一个fallback就是个节流版的race
function fallback(requestor_array,time_limit) {
    // fallback工厂返回一个requestor,这个requestor尝试requestor_array中的每个requestor
    // 一次一个,直到找到一个成功的
    return race(requestor_array,time_limit,1);
}

// 一个sequence是一个节流的paralle,带着一个传播的值

function sequence(requestor_array,time_limit) {
    // 一个sequence按顺序运行每一个requestor
    // 把结果传递给下一个
    // 只要他们都成功
    // 一个sequence是一个节流的parallel

    return parallel(
        requestor_array,
        undefined,
        time_limit,
        undefined,
        1,
        "sequence"
    );
}

//