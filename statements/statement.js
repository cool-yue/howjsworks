/**
 * How Statements works
 */

 // 我们可以把大多数的编程语言分成两类
 // 表达式语言和语句语言
 // 一个语句语言有语句和表达式
 // 一个表达式语言仅仅只有表达式
 // 表达式语言拥护者有一个理论的实体,争论说表达式语言是最强的
 // 但是没有很多理论为语句语言澄清
 // 就算是这样,所有的流行的语言包括JavaScript,都是语句语言

 // 早起的程序只是简单的指令的列表,有时组装句子,在某些语言中甚至以点号作为结束
 // 不幸的是,点号会跟十进制的数混淆,所以在后面的语言中
 // 语句的结束使用了分号

 // 结构化编程毁灭了简单的语句列表的想法
 // 允许语句列表里面嵌套其他语句列表
 // ALGOL 60就是第一代结构语言之一
 // 有begin和end来定界语句块
 // BCPL引入了{}来代替begin和end
 // 这个60年代的潮流保留了它时髦性大几十年了

 /**
  * Declaration
  * 申明
  */

// JavaScript 有3个语句用来在一个函数或者模块中声明变量。
// let,function,const
// 有一个过时的语句,var,那个是跟IE一起使用的,一个不被喜欢的浏览器

// 让我们讨论下let.
// let语句在当前作用域中申明一个新的变量
// 每一块(包含在{}中的语句字符串)创建一个作用域
// 在一个作用域中申明的变量在作用域外不可见
// let语句允许但是不是必须初始化
// 如果一个变量没有被初始化,它会被一个默认值undefined
// 一个let语句一次也允许申明多个变量
// 但是我推荐申明的每个变量,都有自己的一个let语句
// 这样增加了可读性和维护的简单性

// let语句同样也允许解构.这是一个难懂的语法,定义和初始化多个变量
// 通过使用数组或者对象的内容
// 所以
// let {huey,dewey,loudie} = my_little_object;
// 是下面的缩写
// let huey = my_little_object.huey;
// let deway = my_little_object.dewey;
// let louie = my_little_object.louie;

// 相似的
// let [zeroth,wunth,twoth] = my_little_array;
// 是下面的缩写
// let zeroth = my_little_array[0];
// let wunth = my_little_array[1];
// let twoth = my_little_array[2];

// 解构不是一个重要的特性但是它可以改善一些模式
// 也容易误用
// 对于重命名和默认值存在一些语法的可见性
// 但是引入了太多来的视觉的复杂度

// function 关键字申明创建一个函数对象和一个变量来包含它
// 不幸的是同样的语法作为函数表达式,就变成了了困惑之源

function my_little_function() {
    return "so small";
}

// 就是下面的缩写
let my_little_function = undefined;

my_little_function = function my_little_function() {
    return "so small";
}

// 注意到function的申明不会在一个分号中结束
// 但是let和赋值的语句会结束

// function的声明会提升。
// 这一块会从你的放函数申明的位置移动到一个函数体或者module的顶部
// 所有的被function定义中创造的let语句也会提升到顶部
// 紧接着所有的函数对象的应用到这些变量的赋值语句的执行

// 这就是为什么一个function的申明不应该放在块里面
// 放在函数体里或者模块里比较好
// 但是把一个function放在if和swith,while,do,for语句中是不好的

// const语句像let语句但是有2个很大的不同
// 初始化必须的,没得选,并且变量在后面不可继续赋值
// 当我有选择的话,我会选择const,因为它能促进更好的纯粹性

// const显然是constant的缩写.
// 那个单词很有问题因为它预示着永久性或者永恒的
// 一个const是个短暂瞬息能够消失的东西当函数返回之后
// 它可能每一次程序运行或者函数调用的时候都有不同的值
// 还要注意到当一个const的值是一个可变的值比如没有冰冻的array和没有冰冻的object
// 这些数组和对象的值可以被赋值,但这个const变量不能赋值
// Object.freeze在值上工作不在变量上面工作
// const在变量上工作不在值上工作
// 理解变量和值的不同非常重要,变量包含值的引用,值从来不包含变量

let my_littilewitespace_variable = {};
const my_little_constant = my_littilewitespace_variable;
my_little_constant.butterfly = "free"; // {butterfly:"free"}
Object.freeze(my_littilewitespace_variable);
my_little_constant.monster = "free"; //FAIL
my_little_constant.monster // undefined
my_little_constant.butterfly //"free"
my_littilewitespace_variable = Math.PI; 
// my_littilewitespace_variable is approximately π
my_little_constant = Math.PI ; //FAIL

/**
 * Expression
 * 表达式
 */
/**
 * Branching
 * 分支
 */
/**
 * Looping
 * 循环
 */
/**
 * Disruption
 * 中断
 */
/**
 * potpourri
 * 杂项
 */
/**
 * punctuation
 * 标点符号
 */


