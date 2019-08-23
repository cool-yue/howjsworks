/**
 * How tail calls work
 */

 // 在我们的系统中,我依靠优化来让我们的程序运行更快.
 // 一个优化就是打破规则,但是以这种方式打破规则,打破规则不会被观察到
 // 一个优化不允许把一个好的程序转变成了一个坏的
 // 优化不允许注入bug

 // 最重要的优化不仅仅是不注入新的bug,它还终结了在好程序中的一类bug,产生了新的编程范式
 // 我在说的就是尾部调用优化(The Tail Call Optimization)
 // 一些专家认为这个优化很重要,我们不应该以一个优化来叫它的形式来轻视
 // 他们称呼这个为 Proper Tail Calls.任何其他实现tail calls的方式都是不正确的

 // 我更喜欢称呼它为优化,因为大部分的程序员几乎很少把重心放在这些规矩上
 // 他们喜欢优化,哪怕没有很大的效果
 // 我想他们需要这个功能

 // 当一个函数做的最后一件事是返回一个调用的函数的结果,一个尾调产生
 // 在接下来的例子中,continuize是一个工厂,接收any这个函数,然后返回一个hero函数
 // hero函数调用any,然后把返回的值传入到continuation函数

 function continuize(any) {
     return function hero(continuation,...args) {
         return continuation(any(...args)); // <-- 一个尾调
     };
 }

 // 当一个函数返回一个(正在执行调用的函数的返回值)
 // 我们称呼这个为尾调
 // 称呼为tail call而不是称呼为return call是个耻辱

 // 尾调的优化是一个简单,但是它有重大的实现细节
 // 使用传统的指令作为一个特征（metaphor）
 // continuize的代码生成可能包含这些机器指令:

 // call continuation # 调用continuation函数
 // return #返回一个调用hero的函数的地方

 // call指令把下一条的指令地址(这个案例中恰好是return指令)压入调用栈顶
 // 然后它转换控制权到一个函数,这个函数的地址在寄存器中标记为continuation
 // 当continuation函数执行完,它从栈中弹出return的地址,然后程序跳到return这里来
 // return的指令将要再次执行弹栈操作,弹出栈中的下一个指令,并且跳到调用hero指令后面的那条指令

 // 优化把这2个指令转化成一条指令

 // jump continuation #go to the continuation function

 // 现在我们不需要把return指令的地址压入调用栈,continuation函数返回到一个调用hero函数的地方,不是hero自身
 // 一个尾调想一个带有参数的goto语句,但是没有任何goto语句的危险,这些危险导致goto被废弃了

 // 所以它看起来是优化节约了一条指令,一次压栈,一次弹栈
 // 它看上去好像不是一个很了不起的事
 // 为了更好地去理解这个收益,让我们看看调用是如何在JavaScript中工作的
 // 当你调用一个函数,这些东西会发生

 //.计算参数表达式
 //.创建一个足够尺寸的活动对象来装所有的函数的参数和变量
 //.存一个正在调用的这个函数对象到这个活动对象中
 //.存形参到实参的映射的值到活动对象中,缺少的实参被当做undefined,超过的实参忽略掉
 //.存undefined到所有的活动对象中的变量
 //.设置下一个指令字段(next instruction field)到活动对象,在这个调用完成后的很快的时间内来引导这个指令
 //.设置活动对象中的caller字段到current活动对象中.还没有真正的调用栈,只有一个活动对象的链表
 //.让新的新的activation变成当前的activation
 //.开始执行调用函数