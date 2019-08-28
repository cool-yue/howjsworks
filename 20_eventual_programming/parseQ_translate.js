/**
 * Parseq
 */
// 我开发了Parseq这个库,来管理requestor函数之间的交互流(flow);
// Parseq工厂包装你的requestors 函数的数组,然后这些函数共同以一个控制流来交互
// 这个控制流有:paraller(并行),sequence(串行)或者(race)竞赛
// 每一个工厂返回一个requestor
// 这个让requesotr高度可组装

// Parseq库能够处理时间限制.它可以是,一些工作必须在100毫秒内完成
// 如果晚了,我们应该考虑给个失败然后继续给一个备选的响应
// 这就是之前那3次错误中的任何一个都难以解决的事情
// 使用Parseq,所有你必须做的就是以毫秒指定一个时间限制

parseq.sequence(
    requestor_array,
    milliseconds
)

// sequence工厂接收一个requestor函数的数组和一个可选的时间限制
// 并且返回一个requestor,这个requestor可以让数组中的每一个requestor都调用
// 传入新的requestor的value会被传入到数组中的第一个requestor
// 第一个函数创造的值被传入到第二个requestor.
// 以这种方式,值从requestor到requestor这样流动.最后一个requestor的结果就是这个sequence的结果

parseq.parallel(
    required_array,
    optional_array,
    milliseconds,
    time_option,
    throttle
);

// parallel工厂在一次开启所有的requestor.
// 它没有为JavaScript添加并行机制
// 取而代之,它允许JavaScript来使用世界通用的自然的并行机制
// 这个考虑到扩散计算负载到很多服务器
// 这个提供了一个很强的性能优势
// 如果我们并行处理所有的requestor
// 时间就是最慢的requestor所开销的时间
// 不是所有的requestor加起来的时间
// 这是一个很重要的优化

// parallel工厂应该只用在requestor之间没有互相依赖
// 所有的requestor被给一样的value
// 结果是一个数组包含了所有的requestor的结果
// 以这种方式它很像array的map方法

// parellel工厂能够接收2个requestor数组.
// 第一个数组包含必须的requestor
// 所有的必须requestors必须成功完成,才是并行操作的成功
// 第二个数组装有可选的requestors
// 他们可以失败,但不会导致parellel失败

// 一个以毫秒的时间限制也能够被提供。
// 它决定了必须的requestors必须要在多久完成它们的工作
// time选项参数决定了time如何影响可选的requestors

// time_option的几个含义
// undefined:可选的requestors必须在必须的requestor完成之前完成,如果必须的reqestors存在,必须要在规定时间内完成
// true:可选requestors和必须requestors都必须在规定时间之前完成
// false:必须的requestor没有时间限制,可选的requestor必须在必须requestor完成之前或时间限定之前来完成.这个2值以时间长的为准

// 默认情况下,所有的requestors在同一时间开始.不幸的是,这个容易压垮设计不当的系统
// 所有有一个可选的throttle,显示requestor在同一时间开启的数量

parseq.fallback(
    requestor_array,
    milliseconds
);

// fallback工厂像sequence工厂,但是只要任何一个requestor有一个成功的结果,它就是成功
// 如果一个requestor失败了,它会尝试下一个.
// 当所有requestors失败,那么这个fallback就失败.

parseq.race(
    requestor_array,
    milliseconds,
    throttle
);

// race工厂很parallel工厂很像,但是它是在有第一个成功的requestor结果的时候就宣告成功
// 如果一个requestor成功,然后race就成功

//例子
let getWeather = parseq.fallback([
    fetch("weather",localCache),
    fetch("weather",localDB),
    fetch("weather",remoteDB)
]);

let getAds = parseq.race([
    getAd(adnet.klikHauls),
    getAD(adnet.inUFace),
    getAd(adnet.trackPipe)
]);

let getNav = parseq.sequence([
    getUserRecord,
    getPreference,
    getCustomNav
]);

let getStuff = parseq.parallel(
    [getNav,getAds,getMessageOfTheDay],
    [getWeather,getHoroscope,getGossip],
    500,
    true
);

/**
 * 异常
 */
// 异常太弱了而不够处理经历过多次turns的错误或者失败请求
// 一个异常能够unwind这个栈,但是从一个turn到另外一个turn,栈里面已经没有东西留下了
// 前面的turn的异常处理没有能力来跟未来发生错误的一个turn交互
// 异常也不能返回到异常请求的起始点

// 一个工厂允许抛出一个异常是因为factory的caller仍然在栈里面
// requestors不被允许抛异常因为已经没有东西在栈里面来捕获他们
// requestor必须也不允许杂散的异常逃跑掉了
// 所有的异常必须被捕获并且作为reason传入callback中


/**
 * unwind
 */
// 抛出异常时，将暂停当前函数的执行，
// 开始查找匹配的catch子句。首先检查throw本身是否在try块内部
// 如果是，检查与该try相关的catch子句，看是否可以处理该异常。
// 如果不能处理，就退出当前函数，并且释放当前函数的内存并销毁局部对象
// 继续到上层的调用函数中查找，直到找到一个可以处理该异常的catch。这个过程称为栈展开（stack unwinding）。
// 当处理该异常的catch结束之后，紧接着该catch之后的点继续执行