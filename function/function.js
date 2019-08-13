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
// 它是一个隐藏的数据结构,这个数据结构持有当前这个函数执行所有需要的相关信息和绑定和正在调用的函数的活动的返回地址

// 在像c语言这样的语言,活动对象被分配在一个栈上.
// 他们解除分配（弹栈）当函数返回
// JavaScript以不同的方式处理
// JavaScript在(heap)堆上分配一个活动对象,就像一个普通的对象一样
// 活动对象不会自动的失去活性当函数返回的时候
// 相反,只要有一个引用指向这个活动对象,活动对象就会存在
// 活动对象的回收就像普通对象一样回收

// 一个活动对象包含:
// 一个对函数对象的引用
// 调用的活动对象的引用,这个被用return来使用来给回控制权
// 恢复信息

// activation object(活动对象)对于你来讲不可见
//