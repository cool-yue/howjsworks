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

        // 为什么这个指数是 -1074 - 53 -1
        // 是因为一个JavaScript的数首先是用64位来表示的
        // 其中下限是2 ** -1074,这个值只能够表示接近于0的最小值
        // 但是由于1*2 ** -1074 > 0,如果系数是1的话,刚好大于0,问题是系数位的52位+1位福利位可以表示一个2**53为的数,所以需要2**-53去把它弄成1
        // 也就是说 (2 ** 53) * (2 ** -53) * (2 ** -1074) = 2 ** -1074 > 0
        // 如果再来一位,那么就可以让这个归0
        // (2 ** 53) * (2 ** -53) * (2 ** -1074) * 2 ** -1 = 2 ** -1075 === 0


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
            // 这个-1128循环结束后到0,表示传入的数正好是2*53,临界值,因为这个临界值正好是
            /**
             * {
             *     coefficient:2**53,正好就是1个福利位后面跟着52个0
             *     exponent:0,// 指数正好是0
             *     number:2**53
             * }
             */
            // 如果-1128循环结束后大于0,那么传入的这个数大于2*53,在安全区间外
            // 如果-1128循环结束后小于0,那么插入的这个数小于2*53,在安全区间内
            exponent += 1;
            reduction /= 2;
        }
        // 减小指数(Exponent):当指数为0的时候,数字可以被看成一个整数
        // 如果exponent不是0,那么就适配到正确的系数
        reduction = exponent;
        while (reduction > 0) {
            // 这里大于0,表示需要通过指数来增加了,因为最大的系数,要把系数缩小到exponent为0的位置因为exponent为0是系数能够表示的最大的数
            coefficient /= 2;
            reduction -= 1;
        }
        while (reduction < 0) {
            // 这里小于0,表示需要设置指数为负值,由于福利位始终是1,所以最小是 2 ** 52
            // 比如我这里给的数是一个2**5,基本上这个数乘以(2**-5) * (2 ** -1074) * (2 ** -1)就能够除到0,这时还剩 53 + 1074 + 1 -(5 + 1074 + 1) = 48;
            // 这也就是告诉我们,如果 2**-48这也就是说 2**5 = 2**53 * 2**-48
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
console.log(deconstruct(1));
console.log(deconstruct(2));
console.log(deconstruct(3));
console.log(deconstruct(2 ** 53));
console.log(deconstruct(2 ** 5));
console.log(deconstruct(18014398509481988));
//console.log(deconstruct(Number.MIN_VALUE));
//console.log(deconstruct(2 ** 55));

// 这个程序的思路就是
// 2**-1074 是min_value,小于这个数就是0
// 2**53是53个signicant能够表示的最大的数了(严格来讲这个灵界点应该是2**53 - 1,这里便于取整,同时让2*53 - 1这个数刚好归0)
// (2**53 - 1)/(2*53 )
// 加上一个福利位,这里其实不是福利位,而是为了让循环条件刚好落入到0和MIN_VALUE之间,因为MIN_VALUE是大于0的最小整数
// 所以这里多加了1位,但是完全不影响结果,因为还是会乘回去的,因为起始点要比MIN_VALUE要低

// 因为系数能够表达的最大值是2*53 - 1
// 所以如果用1128去消耗这个数,如果还不够,证明这个数已经超过了2*53,因此这个时候就要让这个数最终落在2*53中
// 如果用1128去消耗这个数,如果够了,证明这个数没有超过2*53,为了所以这个时候,我把多的-1128归0
// 这样相当于就是把significant完全想成了一个整数