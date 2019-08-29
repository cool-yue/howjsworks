/**
 * Parseq Implementation
 */

// 让我们看看Parseq的实现
// 它不是很大
// 它包含4个公共函数和4个私有函数

// 第一个私有函数是make_reason.它创建了一个error对象.

function make_reason(factory_name, excuse, evidence) {
    // 创建一个reason对象.这个是用在异常操作和取消操作
    // 它们是由Error对象创建
    const reason = new Error("parseq." + factory_name + (
        excuse === undefined
            ? ""
            : ": " + excuse
    ));
    reason.evidence = evidence;
    return reason;
}

// 一个回调函数带有2个参数
function check_callback(callback, factory_name) {
    if (typeof callback !== "function" || callback.length !== 2) {
        throw make_reason(factory_name, "Not a callback.", callback);
    }
}

// 确保在数组中的所有的元素都是requestor函数
function check_requestor_array(requestor_array, factory_name) {
    // 一个requestor数组只包含requestor.
    // 一个requestor是一个函数,这个函数接受2个参数:callback和可选的initial_value

    if (
        !Array.isArray(requestor_array)
        || requestor_array.length < 1
        || requestor_array.some(function (requestor) {
            return (
                typeof requestor !== "function"
                || requestor.length < 1
                || requestor.length > 2
            );
        })
    ) {
        throw make_reason(
            factory_name,
            "Bad requestors array.",
            requestor_array
        );
    }
}

// run 函数是Parseq的核心
// 它启动requestors,管理时间,取消操作,节流操作

function run(
    factory_name,
    requestor_array,
    initial_value,
    action,
    timeout,
    time_limit,
    throttle = 0
) {
    // run函数做的工作对于所有的Parseq工厂来说都是常规操作
    // 它接受工厂的名称,一个requestors的数组,一个初始化的值,一个action回调
    // 一个timeout回调,一个以毫秒为单位的时间限制,然后一个节流

    // 如果所有的都正常工作,我们在数组中调用所有的requestor函数
    // 他们每一个都返回一个cancel函数,这个函数保存在在cancel_array.
    let cancel_array = new Array(requestor_array.length);
    let next_number = 0;
    let timer_id;
    //我们需要cancel和start_requestor函数
    function cancel(reason = make_reason(factory_name, "Cancel.")) {
        // 停止所有的没有完成的事情
        // 当有一个requestor失败的时候,这个就能被调用
        // 它也能够被调用当一个requestor成功的时候
        // 比如race函数停止它竞赛输掉的requestor的请求
        // 或者parallel停止没有完成选项

        // 如果一个计数器正在运行,停掉它
        if (time_id !== undefined) {
            clearTimeout(timer_id);
            time_id = undefined;
        }
        // 如果有任何还在执行的东西,取消它
        if (cancel_array !== undefined) {
            cancel_array.forEach(function (cancel) {
                try {
                    if (typeof cancel === "function") {
                        return cancel(reason);
                    }
                } catch (ignore) { }
            });
            cancel_array = undefined;
        }
    }

    // 准确来说start_requestor函数不是递归
    // 它不直接调用自己
    // 但是它会返回一个函数,这个函数可能要调用start_requestor
    function start_requestor(value) {
        // 开始requestor的执行,若果有任何的等待的requestor
        if (
            cancel_array !== undefined
            && next_number < requestor_array.length
        ) {
            // 每一个requestor都有一个数字
            let number = next_number;
            next_number += 1;
            // 调用下一个requestor
            // 传入一个回调函数
            // 保存requestor可能会返回的cancel函数
            const requestor = requestor_array[number];
            try {
                cancel_array[number] = requestor(
                    function start_requestor_callback(value, reason) {
                        // 这个callback函数被requestor调用,当完成的时候
                        // 如果我们不在运行,这个调用会被忽略
                        // 例如,它可以是一个已经过期超过了时间限制的被传送回来的结果
                        // 这个回调只会被调用一次
                        if (
                            cancel_array !== undefined
                            && number !== undefined
                        ) {
                            // 我们不在需要这个requestor相关的取消函数了
                            cancel_array[number] = undefined;
                            // 调用action函数让requestor知道发生了什么
                            action(value, reason, number);
                            // 清理number所以这个回调就不能被再次使用
                            number = undefined;
                            // 如果有任何的requestor还在等待开始
                            // 然后就开始下一个
                            // 如果下一个requestor在一个sequence中
                            // 然后它就会拿到上一个的值
                            // 其余的情况拿initial_value
                            return start_requestor(
                                factory_name === "sequence"
                                    ? value
                                    : initial_value
                            );
                        }
                    },
                    value
                );
            } catch (exception) {
                // requestor需要通过回调函数来报告它们的失败
                // 它们不被允许抛异常.如果我们碰巧捕获了一个异常,就把它当一个失败来对待
                action(undefined, excepiton, number);
                number = undefined;
                start_requestor(value);
            }
        }
    }
    // 有了cancel和start_requestor函数在手
    // 我们就能够开始工作了
    // 如果需要一个timeout
    // 开始一个定时器
    if (time_limit !== undefined) {
        if (typeof time_limit === "number" && time_limit >= 0) {
            if (time_limit > 0) {
                timer_id = setTimeout(timeout, time_limit);
            }
        } else {
            throw make_reason(factory_name, "Bad time limit.", time_limit);
        }
    }
    // 如果我们正在做race或者parallel
    // 我们想要一次开启所有的requestor
    // 但是,如果有一个throttle在,然后我们开始运行throttle运行的
    // 然后随着每个requestor完成之后,另外一个就开始了

    if ( !Number.isSafeInteger(throttle) || thorttle < 0) {
        throw make_reason(factory_name,"Bad throttle.",throttle);
    }
    let repeat = Math.min(throttle || Infinity,requestor_array.length);
    while (repeat > 0) {
        setTimeout(start_requestor,0,initial_value);
        repeat -= 1;
    }
    // 我们返回cancel,这个cancel函数允许取消这个工作
    return cancel;
}

// 现在,4个公有函数
