/**
 * How Functions Work
 */

 // 第一个程序名字叫routines.
 // 一个routine是命令（或者指令）的一个列表.
 // 一个routine跟一些数据一起加载机器中
 // 最终,带有一些运气的话,得到一个答案作为输出

 // 观察到把一个routine当成一个单一的列表来处理非常的困难
 // 有些命令序列可能会在多个routines中出现,或者可能在同一个routine中出现多次
 // 所以子routine发明了,一个有用的routine的集合能够被收集到一个库中
 // 每个子routine会被给一个call number,类似于一个图书馆书籍的书号
 // (命名太浪费内存了)

 // Grace Murray Hopper开发了一个routine叫做A-0.
 // 它是第一个编译器.
 // 它会接受一个命令的列表和call numbers和一个装了子routines的库的磁带
 // 它可以发现子routines对应的call numbers
 // 然后把他们编译到一个新的程序中

 // compile的判断是对词法这一层的检测：制造通过其他源来组装一个工作内容
 // 这个给我们很多到今天还在用的专业术语
 // assembler,complier,library,source,最重要的,call

// 我们需要一个子routine就像在一个图书馆需要一本书一样
// 我们不会商业化或者激活一个子routine
// 我们只是需要它
// Grace Murray Hopper在我们的专业领域帮助建立了很多术语(行话)
// 是因为他叫这些机器为(computers)电脑而不是(digital brain)电子大脑,
// 因为他我可以很骄傲地称呼自己为一个(programmer)程序员

// 据观察子routines和数学函数有关系
// FORTRAN II有一个SUBROUTINE申明和一个CALL语句来激活它们
// 并且它也有一个FUNCTION申明,可以返回一个结果,能够为一个表达式提供一个值

// C语言使得子routine和function融为一体,所有这些正式称为functions
// C没有使用一个描述性的关键字
// javascript用了:function

// function操作符创建了function对象,function操作符接受一个参数列表,和一个函数体,它是一个语句块

// 每一个名字在参数列表中是一个变量,它会被实参列表中的表达式所初始化
// 每一个民资能够选择性地跟着一个=和一个表达式
// 如果实参的值是undefined,这个表达式的值作为取代来赋值给这个参数

function make_set(array,value = true) {
    // make an object by taking property names from an array of strings

    const object = Object.create(null);
    array.forEach(function (name) {
        object[name] = value;
    })
    return object;
}

// 一个函数对象伴随一个实参列表（实参包含0个或者多个表达式以逗号分开）来调用
// 每一个表达式都会被计算然后绑定到一个函数的参数上

// 形参(parameter list)列表和实参(argument list)列表不是必须有一样的长度,超过的arguments会被忽略掉
// 缺失的arguments给undefined这个值

// ...这个操作符允许在parameter list和argument list中
// 在argument中,它叫做展开,它接受一个数组,然后展开,可以让数组中每个元素作为一个分离的arguments
// 在parameter中,它叫rest,所有的剩余的arguments被打包进一个数组中,这个数组被绑定那个参数名字上
// rest parameter必须是parameter list中最后一个参数
// 这个就可以让一个函数控制一个变数量的实参

function curry(func,...zeroth) {
    return function (...wunth) {
        return func(...zeroth,...wunth);
    }
}

// 当一个函数被调用的时候,一个activation object(活动对象)创建了
// 活动对象对你来说不可见.
// 它是一个隐藏的数据结构,这个数据结构持有当前这个函数执行所有需要的相关信息和绑定和正在调用的函数的的返回地址(return address)

// 这个返回地址是,当一个函数执行完成时控制权在当前函数内部,执行完后,显然后面的代码还要执行,所以要交出控制权
// 交出控制权也就是需要返回一个地址,这个地址代表着当前调用这个函数的指令的下一条指令的地址

// 在像c语言这样的语言,活动对象被分配在一个栈上.
// 他们解除分配（弹栈）当函数返回
// JavaScript以不同的方式处理
// JavaScript在(heap)堆上分配一个活动对象,就像一个普通的对象一样
// 活动对象不会自动的失去活性当函数返回的时候
// 相反,只要有一个引用指向这个活动对象,活动对象就会存在
// 活动对象的回收就像普通对象一样回收

// 一个活动对象包含:
// 一个函数对象的引用

// http://dmitrysoshnikov.com/ecmascript/javascript-the-core
// 以下这段英文来自上面这个链接

// A context which activates another context is called a caller.
// A context is being activated is called a callee
// A callee at the same time may be a caller of some other callee
// (e.g. a function called from the global context, calls then some inner function).

/**
 * When a caller activates (calls) a callee, the caller suspends its execution and passes the control flow to the callee.
 *  The callee is pushed onto the the stack and is becoming a running (active) execution context.
 * After the callee’s context ends, it returns control to the caller, and the evaluation of the caller’s context proceeds (it may activate then other contexts) till the its end, and so on.
 * A callee may simply return or exit with an exception. A thrown but not caught exception may exit (pop from the stack) one or more contexts.
 *
 *
 */


// In a function context, a variable object is presented as an activation object.

// caller的活动对象的引用,这个给return来使用,来给回控制权
// caller是什么,这个可以看mdn

// 比如下面这个代码;
function abc() {
    function bcd() {
    }
    bcd();
    let a = 1;
    let b = 2;
}

abc();

// 调用abc的时候,产生abc的活动对象,这里称呼为abc_active,current_active为abc_active,这个时候开始执行函数abc里面的代码
// 注意到abc里面创建了函数bcd,所以在bcd中有一个影藏的引用,能够在创建bcd的时候存着abc_active的活动对象的引用,因为这个
// 时候current_active是abc_active

// abc里面又调用了bcd(),这个时候bcd也要产生一个活动对象bcd_active,对于bcd,caller是活动对象是abc_active
// 所以bcd_active中有abc_active的引用,当前执行bcd的时候,current_active是bcd_active,当bcd执行完毕后,要把控制权交回到abc中
// bcd()的调用的下一个指令是一个赋值语句,let a = 1; 这个指令也会放在bcd_active中,当执行完毕的时候,去找个指令,同时把控制权交回
// abc()也就是将current_active设置为abc_active



// 恢复信息(程序继续执行信息)是用来在一个调用之后往后继续执行
// 这个通常总是一个指令的地址,在一个函数调用完之后迅速接上这个地址

// 函数的参数,用实际参数来初始化
// 函数的变量,以undefined来初始化
// 中间暂时变量,函数所需的,来计算复杂的表达式
// this,可能是目标对象的引用,如果函数对象是作为方法来调用


// 一个函数对象就像普通的可改变的对象,它能够作为属性的容器
function aaa() {}
aaa.abc = "abc";
// aaa是函数对象,函数对象上面放一个abc的属性,最后赋值"abc"
// 这不是一个好的事情,理想的解决方式是,函数对象应该是不可变对象(不能添加属性)
// 在安全领域,共享一个可以改变的函数对象(可添加属性)能够导致数据的串通

// 一个函数对象有一个prototype属性.
// 这是用在(不推荐)伪class风格的模型中(面向对象实现的方式)
// prototype属性是一个对象的引用,这个对象包含一个constructor属性这个指回函数对象自身
// 和一个委托链(delegation link),链接到Object.prototype

function abc() {};
abc.prototype // {constructor:abc,__proto__:Object.prototype}
abc.__proto__ // Function.prototype
// __proto__ 就是delegation link的体现


// 一个函数对象有一个委托链到Function.prototype.通过这个链,一个函数对象继承了没有必要的apply和call

// 函数对象也包含2个隐藏属性
// 一个对于函数可执行代码的引用
// 一个活动对象的引用,在该函数对象创建的时候,那个时候活跃的活动对象的引用
// 这样就在这个函数调用的时候能够通过这个对象来找到父作用域(创建这个函数的函数的申明变量)的变量,这也是闭包的原理
// 一个函数可以通过这些隐藏属性来访问创建这个函数的函数的变量。

// 比如
function abc() {
    let private_a = 1;
    return function bcd() {
        console.log(private_a);
    }
}

let a = abc();
a(); // 1


// free varaiable术语有时用来描述一个函数使用的变量,这个变量是在函数外定义的
// bound varaiable术语有时候用来描述变量在函数内申明的包含函数的参数

// Function能够被嵌套,当一个内部函数对象创建出来,它包含一个创建这个内部函数的外部函数活动对象的引用.

// 这个机制,一个函数对象持有一个外部函数活动对象的引用,被称为闭包
// 这个是编程语言历史上最重要的发现
// 它是在scheme语言中发现的
// 它通过javascript来家喻户晓
// 它使得javascript非常有趣
// 没有这个,javascript仅仅是一大堆好的意图,愚蠢的实现,优雅叠在一起的数据流

/**
 * conclude
 */

 // 暂时不想写