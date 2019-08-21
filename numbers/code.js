/**
 * how numbers work code
 */

 // 函数解构一个数,把它解构(reducing)它的组件,一个符号位(sign),一个整数(不是二进制)系数(coefficient),一个指数(exponent)
function deconstruct(number,binary = false) {
    //number = sign * coefficient * (2 ** exponent);
    let sign = 1;
    let coefficient = number;
    let exponent = 0;
    // 从系数中移出符号位
    if (coefficient < 0) {
        coefficient = -coefficient;
        sign = -1;
    }

    if (Number.isFinite(number) && number !== 0) {
        // 减小coefficient(系数):我们能够获得指数通过把这个数以2来分解直到为0为止
        // 1074 - 53 - 1
        // 我们添加一个除数为-1128
        // 这个是Number.MIN_VALUE的指数-系数的比特数-福利位bit
        exponent = -1128;
        let reduction = coefficient;

        // 循环保证了能够除到0.每一次除都会减少reduction的exponent
        // 当exponent小到它不能够再小
        // 这个时候内部的低于正常值的系数将要被右移
        // 最后所有的位都会被移出

        // 这里怎么样才叫除到0呢?
        // 它不是0.000000001也不是Number.EPSILON而是第一个小于Number.MIN_VALUE的值
        // 由于Number.MIN_VALUE === 1 * 2 ** -1074
        // 所以如果对于一个正整数1,至少要被2除1075次才能到Number.MIN_VALUE以下,除以1074次才能刚好到临界
        // 这个值才是所谓的"0"
        // 然而这里可能输入的是所有的安全范围内的数
        // 因此范围会在 -Number.MAX_SAFE_INTEGER 到 Number.MAX_SAFE_INTEGER之间
        // 而MAX_SAFE_INTEGER是53位系数位全部为1,也就是2 ** 53 - 1
        // 首先2 ** 53需要再除53次才能到1,exponent的值为 Number.MIN_VALUE的指数-系数的比特数-福利位bit才够用
        while (reduction !== 0) {
            exponent += 1;
            reduction /= 2;
        }
        // 减小指数(Exponent):当指数为0的时候,数字可以被看成一个整数
        // 如果exponent不是0,那么就适配到正确的系数
        reduction = exponent;
        while (reduction > 0) {
            coefficient /= 2;
            reduction -= 1;
        }
        while (reduction < 0) {
            coefficient *= 2;
            reduction += 1;
        }
    }
    // 返回一个对象包含3个部件一个原始值
    return {
        sign,
        coefficient,
        exponent,
        number
    }
}

// 2 ** -1074 是可以表示的最小的数

//console.log(deconstruct(123));
console.log(deconstruct(Number.MAX_SAFE_INTEGER));
//console.log(deconstruct(Number.MIN_VALUE));
console.log(deconstruct(-Number.MAX_SAFE_INTEGER));
//console.log(deconstruct(2 ** 55));