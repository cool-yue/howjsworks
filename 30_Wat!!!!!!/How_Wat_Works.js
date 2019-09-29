/**
 * How Wat!Works
 */

 // 在2012年1月12号,在Ohio,Sandusky室内的水上乐园举办的CodeMash大会。
 // Gary Bernhardt呈现了一个闪电演讲标题是Wat

// Berhardt展示了Ruby和JavaScript中的一些荒谬的反常事情
// 在他展示完每个例子的后面,都配有一副图片上面加上Wat这样的说明文字
// 在场的人群都对这个很喜欢，它是比较有代表性
// Wat变成了了JavaScript的贵族

//  他的简洁的演出现在仍然能够在网上看到
// 很多模仿者都跑去制作类似的表演
// 一些人简单地重复了Berhardt的资料,一些人扩展这个行动,添加新的消化
// 有一些能够真正博得观众的真实的笑,就像B做的,一些人搞臭了那个房间

// 我已经在这本书中避免了大部分的JavaScript中不好的东西
// 但是在这一章中我们准备把那些魔鬼的裤子脱下来
// 我将会像你展示从Wat中的一些笑话
// 然后我会谈论和解释它们如何工作
// 这个不会很开心或者乐意去做

// 很多的笑话都是源自JavaScript == 和 + 这2个操作符背后的类型强制转化
// 类型强制转化规则很复杂,不好记,并且在某些情况,就像你将要看到的,是错的
// 那个就为什么我反对用==
// 它实现了ECMAScript的abstract Equality Comparison Algorithm
// 这是蠕虫罐头,没有什么值得打开的
// 永远使用 ===代替,永远

// 一些人不喜欢 === 因为它看起来比==要蠢一半,而==比=蠢2倍
// 尽管这样,正确的在JavaScript中的等号是===
// 避免使用 == ,这个是不错误的等操作

// 我不能够给出类似的不用+操作符的建议,因为+操作符是仅有的实际的添加数字的方式,所以enjoy这个蠕虫！

// "" == false // true
// [] == false // true
// null == false // false
// undefined == false // false
// 空的字符串是一个falsy值,所以一个草率的等操作符可能想要它和false混为一团
// 一个空数组不是一个falsy值,然而它还是被比较成了false
// null和undefined是falsy值,但是它们都没有被比较成false
// "Wat!"

// [] == [] // false
// [] == ![] // true
// 2个空数组不是同一个对象,所以他们不相等
// 但是第二行很惊讶。它好像就是javaScript是个语言,一个让 x 和 非x相等的语言
// 这个看起来非常地可笑的不称职.
// 这个就是它到底发生了什么

// 一个空数组是truthy,所以![]是false
// 草率等号操作符想要比较[]和false，但是它们都不是数
// 空数组强制转化成空字符串,空字符串强制转化成0
// false也强制转化成0
// 0 === 0,所以最后的答案是true
// Wat!

// [] + [] // ""
// [] + {} // "[object Object]"
// {} + {} // "[object Object][object Object]"
// 所有的这些案例应该创造出NaN.
// 这就是NaN生来的原因
// 相反,因为值不是数值,+操作符想要拼接它们
// 首先它必须要强制把他们转化成字符串
// Array.prototype.toString()方法把一个空数组转化成了一个空字符串
// 用JSON.stringify可能要好些,返回的是"[]"
// 没有什么意义的Object.prototype.toString()方法渲染objects为"[object Object]"
// 然后这些字符串就拼接在一起了
// Wat!

// 9999999999999999 // 10000000000000000
// 1e23 + 2e23 === 3e23 // false
// 大多数的大于Number.MAX_SAFE_INTEGER的数不能够被准确的表示
// Wat!

// "2" < 5 //true
// 5 < "11" // true
// "11" < "2" // true
// 比较不同类型的值应该抛出一个异常
// 相反,JavaScript意图强制转化这个值,所以可以做比较
// 强制转化规则破坏了传递性
// Wat!

// 1 < 2 < 3 // true
// 3 > 2 > 1 // false
// 这些案例应该有语法错误,因为语言不想正确处理它们
// 在第一个案例中,1和2比较,制造了一个true
// 然后true和3进行比较
// true转化成1.1小于3,所以是对的
// 所以这是完全碰巧的正确答案
// 一个有时给出正确答案的错误能够轻易避开测试的检查
// 在第二个案例中,3和2比较,创造true.然后true和1比较,true强制转化成1,1不小于1,所以给了个false
// Wat!

// "2" + 1 // "21"
// "2" - 1 // 1
// 另外一个算术操作符也能够做类型转换
// 但是它相比+操作符用了非常不一样的准则
// 你应该正确处理你的类型来避免这个草率
// 不要在string上面做算术
// 那些操作符都是为数值准备的
// Wat!

// Math.min() > Math.max() // true
// 这些函数是草率的。当不传入任何东西,他们应该返回undefined或者NaN或者可以抛出一个异常
// 悄悄相反,Math.min()返回Infinity,
// Wat!

// Math instanceof Math // throw exception
// NaN instanceof Nan // throw exception
// "wat" instanceof String // false
// Java中使用instanceof通常是无法理解如何使用多态的证据
// JavaScript中的instanceof跟java不同
// 我不推荐在任何语言中使用instanceof
// wat!

// isNaN("this string is no NaN") // true
// 全局的isNaN和isFinite函数都是坏的
// 用Number.isNaN和Number.isFinite代替
// wat!

// ((name) => [name])("wat") //["wat"]
// ((name) => {name})("wat") //undefined
// 第一个案例展示了一个肥箭头(fart放屁)函数.放屁是一个缩写的方式写函数
// 在fart左边的东西是一个参数列表
// 在fart右边的是一个表达式
// 表达式的值是函数的返回值
// 你不需要加类型function和return
// 在这个案例中,返回值是一个数组包含函数的参数.这是好的

// 第二个例子中应该返回{name:"wat"},而不是undefined
// 不行的是,JavaScript认为在fart后面的一个左边的大括号是一个代码块
// 不是一个对象字面量
// 这个块包含一个变量名.自动的冒号插入在name后面插入分号,
// 让它变成了一个没用的表达式语句,啥事也没做
// 缺少一个return语句
// 函数返回默认的返回值,undefined

// 这就是为什么我推荐避免使用farts.他们也会跟比较运算符<=和>=搞混
// 这个小小的输入的遍历,不值得这样
// "Wat!"

function first(w,a,t) {
    return {
        w,
        a,
        t
    };
}

first("wat","wat","wat"); // {w:"wat",a:"wat",t:"wat"}

function second(w,a,t) {
    return
        {w,a,t};
}
second("wat","wat","wat"); // undefined

// 第一个return的语句按照期待工作,返回了一个新的对象

// 第二个返回语句跟第一个唯一的不同就是空格,然而它返回的是undefined
// 自动分号插入在return后面插入了一个分号
// 左边的大括号的对象字面量在语句中的，现在变成了一个块来处理
// 块包含一个没有用的表达式语句
// 在表达式位置,逗号是一个操作符,不是一个分隔符,所以这个code并没有参数一个语法错误

// 自动分号的插入不是一个特性
// 它是一个错误
// 它被添加到一个语言尤其是对于那些不是特别确定哪里加上分号的初学者
// 你应该依靠自动分号插入,当你想要它呈现出你的代码是一个初学者写的
// Wat!
