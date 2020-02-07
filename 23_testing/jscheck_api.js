/**
 * specifers:姑且翻译成指定器,它的作用是"指定类型的值"的生成,它们通过把这个指定的值传给resolve函数
 * resolve函数接受到这个值后,就返回它,如果这个值是一个函数,那么就调用这个函数,返回这个函数的结果
 */

 // resolve函数接受一个值,如果这个值是一个函数，然后调用这个函数来创造这个返回值,除此之外接受的值就是函数返回的值

function resolve(value,...rest) {
    return (
        typeof value === "function"
        ? value(...rest)
        : value;
    )
}

// 可以把literal当成constant函数来记（generator那一节）.
// 它转义函数,所以有可以有一个函数传给所有的测试用例

function literal(value) {
    return function() {
        return value;
    }
}

// boolean specifer
// bias的值决定了true出现的概率,比如如果是0.5,那么true出现的概率就是百分之50

function boolean(bias = 0.5) {
    bias = resolve(bias);
    return function() {
        return Math.random() < bias;
    };
}

// number specifer
// 创造在一个区间范围的某个数

function number(from = 1,to = 0) {
    form = Number(resolve(from));
    to = Number(resolve(to));
    if (from > to) {
        [from,to] = [to,from];
    }
    const difference = to - from;
    return function() {
        return Math.random() * difference +  from;
    };
}

// wun_of specifer
// 这个函数接收一个值的数组和generator的数组
// 然后返回一个generator,随机地返回这些值
// 也能够选择性地接收一个权重的数组来偏移一些待选择值的权重性

// wun_of(array)
// array中的一个元素被选择,然后传给resolve处理
// 所有的元素都是以同样的概率被选中

// wun_of(array,weights)
// 2个参数都是数组,并且有相等的长度
// 一个weight越大,对应的那个值被选中的机会就越大

function wun_of(array,weights) {
    if (
        !Array.isArray(array)
        || array.length < 1
        || (
            weights !== undefined
            && (!Array.isArray(weights) || array.length !== weights.length)
        )
    ) {
        throw new Error("JSCheck wun_of");
    }
    if (weights === undefined) {
        return function() {
            return resolve(array[Math.floor(Math.random() * array.length)]);
        };
    }
    const total = weights.reduce(function(a,b) {
        return a + b;
    });
    let base = 0;
    const list = weights.map(function(value) {
        base += value;
        return base / total;
    });
    return function() {
        // 这里虽然确实是权重大的得到的概率大
        // 但是是并不是按照权重来均匀
        // 比如如果第一个数的权重是0.9,那么我们会发现这个0.9永远拦截在这里,因为如果第一个数都不满足,那么最后的结果只能是-1
        // 所以这里的处理方式只能参考吧。
        let x = Math.random();
        return resolve(array[list.findIndex(function(element) {
            return element > x;
        })]);
    };
}

// sequence specifier
// 接受一个生成器或者值的数组
// 返回一个生成器,按照顺序来生成这些值.

function sequence(seq) {
    seq = resolve(seq);
    if (!Array.isArray(seq)) {
        throw "JSCheck sequence";
    }
    let element_nr = -1;
    return function() {
        element_nr += 1;
        if (element_nr >= req.length) {
            element_nr = 0;
        }
        return resolve(seq[element_nr]);
    };
}

// falsy specifier
// 返回falsy值
const bottom = [false,null,undefined,"",0,NaN];
function falsy() {
    return wun_of(bottom);
}

// integer specifier
// 返回一个生成器,这个生成器返回一个整数,这个整数落在一个选定的范围
// 如果range没有指定,然后它会返回一个generator,这个generator返回一个随机在1000以内的素数(prime,也就是只能被1和自身整除的)
// 这个素数数组相当于一个bottom value
// 这里时间关系不列出所有的
const primes = [
    2,3,5,7,11
];

function integer_value(value,default_value) {
    value = resolve(value);
    return (
        typeof value === "number"
        ? Math.floor(value);
        : (
            typeof value === "string"
            ? value.charCodeAt(0)
            : default_value
        )
    );
}

function integer(i,j) {
    if (i === undefined) {
        return wun_of(primes);
    }
    i = integer_value(i,1);
    if (j === undefined) {
        j = i;
        i = 1;
    } else {
        j = integer_value(j,1);
    }
    if (i > j) {
        [i,j] = [j,i];
    }
    return function() {
        return Math.floor(Math.random() * (j + 1 - i) + i);
    };
}

// character specifier
// 返回一个生成器,这个生成器返回字符
// 如果传入一个整数或者2个整数
// generator将会生成一个字符,这个字符的codePoint位于这个区间中
// 如果传入了2个字符串,它的区间就是第一个字符串的第一个字符和第二个字符串的第一个字符之间的区间
// 如果传入了一个字符串,它返回那个字符串的字符
// 默认是返回ASCII的字符

function character(i,j) {
    if (i === undefined) {
        return character(32,126);
    }
    if (typeof i === "string") {
        return (
            j === undefined
            ? wun_of(i.split(""))
            : character(i.codePointAt(0),j.codePointAt(0))
        );
    }
    const ji = integer(i,j);
    return function() {
        return String.fromCodePoint(ji());
    };
}

// array specifier
// 返回一个generator,生成一个数组
function array(first,value) {
    if (Array.isArray(first)) {
        return function() {
            return first.map(resolve);
        };
    }
    if (first === undefined) {
        first = integer(4);
    }
    if (value === undefined) {
        value = integer();
    }
    return function () {
        const dimension = resolve(first);
        const result = new Array(dimension).fill(value);
        return (
            typeof value === "function"
            ? result.map(resolve)
            : result
        );
    }
}

// string specifier
// 返回一个generator返回字符串
// 默认是创造一个ASCII字符串
function string(...parameters) {
    const length = parameters.length;
    if (length === 0) {
        return string(integer(10),character());
    }
    return function () {
        let pieces = [];
        let parameter_nr = 0;
        let value;
        while (true) {
            value = resolve(parameters[parameter_nr]);
            parameter_nr += 1;
            if (value === undefined) {
                break;
            }
            if (
                Number.isSafeInteger(value)
                && value >= 0
                && parameters[parameter_nr] !== undefined
            ) {
                pieces = pieces.concat(
                    new Array(value).fill(parameters[parameter_nr]).map(resolve)
                );
                parameter_nr += 1;
            } else {
                pieces.push(String(value));
            }
        }
        return pieces.join("");
    };
}

let my_litter_3_letter_word_specifier = jsc.string(
    jsc.sequence(["c","d","f"]),
    jsc.sequence(["a","o","i","e"]),
    jsc.sequence(["t","g","n","s","l"])
);

my_litter_3_letter_word_specifier() // "cat"
my_litter_3_letter_word_specifier() // "dog"
my_litter_3_letter_word_specifier() // "fin"
my_litter_3_letter_word_specifier() // "ces"

let my_little_ssn_specifier = jsc.string(
    3,jsc.character("0","9"),
    "-",
    2,jsc.character("0","9"),
    "-",
    4,jsc.character("0","9")
);
my_little_ssn_specifier() // "231-89-2167"
my_little_ssn_specifier() // "706-32-0392"
my_little_ssn_specifier() // "931-89-4315"
my_little_ssn_specifier() // "636-20-3790"

// any specifier
const misc = [
    true,Infinity,-Infinity,falsy(),Math.PI,Math.E,Number.EPSILON
];

function any() {
    return wun_of([integer(),number(),string(),wun_of(misc)]);
}

// object specifier
// 返回一个generator,这个generator返回一个对象
// 默认是创建一个小对象,随机的键和随机的值

function object(subject,value) {
    if (subject === undefined) {
        subject = integer(1,4);
    }
    return function () {
        let result = {};
        const keys = resolve(subject);
        if (typeof keys === "number") {
            const text = string();
            const gen = any();
            let i = 0;
            while (i < keys) {
                result[text()] = gen();
                i += 1;
            }
            return result;
        }
        if (value === undefined) {
            if (keys && typeof keys === "object") {
                Object.keys(subject).forEach(function (key) {
                    result[key] = resolve(keys[key]);
                });
                return result;
            }
        } else {
            const values = resolve(value);
            if (Array.isArray(keys)) {
                keys.forEach(function (key,key_nr) {
                    result[key] = resolve((
                        Array.isArray(values)
                        // 这里取余数是防止索引溢出
                        ? values[key_nr % values.length]
                        : value
                    ),key_nr)
                });
                return result;
            }
        }
    };
}

let my_little_constructor = jsc.object(
    jsc.array(
        jsc.integer(3,6),
        jsc.string(4,jsc.character("a","z"))
    ),
    jsc.boolean()
);

my_little_constructor();// 生成一个有3到6个键,键是有4个a到z的字符组成,值为50%概率的bool值

// 如果传入一个对象,那么就会创造一个具有一样属性名字的对象

let my_little_other_constructor = jsc.object({
    left:jsc.integer(640),
    top:jsc.integer(480),
    color:jsc.wun_of(["black","white","red","blue","green","gray"]);
});

my_little_other_constructor();// 创造一个跟上面一样的对象。
// {"left":306,"top":460,"color":"gray"}

// 通过这些函数能够组合各种测试数据
// 但是有些形式的数据无法简单地通过这些specifier来构建
// 你可以很轻松得创造你自己所需的,仅仅是一个返回一个函数的函数

