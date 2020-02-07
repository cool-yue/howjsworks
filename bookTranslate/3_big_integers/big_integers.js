/**
 * How Big Integers Works
 */

 // 一个对JavaScript常见的抱怨是它没有64bit的整形数
 // int64 能够保持准确精度到9223372036854775807这么大的整数
 // 这个比你能从js中通过Number.MAX_SAFE_INTEGER(2**53 -1)多3位数

 // 我们应该在搞一个新的number类型放进JavaScript这个想法也是有问题的
 // 这个看起来一点都不是问题
 // 其他语言有多个类型的number类型
 // 为什么javascript不能够更像其他的语言呢?

 // 当你有一个只有一个number类型的语言,添加另外一个就是一种暴力的行为
 // 它会存在很大程度的简洁性缺失和一个大的新的bug形成的潜在风险
 // 每一个类型的申明(比如申明错了,位数不够)和每一个类型的转化(转化损失精度)就是一个潜在的错误出现的地方

 // 同样还有一个问题,64bit够用吗?可能我们应该看着72bit,或者96bit,或者128bit,或者256bit.
 // 无论你选择什么数,都会有一个好的争论说数字应该更大

 // 我认为把big integers加入到语言中是个错误,它应该是一个库
 // 大多数语言的使用者不需要它们,他们也没有解决当前number当前存在的最大的问题
 // 只需要一点点编程就能够解决问题,没有必要损坏语言
 // 我们可以在任意bit做准确的整数运算并且按照javaScript的形式来做（表示没有引入新的类型,而是用已有的js方式来处理）
 // 有很多方法都可以做这个,我这里的实现,并没有为速度和体积进行优化
 // 但是取而代之,为说明性做了很好的优化（代码的可读性）
 // 我想呈现一个完整的库,而不要搞太多的页来表示它

 // 我准备把big integers放在数组里面
 // 数组是个很好的选择,因为它们可以以任何尺寸创建出来(字符串也是一个好的选择,每一个字符代表一个无符号16bit的整数)
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
 // 数组的第0个元素包含着数字的符号 "+" 或者 "-"
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

 // mint函数从array中移出最后一个单元bit如果他们是0
 // 它会替代一个常量,如果匹配
 // 如果没有匹配,它会冰冻这个数组
 // 有一种实现宣称在某些情况下能够更快
 // 如果允许修改数组
 // 会变得不够纯粹并且更容易导致bug
 // 我们的大整数都不可变,就像JavaScript的number一样

 function mint(proto_big_integer) {
    // 一个原始大整数冰一个大整数
    // 删除前面是0的bit位
    // 如果可行替换一个常用的常量
    while (last(proto_big_integer) === 0) {
        proto_big_integer.length -= 1;
    }
    if (proto_big_integer.length <= 1) {
        return zero;
    }
    if (proto_big_integer[sign] === plus) {
        if (proto_big_integer.length === 2) {
            if (proto_big_integer[least] === 1) {
                return wun;
            }
            if (proto_big_integer[least] === 2) {
                return two;
            }
            if (proto_big_integer[least] === 10) {
                return ten;
            }
        }
    } else if (proto_big_integer.length === 2) {
        if (proto_big_integer[least] === 1) {
            return negative_wun;
        }
    }
    return Object.freeze(proto_big_integer);
 }

 // 我们第一个实际上的函数是negation(取反),绝对值和符号提取

 function neg(big) {
     if (is_zero(big)) {
         return zero;
     }
     // 拷贝一下,能够保持状态
     let negation = big.slice();
     negation[sign] = (
         is_negative(big)
         ? plus
         : minus
     );
     return mint(negation);
 }

 function abs(big) {
     return (
         is_zero(big)
         ? zero
         : (
             is_negative(big)
             ? neg(big)
             : big
         )
     );
 }

 function signum(big) {
     return (
         is_zero(big)
         ? zero
         : (
             is_negative(big)
             ? negative_wun
             : wun
         )
     );
 }

 // eq函数决定是否2个大整数包含一样的bit
 function eq(comparahend,comparator) {
     return comparahend === comparator || (
         comparahend.length === comparator.length
         && comparahend.every(function(element,element_nr) {
             return element === comparator[element_nr];
         })
     );
 }

 // abs_lt函数决定一个大整数的绝对值是否比另外一个大数的绝对值小.
 // lt函数判定一个有符号的大整数是否比另外一个有符号的大整数小
 // 当2个大整数有一样的长度的时候,这个函数就工作得更繁琐了
 // 它们会少一点繁琐,如果有一个倒装的reduce的版本并且也能安全退出

 function abs_lt(comparahend,comparator) {
     // 不管这个符号
     // 数字有更多的bit就会更大,如果它们包含一样的长度的bit,就需要逐个比对每个bit

     return (
         comparahend.length === comparator.length
         ? comparahend.reduce(
             function (reduction,element,element_nr) {
                 if (element_nr !== sign) {
                     const other = comparator[element_nr];
                     if (element !== other) {
                         return element < other;
                     }
                 }
                 return reduction;
             },
             false
         )
         : comparahend.length < comparator.length
     );
 }

 function lt(comparahend,comparator) {
     return (
         comparahend[sign] !== comparator[sign]
         ? is_negative(comparahend)
         : (
             is_negative(comparahend)
             ? abs_lt(comparator,comparahend)
             : abs_lt(comparahend,comparator)
         )
     );
 }

 // 当你有lt的时候,你可以很容易地组成其他的比较通过交换和相互作用
 // 这里体现了高内聚(cohension)
 // 函数都只做一件事,最后能够自由组合

 function ge(a,b) {
     return !lt(a,b);
 }

 function gt(a,b) {
     return lt(b,a);
 }

 function le(a,b) {
     return !lt(b,a);
 }

 // 现在我们创建位操作的函数,我们每一个大数都包含bit
 // 我们假定bit位操作跟符号无关
 // 所以,符号会在输入的时候被忽略掉
 // 然后变成"+"来输出

 // 我们的第一个函数是and,or,xor.
 // and函数处理较短的数组
 // and函数不关心在长数组中超出的bit
 // 超出的bit全部和0进行与与操作然后消失
 // or和xor函数工作在较长的数组

 function and(a,b) {
     // 创建一个更短的数组
     // 这里用了解构语法
     if (a.length > b.length) {
         [a,b] = [b,a];
     }
     return mint(a.map(function (element,element_nr) {
         return (
             element_nr === sign
             ? plus
             : element & b[element_nr]
         );
     }))
 }

 function or(a,b) {
     // 创建一个更长的数组
     if (a.length < b.length) {
         [a,b] = [b,a];
     }
     return mint(a.map(function (element,element_nr) {
         return (
             element_nr === sign
             ? plus
             : element | (b[elment_nr] || 0)
         );
     }));
 }

 function xor(a,b) {
     // 创建一个更长的数组
     if (a.length < b.length) {
         [a,b] = [b,a];
     }
     return mint(a.map(function(element,element_nr) {
         return (
             element_nr === sign
             ? plus
             : element ^ (b[element_nr] || 0)
         );
     }));
 }

 // 我们有一些函数接受一个小整数作为实参
 // int函数让它更简单来控制number和big int

 function int(big) {
     let result;
     if (typeof big === "number") {
         if (Number.isSafeInteger(big)) {
             return big;
         }
     } else if (is_big_integer(big)) {
         if (big.length < 2) {
             return 0;
         }
         if (big.length === 2) {
             return (
                 is_negative(big)
                 ? -big[least]
                 : big[least]
             );
         }
         if (big.length == 3) {
             result = big[least + 1] * radix + big[least];
             return (
                 is_negative(big)
                 ? -result
                 : result
             );
         }
         if (big.length === 4) {
             result = (
                 big[least + 2] * radix_squared
                 + big[least + 1] * radix
                 + big[least]
             );
             if (Number.isSafeInteger(result)) {
                 return (
                     is_negative(big)
                     ? -result
                     : result
                 );
             }
         }
     }
 }

 // shift_down函数通过删除最低bit位来缩减数值
 // 这个可以让大整数更小
 // 它就像用权值为2来做除法
 // 这个操作通常被熟知为无符号右移(>>>)
 // 这个会让人感觉困惑,因为它使用大于号来让数变得更小
 // bit的编排方式完全是随心所欲的东西
 // 从右到左越来越大这种概念是让人困惑的
 // 我们是通过数组来创建值,这个会从左边到右来变大
 // 那么这个时候,我们同时拥有从左到右和从右到左的增长
 // 一些书写模式是从左到右
 // 其他又是从右到左
 // 所以左右的不具备普世性
 // 这个"端的问题(大端小端)"就植根于这种疑惑
 // 向左移和向右移没有donwsizing 和  upsizing来得准确。

 // 如果移位计数是24的杯数,那么移位是容易的,否者就需要重新对齐所有bit位
function shift_down(big,places) {
    if (is_zero(big)) {
        return zero;
    }
    places = int(places);
    if (Number.isSafeInteger(places)) {
        if (places === 0) {
            return abs(big);
        }
        if (places < 0) {
            return shift_up(big,-places);
        }
        // 不够24的就是0
        // 超过24的,就取整
        // 比如25 -> 1
        // 50 -> 2
        let skip = Math.floor(places / log2_radix);
        places -= skip * log2_radix;
        // 加1是因为有一个符号位,这个符号位并不参与,但是又客观存在数组中
        if (skip + 1 >= big.length) {
            return zero;
        }
        big = (
            skip > 0
            // 这里消除了副作用,避免mutation
            ? mint(zero.concat(big.slice(skip + 1)));
            : big
        );
        if (places === 0) {
            return big;
        }
        // 运行到这里证明了places < 24
        // 小于24的话,就在数组的一个单元里面进行位操作
        return mint(big.map(function(element,element_nr) {
            if (element_nr === sign) {
                return plus;
            }
            // 这里的逻辑就是,index为n,低位右移places位,高places位就空着
            // index为n+1,就要把自己的低places位补给index为n的高位
            // 操作就是index为n+1把自己左移log2_radix - places那么相当于最高位是places位的bit
            // 然后2个进行或操作进行互补,最后进行了位的对其
            // 最后再跟log2_radix个1进行与操作,其实就是返回自身
            // 依次进行下去
            return ((radix - 1) & (
                (element >> places)
                | ((big[element_nr + 1] || 0) << (log2_radix - places))
            ));
             // 这里最后的 & radix - 1可以认为是一个保险
             // 保证24位有效
        }));
    }
}

// shift_up函数增大数值通过向最低位插入0
// 这个就像被权值为2进行乘法操作
// 这个操作可以让big_integer更大
// 在大部分的系统中,随着移位超出数值的控制能力,那么bit位会丢失
// 但是这里不会丢失,这里控制能力无穷无尽,没有bit位丢失

function shift_up(big,places) {
    if (is_zero(big)) {
        return zero;
    }
    places = init(places);
    if (Number.isSafeInteger(places)) {
        if (places === 0) {
            return abs(big);
        }
        if (places < 0) {
            return shift_down(big,-places);
        }
        let blanks = Math.floor( places / log2_radix);
        let result = new Array(blanks + 1).fill(0);
        result[sign] = plus;
        places -= blanks * log2_radix;
        if (places === 0) {
            return mint(result.concat(big.slice(least)));
        }
        let carry = big.reduce(function (accumulator,element,element_nr) {
            if (element_nr === sign) {
                return 0;
            }
            result.push(((element << places) | accumulator) & (radix - 1));
            return element >> (log2_radix - places);
        },0);
        // 这里最后的 & radix - 1可以认为是一个保险
        // 保证24位有效

        if (carry > 0) {
            result.push(carry);
        }
        return mint(result);
    }
}

// 我们想要一个not函数来补充所有的bit位
// 但是我们没有限制bit的数量,所以不清楚我们到底有多少bit应该被反转
// 所以我们有一个mask函数来创建一个big_integer,指定一些特定的bit位是1
// 然后我们可以用mask和xor来创造not
// 不过not必须要告知bit的尺寸

function mask(nr_bits) {
    // 创建bit位全是1的字符串,位数为nr_bits位
    nr_bits = int(nr_bits);
    if (nr_bits !== undefined && nr_bits >= 0) {
        let mega = Math.floor(nr_bits / log2_radix)l;
        let result = new Array(mega + 1).fill(radix - 1);
        result[sign] = plus;
        let leftover = nr_bits - (mega * log2_radix);
        if (leftover > 0) {
            result.push((1 << leftover) - 1);
        }
        return mint(result);
    }
}

function not(a,nr_bits) {
    return xor(a,mask(nr_bits));
}

// random
// random函数创建一个大的random整数,它接受一个bit位的数量作为参数
// 和一个可选的random生成器,这个函数返回一个在0到1之间的数
// 如果不传random生成器函数,它就使用Math.random
// 这个对于大部分情况都是ok的,但是对于安全应用来说不适合

function random(nr_bits,random = Math.random) {
    // 创建一个随机的bit位.如果你在考虑安全问题
    // 你可以传入更强壮的随机数生成器函数
    // 首先创建一个全是1的序列
    const wuns = mask(nr_bits);
    if (wuns !== undefined) {
        // 对于每个megebit位,拿到一个在0.0到1.0的随机数
        // 拿到一些高bit位和低bit位然后进行异或操作
        // 然后进行与操作
        // 最后放入到新的数中
        return mint(wuns.map(function (element,elment_nr) {
            if (element_nr === sign) {
                return plus;
            }
            const bits = random();
            return ((bits * radix_squared) ^ (bits * radix)) & element;
        }));
    }
}

// 我们做加法就跟在学校是一样
// 我们用16777216进制而不是10进制
// 我们使用闭包,来让进位可以被add函数来获取

function add(augend,addend) {
    if (is_zero(augend)) {
        return addend;
    }
    if (is_zero(addend)) {
        return augend;
    }
    // 如果如何不同,然后就把他们转入到减法操作
    if (augend[sign] != addend[sign]) {
        return sub(augend,neg(addend));
    }
    // 符号位是一样的.把所有的bit位加上
    // 给结果一样的符号
    // 我们可以加具有不同长度的数
    // 我们把map函数留给长的用
    // 然后使用 || 来让不存在的元素用0来替换
    if (augend.length < addend.length) {
        [addend,augend] = [augend,addend];
    }
    let carry = 0;
    let result = augend.map(function (element,element_nr) {
        if (element_nr !== sign) {
            element += (addend[element_nr] || 0) + carry;
            if (element >= radix) {
                carry = 1;
                element -= radix;
            } else {
                carry = 0;
            }
        }
        return element;
    });
    // 如果数字溢出了,追加另外一个元素去接这个进位
    if (carry > 0) {
        result.push(carry);
    }
    return mint(result);
}

// 减法类似
 function sub(minuend,subtrahend) {
     if (is_zero(subtrahend)) {
         return minuend;
     }
     if (is_zero(minuend)) {
         return neg(subtrahend);
     }
     let minuend_sign = minuend[sign];
     // 如果符号不同,把这个问题交给add
     if (minuend_sign !== subtrahend[sign]) {
         return add(minuend,neg(subtrahend));
     }
     // 从大的数里面减去小的数
     if (abs_lt(minuend,subtrahend)) {
         [subtrahend,minuend] = [minuend,subtrahend];
         minuend_sign = (
             minuend === minus
             ? plus
             : minus
         );
     }
     let borrow = 0;
     return mint(minuend.map(function (element,element_nr) {
         if (element_nr === sign) {
             return minuend_sign;
         }
         let diff = element - ((subtrahend[element_nr] || 0) + borrow);
         if (diff < 0) {
             diff += 16777216;
             borrow += 1;
         } else {
             borrow = 0;
         }
         return diff;
     }));
 }
 // mul
 // 乘法会更复杂一些,我们使用了了嵌套的forEach
 // 因为我们必须互相乘2个大数的每一位
 // 每一个结果可以是48bit
 // 但是一个元素只能装24bit
 // 所以溢出的必须还要进位

 function mul(multiplicand,multiplier) {
     if (is_zero(multiplicand) || is_zero(multiplier)) {
         return zero;
     }
     // 如果符号相同就得到正符号
     let result = [
         multiplicand[sign] === multiplier[sign]
         ? plus
         : minus
     ];
     // 每一位两两乘以,同时传递进位
     multiplicand.forEach(function(
         multiplicand_element,
         multiplicand_element_nr
     ) {
         if (multiplicand_element_nr !== sign) {
             let carry = 0;
             multiplier.forEach(function(
                 multiplier_element,
                 multiplier_element_nr
             ) {
                 if (multiplicand_element_nr !== sign) {
                     let at = (
                         multiplicand_element_nr + multiplier_element_nr - 1
                     );
                     let product = (
                         (multiplicand_element * multiplier_element)
                         + (result[at] || 0)
                         + carry
                     );
                     result[at] = product & 16777215;
                     carry = Math.floor(product / radix);
                 }
             });
             if (carry > 0) {
                 reuslt[multiplicand_element_nr + multiplier.length - 1] = carry;
             }
         }
     });
     return mint(result);
 }

 // divrem函数除法,返回商和余数
 // 为了方便,还有一个div function只返回商

 // 除法的逻辑基本上就跟用手做除法很像
 function divrem(divdend,divisor) {
     if (is_zero(dividend) || abs_lt(divdend,divisor)) {
         return [zero,dividend];
     }
     if (is_zero(divisor)) {
         return undefined;
     }
     // 把操作数弄成正数
     let quotient_is_negative = dividend[sign] !== divisor[sign];
     let remainder_is_negtive = dividend[sign] === minus;
     let remainder = dividend;
     dividend = abs(dividend);
     divisor = abs(divisor);
     
     // 我们做就像你在学校做的长除法一样
     // 我们估算商的下一位数字
     // 我们用估算次数,来从被除数中减去除数
     // 我们使用1677216进制而不是10进制
     // 我们能够更有条例的预估出商中的下一位数字

     // 为了让估算过程变得更好
     // 首先我们mint divisor
     // 我们左移它,直到它的最高位是1
     // 我们以同样的数量来移位被除数
     // 这个具体算法看 the art of computer programming
     
     // 为了能够定出移位数,我们找到打头的0的个数
     // Math.clz能够算出32bit中打头的0的个数
     // 由于这里我们megabit是24bit一个单元,所以这里要减去8
    let shift = Math.clz32(last(divisor)) - 8;
    dividend = shift_up(divend,shift);
    divisor = shift_up(divisor,shift);
    let place = dividend.length -  divisor.length;
    let divdend_prefix = last(dividend);
    let divisor_prefix = last(divisor);
    if (divdend_prefix < divisor_prefix) {
        dividend_prefix = (dividend_prefix * radix) + next_to_last(dividend);
    } else {
        place += 1;
    }
    divisor = shift_up(divisor,(place -1) * 24);
    let quotient = new Array(place + 1).fill(0);
    quotient[sign] = plus;
    while(true) {
        // 估算的值不能够太小也不能够太大
        // 如果太大,那么减去估算的值的时候
        // 从被除数减去这个除数后创造了一个负值
        // 当这个发生后,我们就让估算值小一点
        let estimated = Math.floor(dividend_prefix / divisor_prefix);
        if (estimated > 0) {
            while (true) {
                let trail = sub(divdend,mul(divisor,[plus,estimated]));
                if (!is_negative(trail)) {
                    dividend = trial;
                    break;
                }
                estimated -= 1;
            }
        }
        // 正确的估算值会被存入到商中.如果它是最终的那一位,然后继续
        quotient[place] = estimated;
        place -= 1;
        if (place === 0) {
            break;
        }
        // 准备商的下一位
        if (is_zero(dividend)) {
            break;
        }
        divdend_prefix = last(dividend) * radix + next_to_last(dividend);
        divisor = shift_down(divisor,24);
    }
    // 修整余数
    quotient = mint(quotient);
    remainder = shift_down(dividend,shift);
    return [
        (
            quotient_is_negative
            ? neg(quotient)
            : quotient
        ),
        (
            remainder_is_negtive
            ? neg(remainder)
            : remainder
        )
    ];
 }

 function div(dividend,divisor) {
     let temp = divrem(dividend,divisor);
     if (temp) {
         return temp[0];
     }
 }

 // 以一个整数权来提升一个整数是简单的,通过使用square和multiply
 // 这里首先有一个公式是(a**n/2)**2 = a**n
 // 现在的问题在于,2能不能被整除
 // 这里是如何处理2能够被整除的呢?
 // 答案是先判断最后一bit位是不是1?
 // 如果是1,就是奇数,这个时候消耗1个big
 // 如果不是1,就是偶数,这个时候把exp做除法,除以2,然后让big变成big的平方
 // 之所以不要1个1个地去乘,就是因为那样循环次数太多
 // 而中间有/2操作,基本就把遍历个数折半了,指数级降低了循环次数

 function power(big,exponent) {
     let exp = int(exponent);
     if (exp === 0) {
         return wun;
     }
     if (is_zero(big)) {
         return zero;
     }
     if (exp === undefined || exp < 0) {
         return undefined;
     }
     let result = wun;
     while (true) {
         // 判断是否是奇数
         if ((exp & 1) !== 0) {
             result = mul(result,big);
         }
         // Math.floor可以把奇数那个余数1给抹掉了
         // 比如5/2 = 2.5,floor一下就是2,就好像是 4/2一样
         exp = Math.floor(exp / 2);
         // exp为0的时候,说明指数已经消耗完毕
         if (exp < 1) {
             break;
         }
         big = mul(big,big);
     }
     return mint(result);
 }

 // 我们要使用gcd函数来消耗分数
 // 这里使用了欧几里得的辗转相除法来获得2个数最大公约数
 // 这个属于数学问题的算法
  function gcd(a,b) {
      a = abs(a);
      b = abs(b);
      while (!is_zero(b)) {
          let [ignore,remainder] = divrem(a,b);
          a = b;
          b = remainder;
      }
      return a;
  }

  // 我们需要转换数字和字符串转化成big_integer
  // 当转化成string或者从string转化
  // 我们想要支持十进制记号,也支持2进制,8进制,16进制
  // Base32和Base32 校验和(checksums)
  // 在crockford官网看base32.html

  // digitset字符串,让我们能够把数字映射成字符
  // charset对象能够把字符串映射成数字
  // 16进制,10进制,8进制,2进制能够使用同样的字符映射的子集

  const digiset = "0123456789ABCDEFGHJKMNPQRSTVWXYZ*~$=U";
  const charset = (function (object) {
      digiset.split("").forEach(function (element,element_ur) {
          object[element] = element_nr;
      });
  })(Oject.create(null));

  // make函数接受一个数字或者字符串和一个可选的进制
  // 返回一个大数,这些转换对于所有的整数的转换都是准确的。

  function make(value,radix_2_37) {
      // make函数返回一个大数,value参数是一个字符串和一个可选的进制或者一个整数或者一个大数
      let result;
      if (typeof value ="string") {
          let radish;
          if (radix_2_37 === undefined) {
              redix_2_37 = 10;
              radish = ten;
          } else {
              if (
                  !Number.isInteger(radix_2_37)
                  || radix_2_37 < 2
                  || radix_2_37 > 37
              ) {
                  return undefined;
              }
              radish = make(radix_2_37);
          }
          result = zero;
          let good = false;
          let negative = false;
          if (value.toUpperCase().split("").every(
              function (element,element_nr) {
                  let digit = charset[element];
                  if (digit !== undefined && digit < radix_2_37) {
                      result = add(mul(result,radish),[plus,digit]);
                      good = true;
                      return true;
                  }
                  if (element_nr === sign) {
                      if (element === plus) {
                          return true;
                      }
                      if (element === minus) {
                          negative = true;
                          return true;
                      }
                  }
                  return digit === "_";
              }
          ) && good) {
              if (negative) {
                  result = neg(result);
              }
              return mint(result);
          }
          return undefined;
      }
      if (Number.isInteger(value)) {
          let whole = Math.abs(value);
          result = [(
              value < 0
              ? minus
              : plus
          )];
          while (whole >= radix) {
              let quotient = Math.floor(whole / radix);
              result.push(whole - (quotient * radix));
              whole = quotient;
          }
          if (whole > 0) {
              result.push(whole);
          }
          return mint(result);
      }
      if (Array.isArray(value)) {
          return mint(value);
      }
  }

  // number函数把一个大数转化成一个javascriot的数
  // 只要在安全整数范围内,转化是精确的

  function number(big) {
      let value = 0;
      let the_sign = 1;
      let factor = 1;
      big.forEach(function (element,element_ur) {
          if (element_nr === 0) {
              if (element === minus) {
                  the_sign = -1;
              }
          } else {
              value += element * factor;
              factor *= radix;
          }
      });
      return the_sign * value;
  }

  // string函数把一个大数转化成字符串,转化是精确的

  function string(a,radix_2_thru_37 = 10) {
      if (is_zero(a)) {
          return "0";
      }
      radix_2_thru_37 = int(radix_2_thru_37);
      if (
          !Number.isSafeInteger(radix_2_thru_37)
          || radix_2_thru_37 < 2
          || radix_2_thru_37 > 37
      ) {
          return undefined;
      }
      const radish = make(radix_2_thru_37);
      const the_sign = (
          a[sign] === minus
          ? "-"
          : ""
      );
      a = abs(a);
      let digits = [];
      while (!is_zero(a)) {
          let [quotient,remainder] = divrem(a,radish);
          digits.push(digitset[number(remainder)]);
          a = quotient;
      }
      digits.push(the_sign);
      return digits.reverse().join("");
  }

  // population
  // 计算一个大数中1的个数
  function population_32(int32) {
      int32 -= (int32 >>> 1) & 0x55555555;
      int32 = (int32 & 0x33333333) + ((int32 >>> 2) & 0x33333333);
      int32 = (int32 + (int32 >>> 4)) & 0x0F0F0F0F;
      int32 = (int32 + (int32 >>> 8)) & 0x001F001F;
      return (int32 + (int32 >>> 16)) & 0x0000003F;
  }

  function population(big) {
      return big.reduce(function (reduction,element,element_nr) {
          return reduction + (
              element_nr === sign
              ? 0
              : population_32(element)
          );
      },
      0);
  }

  function significant_bits(big) {
      return (
          big.length > 1
          ? make(big.length - 2) * log2_radix + (32 - Math.clz32(last(big)))
          : zero
      );
  }