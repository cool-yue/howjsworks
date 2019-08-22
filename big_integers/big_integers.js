/**
 * How Big Integers Works
 */

 // 一个对JavaScript常见的抱怨是它没有64bit的整形数
 // int64 能够把持准确大到9223372036854775807的整数
 // 这个比你能从js中通过Number.MAX_SAFE_INTEGER(2**53 -1)多3位数

 // 我们应该在搞一个新的number类型放进JavaScript这个想法也是有问题的
 // 这个看起来一点都不是问题
 // 其他语言有多个类型的number类型
 // 为什么javascript不能够更像其他的语言呢?

 // 当你有一个只有一个number类型的语言,添加另外一个就是一种暴力的行为
 // 它会存在很大程度的简洁性缺失和一个大的新的bug形成的潜在风险
 // 每一个类型的申明(比如申明错了,位数不够)和每一个类型的转化(转化损失经度)就是一个潜在的错误出现的地方

 // 同样还有一个问题,64bit够用吗?可能我们应该看着72bit,或者96bit,或者128bit,或者256bit.
 // 无论你选择什么数,都会有一个好的争论说数字应该更大

 // 我认为把big integers加入到语言中是个错误,它应该是一个库
 // 大多数语言的使用者不需要他们,他们也没有解决当前数字面临的最大的问题
 // 带着一点点编程,没有必要损坏语言
 // 我们可以在任意bit做准确的整数运算并且按照javaScript分配bit的形式来做
 // 有很多方法都可以做这个,我这里的实现,并没有为速度和体积进行优化
 // 但是取而代之,为说明性做了很好的优化
 // 我想呈现一个完整的库,而不要搞太多的页来表示它

 // 我准备把big integers放在数组里面
 // 数组是个很好的选择,因为它们可以以任何尺寸创建出来(字符串也是一个号的选择,每一个字符代表一个无符号16bit的整数)
 // 数组的每一个元素装着这个big integer的一部分bit位
 // 一个重要的设计问题就是一个数组元素装多少个bit位
 // 最大可行的答案是53，正安全整数的尺寸
 // 编程语言提供了让这个是32或者更少的冲动,因为那样可以允许使用位操作符号
 // 如果我们的尺寸比32bit位大,那么位操作符就不能用,实现就会非常复杂

 // 甚至32都太大了如果我们考虑乘法和除法
 // 在实现大数的乘法和除法,我们想要使用JavaScript的乘法操作符,但是他只能在53比特是准确的.
 // 那就意味着我们的数不能超过53bit的一半,我选择24bit,我能够用26但是我喜欢24,这个数更round(圆?)
 // 因为我的第一个程序在control data 3150上面跑,一个24bit的主机
 // 我们称这些24bit为megadigits
 // 因为他可以代表普通数字表示的数的100万倍,相当于做了一个2*24进制的数
 // 2*24 === 16777216

 // 我选择一个有符号的系数表示
 // 数组的第0个元素包含着数字的符号 + 或者 -
 // 第一个元素放着最低那些位,最后的元素放着最高的那些位
 // 所以9000000000000000000可以表示成这样:
 ["+"，"8650752","7098594","31974"]
 // 这非常不错,因为9000000000000000000 = 8650752 + (7098594 + (31974 * 16777216) * 16777216)

 // 我造些常量和辅助函数来让内部的功能更加简单

 const radix = 16777216;
 const radix_squared = radix * radix;
 const log2_radix = 24;
 const plus = "+";
 const minus = "-";
 const sign = 0;
 const least = 1;

 function last(array) {
     return array[array.length-1];
 }

 function next_to_last(array) {
     return array[array.length - 2];
 }

 // 我创造了一些常量,我们不是真的需要它们,但是他们能够让代码读起来更好些

 const zero = Object.freeze([plus]);
 const wun = Object.freeze([plus,1]);
 const two = Object.freeze([plus,2]);
 const ten = Object.freeze([plus,10]);
 const negative_wun = Object.freeze([minus,1]);

 // 我们需要检测函数,来检查大整数和负大整数
 function is_big_integer(big) {
     return Array.isArray(big) && (big[sign] === plus || big[sign] === minus);
 }

 function is_negative(big) {
     return Array.isArray(big) && big[sign] === minus;
 }

 function is_positive(big) {
     return Array.isArray(big) && big[sign] === plus;
 }

 function is_zero(big) {
     return !Array.isArray(big) || big.length < 2;
 }