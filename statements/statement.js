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
// JavaScript允许任何的表达式出现在语句的位置。这是一个松散但是非常流行的语言设计的实践
// JavaScript有3个表达式类型在语句的位置中是有意义的
// 它们分别是赋值,调用,删除
// 不幸的是,所有的其他类型的表达式也允许在语句中出现但是降低了编译器找到错误的能力

// 一个赋值语句在一个变量中代替了引用,或者修改了一个可修改的对象或者数组
// 一个赋值语句包含4部分

// 0.一个左值,一个表达式来接收值.它可以是一个变量或者一个创建一个对象或者数组的表达式和一个精确查询,一个.号后面跟着一个属性名字
// 或者一对中括号[],中括号里面是一个创建一个属性名或者数字的表达式。

// 1.一个赋值语句:
// = 赋值
// += 加赋值
// -= 减赋值
// *= 乘赋值
// /= 除赋值
// % 取余
// **= 指数赋值
// >>>= 右移位赋值
// >>= 有符号右移动
// <<= 左移动赋值
// &= 位与赋值
// |= 位或赋值
// ^= 位亦或赋值

// 2.一个表达式,这个表达式的值会被存起
// 3.一个分号

// 我不推荐使用增加操作符++或者--.
// 它们在指针算法的古董时代创建的
// 我们既然发现了指针算法是有害的
// 所以现代语言不在允许它
// 最流行的语言有指针算法的是c++
// 一个以++命名的很坏的语言

// 我们摆脱指针,但是我们仍然困于++.现在它加1到某些东西上
// 为什么我们会想一个不同的加1而不是加其他的值?那有什么意义嘛?

// 答案是:没有啥意义

// 让事情更糟,++有前置+和一个后置+形式。很简单讲它们反过来,那个就很难debug
// ++被牵连到buffer中让错误和安全问题到处横行
// 我们应该摒弃没有必要和危险的特性

// 表达式语句不纯粹.一个赋值语句和delete语句显然导致了改变
// 一个丢出返回的值的调用是不是纯粹的,取决于是否有副作用
// 表达式语句是唯一不是以标志符开始的的语句
// 这个语法的优化导致了不纯粹

/**
 * Branching
 * 分支
 */

// JavaScript 有2个分支语句,if,switch,不是一个太多就是2个太多的
// 我不推荐使用switch,它是一个tony hoare的邪恶混合的case语句
// 和 FORTRAN的计算goto语句

// 没有什么用switch语句写是if不能够写的,反而if还更清晰

// switch语句提供一个不明确的变量,但是饱受一个贯穿全局的危险,这个危险导致错误和不好的实践
// 并且有样式的问题,一个case应该跟switch对齐还是应该缩进?
// 可能没有一个准确的答案

// 一个对象能够被用来一个switch语句的另外一个实现方式
// 把对象用function来填入,这个function实现了每个case的行为
// 匹配case 变量的值就是键

const my_little_result = my_little_object[case_expression]();

// 你的case_expression 从你的对象中选择了一个函数,然后被调用
// 如果case_expression不匹配你的函数中的一个,一个异常就会升起来给你

// 不幸的是,这种形式也有一个潜在的安全危险因为this的绑定.

// if 语句比 swtich 语句要好. 它的else不是一个语句
// 是一个子句,所以它不应该像一个语句一样缩进
// else应该放在同一行正如}来关闭当前块

// javascript期待条件部分是一个boolish的值,而不是非要是bool值
// 我觉得这是一个错误,JavaScript应该坚持是bool值
// 我推荐你提供一个bool值,哪怕程序允许你更松散去使用

// else if 形式允许if语句来代替switch语句,而不会很野性在屏幕上面留在缩进
// 它会被误用,误用会带来困惑的控制流
// else if 形式应该被用在类似于case的结构中
// 如果一个else子句以一个if开始,可能使用else if更好并且不要把if放进else块中
// else if 形式不应该被使用,如果当前这个块是以混乱地形式结束

// 当写一个纯粹的函数式风格时,最好使用三元运算符
// 三元运算符经常被误用
// 误用导致给了它一个坏的名声
// 在括号中包装整个三元表达式
// 给一个换行在开始的括号后面并且对齐条件和2个结果

let my_little_value = (
    is_mythical
    ? (
        is_scary
        ? "monster"
        : "unicorn"
    )
    : (
        is_insect
        ? "butterfly"
        : "rainbow"
    )
);


/**
 * Looping
 * 循环
 */

 // JavaScript有3个循环语句,for,while和do,2个太多了,3个也太多了

 // for语句是FORTRAN的do语句的后代.
 // 都是用来处理数组里面一次处理一个元素
 // 就把索引指示变量的工作大部分推给了程序员
 // 相比来说,我应该使用像forEach这样的数组的方法,这个方法能够自动处理索引指引变量
 // 我期待着未来版本的语言,数组的方法,当给定纯粹的函数来应用到元素
 // 能够做大多数的并行的工作
 // 那时候差的程序使用for语句还是只能一次处理处理一个元素

 // 我发现当教新手编程时候,3部分的控制很困惑(初始化;条件;增长)
 // 子句不够明显又或者为什么它们要以那个特定的顺序
 // 没有一个语法的可视性来使得它更简单地看得清楚或者更好记

 // 我不推荐使用for语句

 // while语句和do语句都是用来做循环的
 // 他们的语法很不一样,但是运行上的唯一不同是while在循环的顶部检查条件
 // do语句在底部检查条件
 // 非常奇怪的是如此大的视觉差异却只有如此小的运行的不同

 // 我发现很多循环不仅仅是想要在顶部或者底部来break循环
 // 它们常常想在中间就是用break所以很多我的像这样

 while(true) {
     // do some work
     if (are_we_done) {
         break;
     }
     // do some more work;
 }

 // 最好地写循环的方式是使用tail recursion(尾调,函数式编程风格)



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


