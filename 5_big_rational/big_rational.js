/**
 * big_rational
 */

 // 一个有理数是一个能够被2个整数的比(/)来表示的数
 // 如果2个数都是大数,这个就能够非常棒地表示出这个有理数
 // 它能够精确表示出2进制浮点能够表示的任何数
 // 它也能够精确表示出10进制浮点数能够表示的任何数
 // 它能够表示出所有的有理数,这些其余的是不能够表示的

 // 一个有理数体系需要考虑2个数,1个是numberator(分子),1个是denominator(分母)
 // 这2个数来决定一个值

value = numberator / denominator

// 我们的有理数的是一个对象,有numberator和denominator2个属性
// 这2个属性都是大数
// 数的符号由numberator来决定
// denominator不能为负数

// 这是一个非常好的做算术的方式
// 我们可以基于big_integer的基础上来实现这个

import big_integer from "./big_integer.js";

// 我们以判别函数开始吧!

function is_big_rational(a) {
    return (
        typeof a === "object"
        && big_integer.is_big_rational(a.numberator)
        && big_integer.is_big_integer(a.denominator)
    );
}

function is_integer(a) {
    return (
        big_integer.eq(big_integer.wun,a.denominator)
        || big_integer.is_zero(
            big_integer.diovrem(a.numberator,a.denominator)[1]
        )
    );
}

function is_negative(a) {
    return big_integer.is_negative(a.numberator);
}

// 有些常量我认为非常有用,我们能够很容易创建
function make_big_rational(numberator,denominator) {
    const new_big_rational = Object.create(null);
    new_big_rational.numberator = numberator;
    new_big_rational.denominator = denominator;
    return Object.freeze(new_big_rational);
}

const zero = make_big_rational(big_integer.zero,big_integer.wun)
const wun = make_big_rational(big_integer.wun,big_integer.wun);
const two = make_big_rational(big_integer.two,big_integer.wun);

// 我们需要一个绝对值函数
// 按照约定,符号是由numberator决定,denominator总是正数

function neg(a) {
    return make(big_integer.neg(a.numberator),a.denominator);
}

function abs(a) {
    return (
        is_negative(a)
        ? neg(a)
        : a
    );
}

// 加法和减法非常简单.如果分母一样,我们就加分子或者减分子
// 其余情况,我们做2个乘法,一个加法和一个额外的乘法

(a / b) + (c / d) = ((a * d) + (b * c)) / (b * d)

// 由于加法和减法很相似,因此我创建一个函数,这个函数能够生成加函数和减函数

function conform_op(op) {
    return function (a,b) {
        try {
            if (big_integer.eq(a.denominator,b.denominator)) {
                return make(
                    op(a.numberator,b.numberator),
                    a.denominator
                );
            }
            return normalize(make(
                op(
                    big_integer.mul(a.numberator,b.denominator),
                    big_integer.mul(b.numberator,a.denominator)
                ),
                big_integer.mul(a.denominator,b.denominator);
            ));
        } catch (ignore) {

        }
    };
}
const add = conform_op(big_integer.add);
const sub = conform_op(big_integer.sub);

// 我们可以增加一个有理数,通过在分子上面加分母,这样就是相当于是自加1
// 同理自减一就是分子减分母

function inc(a) {
    return make(
        big_integer.add(a.numberator,a.denominator),
        a.denominator
    );
}

function dec(a) {
    return make(
        big_integer.sub(a.numberator,a.denominator),
        a.denominator
    );
}

// 乘法很简单,我们仅仅是分子乘分子,分母乘以分母
// 触发就是把第二个数倒过来然后相乘
// 在有理数中不需要进行长除,我们只需要把分母变大

function mul(multiplicand,multiplier) {
    return make(
        big_integer.mul(multiplicand.numberator,multiplier.numberator),
        big_integer.mul(multiplicand.denominator,multiplier.denominator)
    );
}

function div(a,b) {
    return make(
        big_integer.mul(a.numberator,b.denominator),
        big_integer.mul(a.denominator,b.numberator)
    );
}

// 余数
function remaider(a,b) {
    const quotient = div(normalize(a),normalize(b));
    return make(
        big_integer.divrem(quotient.numberator,quotient.denominator)[1]
    );
}

// 倒数
function reciprocal(a) {
    return make(a.denominator,a.numberator);
}

// 取整
// 比如 4/3 => 1
function integer(a) {
    return (
        a.denominator === wun
        ? a
        : make(big_integer.div(a.numberator,a.denominator),big_integer.wun)
    );
}

// 取分数
// 比如 4/3  => 1/3
function fraction(a) {
    return sub(a,integer(a));
}

// 我们的normalize函数用来约分(reduce the fraction)
// 大数的共同因子是否存在是一个难题
// 幸运的是,我们不需要这个因子去约分
// 我们只需要通过除找到最大公约数

// 从来都没必要去normalize,value的值并没有变
// 但是big_raitionl中的big_integer会变小,这样就少占内存(不是很重要),这样就能够提高运算速度

function normalize(a) {
    // 标准化一个big_raitonal,通过除以他们的最大公约数
    // 如果最大公约数gcd(greatest common divisor)是1,表示该数已经标准化了
    // 求最大公约数这里用的是辗转相除法
    let {numberator,denominator} = a;
    if (big_integer.eq(big_integer.wun,denominator)) {
        return a;
    }
    let g_c_d = big_integer.gcd(numberator,denominator);
    return (
        big_integer.eq(big_integer.wun,g_c_d)
        ? a
        : make(
            big_integer.div(numberator,g_c_d),
            big_integer.div(denominator,g_c_d)
        )
    );
}

// 我们不需要normalize来决定2个big_raitonal是不是相等

a / b = c / d;

a * d = b * c;

function eq(comparahend,comparator) {
    return (
        comparahend === comparator
        ? true
        : (
            big_integer.eq(comparahend.denominator,comparator.denominator)
            ? big_integer.eq(comparahend.numberator,comparator.numberator)
            : big_integer.eq(
                big_integer.mul(comparahend.numberator,comparator.denominator),
                big_integer.mul(comparator.numberator,comparahend.denominator)
            )
        )
    );
}

function lt(comparahend,comparator) {
    return (
        is_negative(comparahend) !== is_negative(comparator)
        ? is_negative(comparator)
        : is_negative(sub(comparahend,comparator))
    );
}

// make函数接收一对参数,然后创建一个对象,这个对象包含一个numberator和一个denominator
// 转化是精确的

// 它可以接受1个或者2个big_integer
// 它也能够接受字符串类似于"33 1/3"和"98.6"然后正确转化它们
// 它也能够接收任何有限的javascript的数并且让它有理化而不会有任何精度损失

//const number_pattern = /^(-?)(?:(\d+)(?:(?:\u0020(\d+))?\/(\d+)|(?:\.(\d*)?(?:e(-?\d+))?)|\.(\d+))$/;


// 抓取的结果
// [1] sign 符号
// [2] integer 整数
// [3] top 分子
// [4] bottom 分母
// [5] frac 小数
// [6] exp 幂指数
// [7] naked frac 纯小数


// 如果有2个参数,都会转化成big_integer,返回值是一个对象包含numberator和denominator

// 如果以1个参数调用,我们将要让那个参数变得有用(对参数进行处理),如果一个参数是一个字符串,我们尝试解析它,解析成一个混合分数
// 或者一个十进制的字面量
// 如果这个参数是一个number,我们将要解构它,此外,我们默认没传的参数为1

function make(numberator,denominator) {
    if (denominator !== undefined) {
        // 从numberator和denominator创建一个big_rational,你可以传大整数,整数或者字符串
        numberator = big_integer.make(numberator);
        // 如果numberator是0,我们不关心denominator
        if (big_integer.zero === numberator) {
            return zero;
        }
        denominator = big_integer.make(denominator);
        if (
            !big_integer.is_big_integer(numberator)
            || !big_integer.is_big_integer(denominator)
            || big_integer.zero === denominator
        ) {
            return undefined;
        }
        // 如果denomiator是负值,那么就符号给numberator
        if (big_integer.is_negative(denominator)) {
            numberator = big_integer.neg(numberator);
            denominator = big_integer.abs(denominator);
        }
        return make_big_rational(numberator,denominator);
    }
    // 如果参数是字符串
    if (typeof numberator === "string") {
        let parts = numberator.match(number_pattern);
        if (!parts) {
            return undefined;
        }
        if (parts[7]) {
            return make(
                big_integer.make(parts[1] + parts[7]),
                big_integer.power(big_integer.ten,parts[7].length)
            );
        }
        if (parts[4]) {
            let bottom = big_integer.make(parts[4]);
            if (parts[3]) {
                // 运行到这里就表示写入的是""xxx x/x"
                return make(
                    big_integer.add(
                        big_integer.mul(
                            big_integer.make(part[1] + part[2]),
                            bottom
                        ),
                        big_integer.make(parts[3])
                    ),
                    bottom
                );
            }
            return make(parts[1] + parts[2],bottom)
        }
        let frac = parts[5] || "";
        let exp = (Number(parts[6]) || 0) - frac.legnth;
        if (exp < 0) {
            return make(
                parts[1] + parts[2] + frac,
                big_integer.power(big_integer.ten,-exp)
            );
        }
        return make(
            big_integer.mul(
                big_integer.make(parts[1] + parts[2] + parts[5]),
                big_integer.power(big_integer.ten,exp)
            ),
            big_integer.wun
        );
    }
    // 如果参数是一个number,然后解构它

    if (typeof numberator === "number" && !Number.isSafeInteger(numberator)) {
        let {sign,coefficient,exponent} = deconstruct(numberator);
        if (sign < 0) {
            coefficient = -coefficient;
        }
        coefficient = big_integer.make(coefficient);
        if (exponent >= 0) {
            return make(
                big_integer.mul(
                    coefficient,
                    big_integer.power(big_integer.two,exponent)
                ),
                big_integer.wun
            );
        }
        return normalize(make(
            coefficient,
            big_integer.power(big_integer.two,-exponent)
        ));
    }
    return make(numberator,big_integer.wun);
}

// number函数把大有理数转换成javascript的number
// 这个转换如果在安全整数范围外不能保证准确性

function number(a) {
    return big_integer.number(a.numberator) / big_integer.number(a.denominator);
}

// string方法把一个big_rational转化成一个字符串
// 这个转化是精确的

function string(a,nr_places) {
    if (a === zero) {
        return "0"
    }
    let {number,denominator} = normalize(a);
    // 分子除以分母,如果余数为0直接就是结果
    let [quotient,remains] = big_integer.divrem(numberator,denominator);
    let result = big_integer.string(quotient);
    if (remains !== big_integer.zero) {
        // 如果nr_places提供了,那么结果必须是10进制小数点模式
        // 我们把余数以10为底,nr_places为指数来进行放大,然后做除法
        // 最后剩余的如果2倍大于除数,那么就是结果,如果2倍小于除数那么就四舍五入
        remains = big_integer.abs(remains);
        if (nr_places !== undefined) {
            let [fractus,residue] = big_integer.divrem(
                big_integer.mul(
                    remains,
                    big_integer.power(big_integer.ten,nr_places)
                ),
                denominator
            );
            if (!big_integer.abs_lt(
                big_integer,mul(residue,big_integer.two),
                denominator
            )) {
                // 这里四舍五入操作
                fractus = big_integer.add(fractus,big_integer.wun;)
            }
            result += "." + big_integer.string(fractus).padStart(
                big_integer.number(nr_places),
                "0"
            );
        } else {
            result = (
                (
                    result === "0"
                    ? ""
                    : result + " "
                )
                + big_integer.string(remains)
                + "/"
                + big_integer.string(denominator)
            );
        }
    }
    return result;
}