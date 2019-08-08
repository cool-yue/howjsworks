/**
 * how names work
 */

// javascript想要让你把你的变量给名字(标志符),你的属性也要给名字,还有有些时候是函数也要给名字
// Javascript对于变量名的长度没有限制,所以慷慨一点.劲量多,让你的程序告诉他们自己的故事.
// 不要使用含义隐晦的名字

// 我第一次被教编程是被数学家来教并且我去为一个公司工作,这个公司制造电脑,电脑里面用BASIC语言编程
// 在那个时候,BASIC的变量名是一个单一的大写字母和一个可选的数字,就像A1.
// 我养成了一个非常坏的习惯，用一个字母当做变量名,10年后,我仍然很挣扎于这个。
// 有一次有些错误的东西出现在了你面前,它确实比较难去修复，我们从来不应该停止去变得更聪明
// 数学家喜欢那些含义隐晦和简要的记号。我们已经学到一个很难的方式,编程应该演进成有描述能力和不言自明
// 编程不是数学,它是另外一门艺术

// 将你的名字以字母开头,并且以一个字母结尾。javaScript允许names以下划线(_)或者美元符($)开头
// 能够以下划线(_)或者美元符($)或者数字(digit)结尾
// javaScript允许很多事情,这些事情你真的不要去做,这些玩笑应该为代码生成器和宏处理器保留
// 人类应该做得更好

// 一个开头或者结尾的下划线(_)有时意图是暗示一个公有属性或者全局属性应该是私有的
// 如果程序是正确方式去写的话
// 所以一个悬垂的下划线(_)是一个标志预示着程序员不称职

// 美元符被加入到语言中是为了给code generator来用,tanspilers和宏处理器使用
// 因此他们能够保障生成的名字不跟你的冲突了,如果你不是程序,请离开美元符($)

// 后面跟着一个数字在一个名字中,这种情况总是预示着程序员没有为名字给足够的思考

// 我给我的普通变量名字像thing_nr.我给我的重要的变量名字像nr_things.

// 在名字中包含多个单词是很好的。但是几乎没有一个共识怎么样去做由于空格不能够放在名字中
// 有一个学校坚持使用驼峰,首字母的大小区分了单词之间的边界,有另外一个学校坚持使用下划线(_)
// 放在空格的位置,来区分单词的边界,有第三个学校仅仅是把所有的单词放在一起，丢失了单词的边界
// 这些学校不能够达成一个最佳实践.这个争论已经有一年又一年,就是没有一个共识,那是因为所有的学校都错了

// 正确的答案是用空格来分离单词.编程语言当前不允许这样,因为编译器在50年代必须运行在一个非常小的千词数量的空间里面
// 名字的空间被考虑成一个非常的奢侈.FORTRAN实际上已经圆满完成,允许让名字包含空格,但是后来语言都不遵循那个号的例子
// 甚至是后面的语言(包括javascript)遵照FORTRAN的非常坏的例子,使用等号(=)来作为赋值操作符,并且需要()在条件if旁边
// 而不是使用大括号在结果的周围

// 我希望喜爱一个语言做正确的事情并且允许名字含有空格来增加可读性。我们衡量内存以GB,所以语言设计者现在已经很自由地去
// 发明更好的语言,直到现在,使用下划线(_)在多个单词中。那个将会是下一个语言的最简单的过渡

// 所有在javascript里面的名字应该以小写字母开头.这是因为有一个问题和Javascript的new操作符有关
// 如果一个函数的调用是以new作为前缀,然后这个函数式被称为constructor,其余的时候函数作为函数调用
// 构造器的功能和函数的功能很不一样。
// Errors可以可能以错误的方式调用一个constructor,让这个变得更疑惑constructor和function看起来几乎是一样的
// 所以没有自动的方式来检测由于缺失一个new或者多一个new导致的问题
// 所以我们有一个约定俗称：所有的constructor必须以一个大写字母开头并且其余的都不能够以大写字母开头
// 那样给出了一个视觉的暗示,来帮助找出错误

// 我对于这个问题的解决方案更可靠,从来不用new.那样就消除了需要使用大写字母的必要。
// 我任然建议避免使用首字母大写,因为有可怕多的程序还在用new

/**
 * Reserved Words
 * 保留字
 */

 // 一下是JavaScript的保留字列表:
 // arguments await break case catch class const continue debugger default delete
 // do else enum eval export extends false finally for function if implements
 // import in Infinity instanceof interface let NaN new null package private
 // protected public return static super switch this throw true try typeof 
 // undefined var void while with yield

 // 记住这个列表,很重要.这里面的单词不能够当做变量名使用或者参数名
 // javascript的规则关于保留字的很惊奇地复杂,所以也有一些其他的情况这些词能够被使用
 // 但是在这些怪异的情况下也不要用

// 保留字的使用时另外一个不好的功能,根结还是50年代 60年代的内存缺失。
// 有保留字在一个语言能够让编译器更简单,让它节约一些字节。
// 摩尔定律毁掉了这些缺点,但是那个限制的思维一直保持着。
// 保留字显然对于程序员是个不好的事
// 你还记得这个保留字清单么,可能有个单词能够完美地描述你的变量
// 但是它已经被分配给一个糟糕的功能,这个功能你从来不用
// 或者那个从来没有被实现。
// 保留字对于程序设计者总是坏的因为易碎的保留字策略让它非常困难以一种干净,直接的方式添加新的功能在一个语言中
// 我希望下个语言不要弯腰来使用保留字
