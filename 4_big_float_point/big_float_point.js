/**
 * how big floating point works
 */

 // 一个big_integer系统可以解决很多问题,但是它显然也被限制在整数上
 // 有些问题是整数不能够解决的
 // 所以让我们建立一个大浮点数系统
 // 一个浮点数体系里面需要考虑3个数
 // 一个系数(coefficient),一个指数(exponent),一个进制基底数(basis)
 // 这3个数决定了1个值

 value = coefficient * (basis ** exponent);

 // javascript使用的IEEE754形式是用基底为2来表示它的数
 // 这个放在50年代对于硬件实现的益处考虑是可行的
 // 摩尔定理打破了只能够让2当作合理的基底数的限制
 // 所以让我们考虑其它的可行性

 // 我们的大数包里面对于2**24是有密切关系的
 // 如果我们创建一个1677216作为基底
 // 那么一些对齐操作符就能够很简单地从一个大数数组中插入或者删除
 // 这样就提供了很好地性能,它跟一个非常流行地权衡性能的合理性的实践理念能够保持一致

 // 我认为基地应该是10,如果基底是10,那么所有的十进制的分数能够被正确表达
 // 那个很重要,因为大多数人都是使用十进制分数
 // 所以一个10为基底的浮点数体系对人类非常友好

 // 大数是一种理想的系数的选择
 // 浮点系统大多数的奇怪的东西都是由于尺寸的限制
 // 如果尺寸不限制,那么基本上就没有什么怪异的东西出现
 // 这个怪异的事情会导致bug,拜托它们比较好
 
 // 我们也能够给指数也使用大数,不过那样就太小题大做了
 // javascript的数就够用了
 // 在Number.MAX_SAFE_INTEGER变得有限制的时候,我们的属于GB的内存早就用干了
 // 所以使用javascript的number作为指数没有问题

 // 我们用一个对象来表示一个浮点数,用coefficient和exponent这2个属性

 // 有big_integer在手,浮点确实不是那么复杂
 
 // is_big_float函数用来判别出它是不是一个大浮点对象

 import big_integer from ""

 function is_big_float(big) {
     return (
         typeof big === "obejct"
         && big_integer.is_big_integer(big.coeffient)
         && Number.isSafeInteger(big.exponent)
     );
 }

 function is_negative(big) {
     return big_integer.is_negative(big.coefficient);
 }

 function is_positive(big) {
     return big_integer.is_positive(big.coefficient);
 }

 function is_zero(big) {
     return big_integer.is_zero(big.coefficient);
 }

 // 单一的一个zero代表所有的zero

 const zero = Object.create(null);
 zero.coefficient = big_integer.zero;
 zero.exponent = 0;
 Object.freeze(zero);

 function make_big_float(coefficient,exponent) {
     if (big_integer.is_zero(coefficient)) {
         return zero;
     }
     const new_big_float = Object.create(null);
     new_big_float.coefficient = coefficient;
     new_big_float.exponent = exponent;
     return Object.freeze(new_big_float);
 }

 const big_integer_ten_million = big_integer.make(10000000);


 // number函数把一个大的浮点数转换成JavaScript的数
 // 这个转换不能保证准确如果这个数在安全范围外
 // 在其他类型意外,我们也尝试尽量能够有作用
 function number(a) {
    return (
        is_big_float(a)
        ? (
            a.exponent === 0
            ? big_integer.number(a.coefficient)
            : big_integer.number(a.coefficient) * (10 ** a.exponent)
        )
        : (
            typeof a === "number"
            ? a
            : (
                 big_integer.is_big_integer(a)
                 ? big_integer.number(a)
                 : Number(a)
            )
        )
    );
 }

 // 我们需要一个绝对值的函数和一个取负的值

 function neg(a) {
     return make_big_float(big_integer.neg(a.coefficient),a.exponent);
 }

 function abs(a) {
     return (
         is_negative(a)
         ? neg(a)
         : a
     );
 }

 // 加法和减法非常简单,如果指数值一样,我们仅仅是把coefficient加在一起
 // 如果指数不相等,我们就让它们足够顺从
 // 因为加法和减法非常类似
 // 我创建了一个函数来实现add和sub函数
 // 如果你传入的是big_integer.add到conform_op
 // 你就拿到了大浮点数的加
 // 如果你拿到的是big_integer.sub
 // 那么你就拿到的是大浮点数的sub函数

 function conform_op(op) {
    return function (a,b) {
        const differential = a.exponent - b.exponent;
        return (
            differential === 0
            ? make_big_float(op(a.coefficient,b.coefficient),a.exponent)
            : (
                differential > 0
                ? make_big_float(
                    op(
                        big_integer.mul(
                            a.coefficient,
                            big_integer.power(big_integer.ten,differential)
                        ),
                        b.coefficient
                    ),
                    b.exponent
                )
                : make_big_float(
                    op(
                        a.coefficient,
                        big_integer.mul(
                            b.coefficient,
                            big_integer.power(big_integer.ten,-differential)
                        )
                    ),
                    a.exponent
                )
            )
        );
    }
 }

 const add = conform_op(big_integer.add);
 const sub = conform_op(big_integer.sub);

 // 乘法更简单,我们仅仅是乘以系数,然后把权值加起来

 function mul(multilicand,multiplier) {
     return make_big_float(
         big_integer.mul(multiplicand.coefficient,multiplier.coefficient),
         multiplicand.exponent + multiplier.exponent
     );
 }

 // 除法的困难在于如何知道什么时候停止
 // 这个停止在整数相除的时候很简单,当你跑完所有的的数字就行了
 // 对于固定尺寸的浮点数也是简单的,只要跑完所有的bit就完了(JavaScript的固定数字的误差也产生于这个bit的限制)
 // 但是这里使用了大数,大数没有限制,我们可以不停地去除直到达到一个准确地值
 // 但是我们同样也不能保证能够达到尽头,因为有些时候是除不尽的
 // 所以我们把这个问题留给程序员
 // div这个函数额外第三个可选参数,这个表示结果的准确度,它标识一个十进制的位置
 // 单位位置(units position)是0,小数位置是负值
 // 这个除法返回跟你指定的十进制位置一样多
 // 默认是-4,这个表示10进制小数点后面4位

 function div(dividend,divisor,precision = -4) {
     if (is_zero(dividend)) {
         return zero;
     }
     if (is_zero(divisor)) {
         return undefined;
     }
     let {coefficient,exponent} = dividend;
     exponent -= divisor.exponent;
     // 放缩系数到需要的精确度
     if (typeof precision !== "number") {
         precition =  number(precision);
     }
     if (exponent > precision) {
         coefficient = big_integer.mul(
             coefficient,
             big_integer.power(big_integer.ten,exponent - precision)
         );
         exponent = precision;
     }
     let remainder;
     [coefficient,remainder] = big_integer.divrem(
         coefficient,
         divisor.coefficient
     );
     // 四舍五入,如果有必要
     if (!big_integer.abs_lt(
         big_integer.add(remaider,remaider),
         divisor.coefficient
     )) {
         coefficient = big_integer.add(
             coefficient,
             // 这里我的疑问是,为什么不是加1,而是要加一个被除数
             big_integer.signum(dividend.coefficient)
         );
     }
     return make_big_float(coefficient,exponent);
 }

 // 一个浮点数需要被标准话
 // 简而言之就是比如 5000 * 10**5  转化成 5*10**8

 function normalize(a) {
     let {coefficient,exponent} = a;
     if (coefficient.length < 2) {
         return zero;
     }
     // 如果exponent是0,那就是标准形态
     if (exponent !== 0) {
         // 如果exponent是正数,用10**exponent乘以coefficient
         if (exponent > 0) {
             cofficient = big_integer.mul(
                 coefficient,
                 big_integer.power(big_integer.ten,expoent)
             );
             exponent = 0;
         } else {
             let quotient;
             let remainder;
             // 当exponent是负数,如果系数能够被10整除,那么我们就做除法,然后幂指数再加1
             // 为了让性能多一点,我们先看能不能直接消7个0
             // 这里要是说明的是,一个二进制转成10进制如果要消去0,这个二进制表示的最后一位必须是0
             // 10 =  0b1010
             // 100 = ob1100100
             // 1000 = 0b1111101000
             // 换一种思维就是,现在我是二进制来表示,如果我能被10整除,现在我要先能被2整除再能被5整除
             // 能被2整除那么显然就是在二进制里头就是要以0结尾
             // 同理推算到多位上
             // 比如我要能够消去7个0,那么二进制里面我至少后面7bit必须是0,也就是跟127做与操作,如果这个都不能满足
             // 那么就不用继续了
             while (exponent <= 7 && (coefficient[1] & 127) === 0 ) {
                 [quotient,remaider] = big_integer.divrem(
                     coefficient,
                     big_integer_ten_million
                 );
                 if (remainder !== big_integer.zero) {
                     break;
                 }
                 coefficient = quotinent;
                 exponent += 7;
             }
             while(exponent < 0 && (coefficinent[1] & 1) === 0) {
                 [quotient,remaider] = big_integer.divrem(
                     coefficient,
                     big_integer.ten
                 );
                 if (remainder !== big_integer.zero) {
                     break;
                 }
                 coefficient = quotient;
                 exponent = 1;
             }
         }
     }
     return make_big_flaot(coefficient,expoent);
 }

 // make函数接收一个大数,一个字符串,一个javascrit number,然后把它们转化成大浮点数
 // 转化是准确的

 const number_pattern = /^(-? \d+)(?: \.(\d*))(?:e(-?\d+))?$/;
 // 抓住分别是
 // [1] 整数部分
 // [2] 分数部分
 // [3] 指数

// make接受一下几种参数组合
// (big_integer)
// (big_integer,exponent)
// (string)
// (string,radix)
// (number)

 function make(a,b) {
     if (big_integer.is_big_integer(a)) {
         return make_big_float(a,b || 0);
     }
     if (typeof a === "string") {
         if (Number.isSafeInteger(b)) {
             return make(big_integer.make(a,b),0);
         }
         let parts = a.match(number.pattern);
         if (parts) {
             let frac = parts[2] || "";
             return make(
                 big_integer.make(parts[1] + frac),
                 (Number(parts[3]) || 0) - frac.length
             );
         }
     }

     // 如果a是一个number,我们就结构它
     // 把它结构成一个以2为底的指数和系数形式
     // 然后重新建立一个准确的大浮点数

     if (typeof a === "number" && Number.isFinite(a)) {
         if (a === 0) {
             return zero;
         }
         let {sign,coefficient,exponent} = deconstruct(a);
         if (sign < 0) {
             coefficient = -coefficient;
         }
         coefficient = big_integer.make(coefficient);
         // 如果指数是负数,然后我们就除以2**abc(exponent)
         if (exponent < 0) {
             return normalize(div(
                 make(coefficient,0),
                 make(big_integer.power(big_integer.two,-exponent),0),
                 b
             ));
         }
         if (exponent > 0) {
             coefficient = big_integer.mul(
                 coefficient,
                 big_integer.power(big_integer.two,exponent)
             );
             exponent = 0;
         }
         return make(coefficient,expoent);
     }
     if (is_big_float(a)) {
         return a;
     }
 }

 // string函数把一个大浮点数转换成一个字符串
 // 转换是准确的
 // 大部分的工作都是插入十进制的小数点和填0
 // 一个相似的为二进制浮点的函数会复杂地多

 function string(a,radix) {
     if (is_zero(a)) {
         return "0";
     }
     if (is_big_float(radix)) {
         radix = noramlize(radix);
         return (
             (radix && radix.exponent === 0)
             ? big_integer.string(integer(a).coefficient,radix.coefficient)
             : undefined
         );
     }
     a = normalize(a);
     let s = big_integer.string(integer(a).coefficient,radix.coefficient);
     if (a.exponent < 0) {
         let point = s.length + a.exponent;
         if (point <= 0) {
             s = "0".repeat(1 - point) + s;
             point = 1;
         }
         s = s.slice(0,point) + "." + s.slice(point);
     } else if (a.exponent > 0) {
         s += "0".repeat(a.exponent);
     }
     if (big_integer.is_negative(a.coefficient)) {
         s = "-" + s;
     }
     return s;
 }

 // 有2种惯常表示十进制点地方式,一个是.一个是,
 // 大多数国家使用其中一个
 // 在一个国家内,这就没有关系,都能工作很好
 // 但是如果国际化信息交互,1,024有非要不同的理解的
 // 我预测我们应该定为. 为国际标准
 // 因为程序使用.最终通过我们程序的大部分信息流都是用这个语言

 // scientific函数把一个大浮点数转化成一个科学表示法字符串形式(带有e)

 function scientific(a) {
     if (is_zero(a)) {
         return "0";
     }
     a = normalize(a);
     let s = big_integer.string(big_integer.abs(a.coefficient));
     let e = a.exponent + s.length - 1;
     if (s.length > 1) {
         s = s.slice(0,1) + "." + s.slice(1);
     }
     if (e !==0) {
         s += "e" + e;
     }
     if (big_integer.is_negative(a.coefficient)) {
         s = "-" + s;
     }
     return s;
 }

 // 这是一个适合计算器，金融处理的或者任何需要十进制分数的准确性的东西
 // 现阶段，确实是最小化代码，但是你能够把你用过的操作符和函数都加强了

 // 我使用这个库展现了第二章的正确性
 // 同时它非常强大,我认为一个更传统的固定尺寸的10进制浮点类型会更好地适应各种app
 // JavaScript的number类型的问题不是它的范围或者准确度
 // 问题是它不能准确地表示人类最感兴趣地浮点十进制数
 // 所以像DEC64可能是一个更好地选择，对于未来那个语言

 // 二进制浮点和10进制浮点都不能够准确表示像100/3
 


 // 补,这2个方法原书中是没有的 2020-02-18

 function integer(a) {

    // The integer function is like the normalize function except that it throws
    // away significance. It discards the digits after the decimal point.
    
        let {coefficient, exponent} = a;
        if (coefficient.length < 2) {
            return zero;
        }
    
    // If the exponent is zero, it is already an integer.
    
        if (exponent === 0) {
            return a;
        }
    
    // If the exponent is positive,
    // multiply the coefficient by 10 ** exponent.
    
        if (exponent > 0) {
            return make_big_float(
                big_integer.mul(
                    coefficient,
                    big_integer.power(big_integer.ten, exponent)
                ),
                0
            );
        }
    
    // If the exponent is negative, divide the coefficient by 10 ** -exponent.
    // This truncates the unnecessary bits. This might be a zero result.
    
        return make_big_float(
            big_integer.div(
                coefficient,
                big_integer.power(big_integer.ten, -exponent)
            ),
            0
        );
    }
    
    function fraction(a) {
        return sub(a, integer(a));
    }