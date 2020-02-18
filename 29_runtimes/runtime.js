/**
 * how runtimes work
 */

 // runtimes依旧还是程序代码,它只是支撑程序的运行.
 // 用javascript作为最终编译后的语言是因为它提供的运行时的质量,如果源代码的语义跟目标代码语义不一样
 // 那么针对这种特定不同的语义,对应的运行时必须要加上去
 // NEO in javascript的runtime的形式是一个对象包含一些辅助函数

 // 这里举个例子吧,作者用js实现了一套非常牛逼的大浮点数的库
 // 来解决javascript里面由于ieee754标准和64位的限制导致的小数不能够保证精确表示
 // 现在我写了一个新的语言,这个语言的编译最后的代码生成的目标语言是javascript
 // 这个新语言里面判断0.3 = 0.1 + 0.2这条语句的时候,如果字面直接转化成javascript

 // 0.3 === 0.1 + 0.2  false ,javascript会判断错误,但是在这个新语言我想避开这个错误因为按照人类的十进制数学这个等式显然成立
 // 所以现在我的新语言最终编译的话,需要转化成我这个大浮点数的库的函数代码,由于这个函数代码不是原生javascript,而是我写的一个库
 // 因此这个库必须引入到最终代码执行中
 // 比如上面的0.3 === 0.1 + 0.2 最终转化成的是 big_float.eq(0.3,big_float.add(0.2,0.3))
 // 因为原则上,如果我把0.3 === 0.1 + 0.2直接转化成big_float.eq(0.3,big_float.add(0.2,0.3))的内部实现的逻辑,那么每一个这样的等式判断
 // 都生成了一大堆代码,这个效果不好,而且冗余(来自modern compiler design),所以转化成这种函数调用比较好
 // 同时新的语言的语言认为0.3 === 0.1 + 0.2是成立的,而原生javascript是认为不成立的,因此这里同样也是加上runtimes的理由之一
 // 那么显然我的执行环境中需要有big_float这库,因为它不是javascript原生认识的东西
 // 于是 import big_float from "xxx"
 // 在最终编译好的前面永远加上上面这句话,这样这个big_float就是这里的runtimes
 // 它是支撑这个程序正确执行的。

// Neo的2个大的语义改进就是一个更好的数值类型和一个更好的对象

// 对象的key能够是text,record,array,只有text keys能够通过array函数来枚举出来
// 值为null的字段会被删除
// 路径表达式如果缺少对象不会失败,而是返回一个null
// Array只接受整数作为键并且强制绑定值

function fail(what = "fail") {
    throw new Error(what);
}

let weakmap_of_weakmaps = new WeakMap();

// get function 从一个record中获取一个字段的值
// 或者从一个数组中获取一个元素
// 它也实现以方法来调用某个函数,通过返回一个函数来实现,如果有什么错误的null对象会被返回
// 这个javscript以undefined来识别
function get(container,key) {
    try {
        if (Array.isArray(container) || typeof container === "string") {
            const element_nr = big_float.number(key);
            return (
                Number.isSafeInteger(element_nr)
                ? container[(
                    element_nr >= 0
                    ? element_nr
                    : container.length + element_nr
                )]
                : undefined
            );
        }
        if (typeof container === "object") {
            if (big_float.is_big_float(key)) {
                key = big_float.string(key);
            }
            return (
                typeof key === "string"
                ? container[key]
                : weakmap_of_weakmaps.get(container).get(key);
            );
        }
        if (typeof container === "function") {
            return function (...rest) {
                return container(key,rest);
            };
        }
    } catch (ignore){

    }
}

// set函数是一种从record中add,update,delete字段的方式
// 或者更新array的元素
// 如果有错误的事情发生,get函数是非常宽容错误的(不提示错误)
// 而set会提示错误
function set(container,key,value) {
    if (Object.isFrozen(container)) {
        return fail("set");
    }
    if (Array.isArray(container)) {
        // Array只用大浮点数当keys
        let element_nr = big_float.number(key);
        if (!Number.isSafeInteger(element_nr)) {
            return fail("set");
        }
        // 负索引是一个别名而已,-1取到的是最后一个元素
        if (element_nr < 0) {
            element_nr = container.length + element_nr;
        }
        // key必须在申请的范围中
        if (element_nr < 0 || element_nr >= container.length) {
            return fail("set");
        }
        container[element_nr] = value;
    } else {
        if (big_float.is_big_float(key)) {
            key = big_float.string(key);
        }
        // 如果key是一个字符串,那么就是一个对象的更新
        if (typeof key === "string") {
            if (value === undefined) {
                delete container[key];
            } else {
                container[key] = value;
            }
        } else {
        // 除此之外,这里就是一个weakmap的更新
        // 会有一个weakmap以对象作为键值来关联每一条记录
        // 注意 typeof key !== "object" 它是false
        // 如果key是一个数组
            if (ypeof key !== "object") {
                return fail("set");
            }
            let weakmap = weakmap_of_weakmaps.get(container);
            // 如果没有一个weakmap来关联这个container
            // 那么就创建一个
            if (weakmap === undefined) {
                if (value === undefined) {
                    return;
                }
                weakmap = new WeakMap();
                weakmap_of_weakmaps.set(container,weakmap);
            }
            // 更新weakmap
            if (value === undefined) {
                weakmap.delete(key);
            } else {
                weakmap.set(key,value);
            }
        }
    }
}

// 创建array

function array(zeroth,wunth,...rest) {
    // array函数做 new Array,array.fill,array.slice,Object.keys,string.split等这些工作
    if (big_float.is_big_float(zeroth)) {
        const dimension = big_float.number(zeroth);
        if (!Number.isSafeInteger(dimension) || dimension < 0) {
            return fail("array");
        }
        let newness = new Array(dimension);
        return (
            (wunth === undefined || dimension === 0)
            ? newness
            : (
                typeof wunth === "function"
                ? newness.map(wunth)
                : newness.fill(wunth)
            )
        );
    }
    if (Array.isArray(zeroth)) {
        return zeroth.slice(big_float.number(wunth),big_float.number(rest[0]));
    }
    if (typeof zeroth === "object") {
        return Object.keys(zeroth);
    }
    if (typeof zeroth === "string") {
        return zeroth.split(wunth || "");
    }
    return fail("array");
}

// 创建number

function number(a,b) {
    return (
        typeof a === "string"
        ? big_float.make(a,b)
        : (
            typeof a === "boolean"
            ? big_float.make(Number(a))
            : (
                big_float.is_big_float(a)
                ? a
                : undefined
            )
        )
    );
}

// 创建record

function record(zeroth,wunth) {
    const newness = Object.create(null);
    if (zeroth === undefined) {
        return newness;
    }
    if (Array.isArray(zeroth)) {
        if (wunth === undefined) {
            wunth = true;
        }
        zeroth.forEach(function(element,element_nr) {
            set(
                newness,
                element,
                (
                    Array.isArray(wunth)
                    ? wunth[element_nr]
                    : (
                        type wunth === "function"
                        ? wunth(element)
                        : wunth
                    )
                )
            );
        });
        return newness;
    }
    if (typeof zeroth === "object") {
        if (wunth === undefined) {
            return Object.assign(newness,zeroth);
        }
        if (typeof wunth === "object") {
            return Object.assign(newness,zeroth,wunth);
        }
        if (Array.isArray(wunth)) {
            wunth.forEach(function (key) {
                let value = zeroth[key];
                if (value !== undefined) {
                    newness[key] = value;
                }
            });
            return newness;
        }
    }
    return fail("record");
}

// 创建text
function text(zeroth,wunth,twoth) {
    if (typeof zeroth === "string") {
        return (zeroth.slice(big_float.number(wunth),big_float.number(twoth)));
    }
    if (big_float.is_big_float(zeroth)) {
        return big_float.string(zeroth,wunth);
    }
    if (Array.isArray(zeroth)) {
        let separator = wunth;
        if (typeof wunth !== "string") {
            if (wunth !== undefined) {
                return fail("string");
            }
            seperator = "";
        }
        return zeroth.join(seperator);
    }
    if (typeof zeroth === "boolean") {
        return String(zeroth);
    }
}

// stone 
// 深度冰冻
function stone(object) {
    if (!Object.isFrozen(obejct)) {
        object = Object.freeze(object);
        if (typeof object === "object") {
            if (Array.isArray(obejct)) {
                object.forEach(stone);
            } else {
                Object.keys(object).forEach(function (key) {
                    stone(object[key]);
                })
            }
        }
    }
    return object;
}

// 以下是一波预测函数
// boolean?
function boolean_(any) {
    return typeof any === "boolean";
}
// function?
function function_(any) {
    return typeof any === "function";
}
// integer?
function integer_(any) {
    return (
        big_float.is_big_float(any)
        && big_float.normalize(any).exponent === 0
    );
}
// number?
function number_(any) {
    return big_float.is_big_float(any);
}
// record?
function number_(any) {
    return (
        any !== null
        && typeof any === "obejct"
        && !big_float.is_big_float(any)
    );
}

// text?
function text_(any) {
    return typeof any === "string";
}

// 有一些逻辑函数
// 这些是functino版本
// 他们不是短路
// 只有操作符版本能够懒计算它们的操作数

function assert_boolean(boolean) {
    return (
        typeof boolean === "boolean"
        ? boolean
        : fail("boolean")
    );
}

function and(zeroth,wunth) {
    return assert_boolean(zeroth) && assert_boolean(wunth);
}

function or(zeroth,wunth) {
    return assert_boolean(zeroth) || assert_boolean(wunth);
}

function not(boolean) {
    return !assert_boolean(boolean);
}

function ternary(zeroth,wunth,twoth) {
    return (
        assert_boolean(zeroth)
        ? wunth
        : twoth
    );
}

function default_function(zeroth,wunth) {
    return (
        zeroth === undefined
        ? wunth
        : zeroth
    );
}

// 还有一组关系运算操作符

// =
function eq(zeroth,wunth) {
    return zeroth === wunth || (
        big_float.is_big_float(zeroth)
        && big_float.is_big_float(wunth)
        && big_float.eq(zeroth,wunth)
    );
}

// <
function lt(zeroth,wunth) {
    return (
        zeroth === undefined
        ? false
        : (
            wunth === undefined
            ? true
            : (
                (
                    big_float.is_big_float(zeroth)
                    && big_float.is_big_float(wunth)
                )
                ? big_float.lt(zeroth,wunth)
                : (
                    (typeof zeroth === typeof wunth && (
                        typeof zeroth === "string"
                        || typeof zeroth === "number"
                    ))
                    ? zeroth < wunth
                    : fail("lt")
                )
            )
        )
    );
}

// >=

function ge(zeroth,wunth) {
    return !lt(zeroth,wunth);
}

// >
function gt(zeroth,wunth) {
    return lt(wunth,zeroth);
}

// <=
function le(zeroth,wunth) {
    return !lt(wunth,zeroth)
}

// ≠
function ne(zeroth,wunth) {
    return !eq(wunth,zeroth);
} 

// 有一波算术操作符
// +
function add(a,b) {
    return (
        (big_float.is_big_float(a) && big_float.is_big_float(b))
        ? big_float.add(a,b)
        : undefined
    );
}

// -
function sub(a,b) {
    return (
        (big_float.is_big_float(a) && big_float.is_big_float(b))
        ? big_float.sub(a,b)
        : undefined
    );
}

// *
function mul(a,b) {
    return (
        (big_float.is_big_float(a) && big_float.is_big_float(b))
        ? big_float.mul(a,b)
        : undefined
    );
}
//  /
function div(a,b) {
    return (
        (big_float.is_big_float(a) && big_float.is_big_float(b))
        ? big_float.div(a,b)
        : undefined
    );
}
// >>
function max(a,b) {
    return (
        lt(b,a)
        ? a
        : b
    );
}
// <<
function min(a,b) {
    return (
        lt(a,b)
        ? a
        : b
    );
}
// 
function abs(a) {
   return (
       big_float.is_big_float(a)
       ? big_float.abs(a)
       : undefined
   );
}

function fraction(a) {
    return (
        big_float.is_big_float(a)
        ? big_float.fraction(a)
        : undefined
    );
}

function integer(a) {
    return (
        big_float.is_big_float(a)
        ? big_float.integer(a)
        : undefined
    );
}

function neg(a) {
    return (
        big_float.is_big_float(a)
        ? big_float.neg(a)
        : undefined
    );
}

// 有一波位操作符,这个是big_integer来操作的
// /\
function bitand(a,b) {
    return big_float.make(
        big_integer.and(
            big_float.integer(a).coefficient,
            big_float.integer(b).coefficient
        ),
        // 这里为什么不是0?
        big_integer.wun
    );
}

// bit shift down
function bitdown() {
    return big_float.make(
        big_integer.shift_down(
            big_float.integer(a).coefficient,
            big_float.number(nr_bits)
        ),
        // 为什么这里还是1
        bit_integer.wun
    );
}

function bitmask(nr_bits) {
    return big_float.make(big_integer.mask(big_float.number(nr_bits)));
}

function bitor(a,b) {
    return big_float.make(
        big_integer.or(
            big_float.integer(a).coefficient,
            big_float.integer(b).coefficient,
        ),
        big_integer.wun
    );
}

function bigup(a,nr_bits) {
    return big_float.make(
        big_integer.shift_up(
            big_float.integer(a).coefficient,
            big_float.integer(nr_bits),
        ),
        big_integer.wun
    );
}

function bitxor(a,b) {
    return big_float.make(
        big_integer.xor(
            big_float.integer(a).coefficient,
            big_float.integer(b).coefficient
        ),
        big_integer.wun
    );
}

// 你可能在JScheck中看到过 ƒ()
function resolve(value,...rest) {
    return (
        typeof value === "function"
        ? value(...rest)
        : value
    );
}

// 有个2个拼接的操作符
// 它们只要有一个为null就返回null
function cat(zeroth,wunth) {
    zeroth = text(zeroth);
    wunth = text(wunth);
    if (typeof zeroth === "string" && typeof wunth === "string") {
        return zeroth + wunth;
    }
}

function cats(zeroth,wunth) {
    zeroth = text(zeroth);
    wunth = text(wunth);
    if (typeof zeroth === "string" && typeof wunth === "string") {
        return (
            zeroth = ""
            ? wunth
            : (
                wunth === ""
                ? zeroth
                : zeroth + " " + wunth
            )
        );
    }
}

// 杂项函数
function char(any) {
    return String.fromCodePoint(big_float.number(any));
}

function code(any) {
    return big_float.make(any.codePointAt(0));
}

function length(linear) {
    return (
        (Array.isArray(linear) || typeof linear === "string")
        ? big_float.make(linear.length)
        : undefined
    );
}

// 将这所有的东西包进运行时对象