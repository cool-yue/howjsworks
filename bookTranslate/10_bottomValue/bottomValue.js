/**
 * How Bottom Values Work
 */

 // bottom value(保底值),是一个特殊的值
 // 这个值于是这一个递归的数据结构的结束或者一个值的缺失
 // 在编程语言中,bottom values可以有名字比如nil,none,nothing和null

 // javaScript有2个bottom values:null和undefined
 // NaN也可以被考虑成一个保底的值,预示着一个数字的缺失
 // 如果一个语言是缺失了bottom values可以被认为是一个设计上的错误

 // null和undefined在JavaScript中的模糊概念的对象的是唯一的非对象
 // 企图拿到一个它们的一个属性值,会抛出异常

 // 在某些方面null和undefined是互相是非常相似的
 // 但是在某些方面它们又不一样
 // 它们可以部分替换,但不可以完全替换
 // 有2个事物,它们可以看成一样的,但是有时又不一样,这本身就是一种困惑
 // 时间都被浪费了,去选择到底何时使用它们中的哪一个
 // 这种无理由的理论导致更多的困惑,然而困惑会导致bug

 // 我们能够创造更好的程序,如果我们消除到它们中的一个
 // 我们不能在语言中去消除它
 // 但是我们可以在我们的程序中去消除它
 // 我们应该抛弃null,而只用undefined

 // 正常情况下,当强制在2个单词中选择的时候,我倾向于短的那个
 // null有一个已知的编程和数据结构的上下文含义
 // undefined没有
 // 更多时候,undefined是一个困惑的名字
 // 它不是数学家所说的那种undefined
 // 它更不是程序员所表达的undefined

 // 所以使用null看起来会更适合,为什么我还会偏向undefined？
 // 原因是undefined只有javaScript自己使用
 // 如果你定义一个变量用let 或者 var
 // 并且没有明确的初始化
 // JavaScript会隐秘地去以undefined去初始化
 // 这个很困惑的原因是新定义的变量有一个undefined作为它的值,它是一个值,它是一个值!
 // 如果你不传足够的参数到一个函数中,额外的参数会被设置成undefined
 // 如果你拿一个对象的属性，正好对象又缺这个属性,它就给你undefined
 // 若果你拿到一个数组的元素,然后那个数组确实,它给你undefined

 // 唯一我用null的地方是Object.create(null)来创建一个新的空对象
 // 一个明确的错误,如果使用Object.create()和Object.create(undefined)

 // null 和 undefined能够通过等号来检测相等性

 function stringify_bottom(my_little_bottom) {
    if (my_little_bottom === undefined) {
        return "undefined";
    }
    if (my_little_bottom === null) {
        return "null";
    }
    if (Number.isNaN(my_little_bottom)) {
        return "NaN";
    }
 }

 // 你有时可以看到旧时代的写法(typeof my_little_bottom === "undefined"),
 // 这个也能工作
 // 但是typeof my_little_bottom === "null"会失败
 // 因为typeof null 返回 "object"不是"null"
 // 这个很坏因为(typeof my_little_object === "object")给了一个假的真值当my_little_object是null
 // 意思就是我其实想判断这个东西是个对象,但是实际上它是null它不是对象,但是他返回的却是"object"
 // 这样会导致一个错误,检查希望避免这个错误
 // 这就不用null的另外一个原因

 // undefined是严格的比null要好,但是它却遭受着路径的问题
 // 你回想起缺失的属性的值是undefined
 // 所以你不能够想着使用一连串的点号(.)和[]作为一个路径
 // 你必须把它认为是一个独立操作的序列,任何一个都有可能失败
 // 这样就会导致代码变成下面这样:

 my_little_first_name = (
     my_little_person
     && my_little_person.name
     && my_little_person.name.first
 );

 // 逻辑与&&操作符,用来防止去计算一个东西如果在左侧的东西是falsy
 // 这是一个大而丑而慢,但是它避免了异常,如果经常像下面这么干:
 my_little_first_name = my_little_person.name.first;
 // 前提是undefined能够像一个对象那么去工作并且不像一个非对象的东西。

 /**
  * conclusion
  */
 // 保底值一定要个正确的理解,缺失和显式赋值undefined,返回的值是一样,但是它们的意义不同
 // 经常使用 XX && XX && XX && XX这样的操作,来防止抛出异常