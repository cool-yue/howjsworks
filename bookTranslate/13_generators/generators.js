/**
 * how generator works
 * english words by douglas crockford
 * translate by huyue
 */

 /**
  * javascript在es6引入了一个新的特性叫generators,它们被添加正值标准敲定过程中基于对python这个语言的羡慕
  * 我不推荐用ES6的generators有很多原因.
  *
  * 代码做的事情跟代码看起来非常不一样.它们看起来像普通的函数,但是它们工作跟函数不一样.它们穿件了一个函数对象
  * ，这个函数对象创造一个对象,这个对象有一个next方法,这个方法被'function*'的函数体所制造.它有一个yield操作符,
  * 这个操作符很像一个return语句,但是它并没有制造所期待的值，而是制造了一个对象包含一个value属性,这个value属性
  * 包含那个所期待的值.一个简洁的*能够在行为上导致如此大的改变。
  *
  * 它们有很复杂的控制流。我们在Structured Revolution中学到的是控制流必须直接并且可预测。generators能够有一个复杂
  * 的控制流是因为generator能够中止和恢复.它们也与finally和return有一些迷惑的交互。
  *
  * 它们鼓励用循环。正如我们远离对象，朝着函数走(函数式编程的流行)，我应该愿意循环.而且这些generators反而需要更多的
  * 循环.大多数的generator包含一个带有yield在中间的循环体来制造值。大多数generator的用户使用一个for循环来消费它们
  * 那就是2个循环，这2个循环理应是不需要的。
  *
  * generators用一个笨拙的OOP接口。工厂创造一个对象，也就是generator创造一个对象。（在函数式设计中,工厂创造一个generator
  * 函数，并且generator制造一个值。函数式设计能够更简洁，更干净，更简单来使用）
  *
  * 最后，所有里面最差的，ES6 generators没有必要。当有更好的选择可用时,我不推荐用这个特性.
  */

function* counter() {
    let count = 0;
    while(true) {
        count += 1;
        yield count;
    }
}
const gen = counter();
//gen.next().value;
//gen.next().value;
//gen.next().value;

// 以上是es6的generator的案例
// crockford先生推荐下面的版本


// 所以与其写一些看起来像一个function然后yield一个值,但是实际上是一个函数返回
// 一个对象,对象包含一个next方法,这个next方法生产一个对象，这个对象包含一个value属性,该属性存一个值
// 与其这样,不如写一个函数,返回一个函数,这个返回的函数执行后能够返回一个值
function counter() {
    let count = 0;
    return function counter_generator() {
        count += 1;
        return count;
    }
}

//const gen = counter();

//gen();
//gen();
//gen();

// generator却是一个很好的东西.所有我们要正确得去用它。我们以一个函数返回一个函数开始
// 外层函数是一个工厂,内层函数是一个generator,整体上的形式如下
function factory(factory的参数) {
    // 初始化generator的的状态
    return function generator(generator的参数) {
        // 更新状态
        return value;
    }
}

// 这种模式最简单的使用就是常量工厂
function constant(value) {
    return function constant_generator() {
        return value;
    }
}

// 更有用的例子是整数工厂,它返回一个generator,这个generator返回下一个整数序列
// 在最后它返回undefined
// 我们把undefined当哨兵一样来与序列的结束进行通信
function integer(from = 0,to = Number.MAX_SAFE_INTEGER,step = 1) {
    return function () {
        if (from < to) {
            const result = from;
            from += step;
            return result;
        }
    }
}

// element工厂接受一个数组并且返回一个generator,这个generator每次调用返回一个数组的元素
// 同样当没有更多元素的时候,返回一个undefined,就像哨兵一样
// 这个工厂接受一个可选第二个参数,一个生成元素个数的generator，用来获得元素,也就是说不一定非要遍历完整个数组
// 默认状态下,是遍历整个数组
function element(array,gen = integer(0,array.length)) {
    return function element_generator(...args) {
        const element_nr = gen(...args);
        if (element_nr !== undefined) {
            return array[element_nr];
        }
    }
}

// property工厂针对对象来做同样的事情.它返回每个属性
// 以数组的形式来返回,其中数组中包含key和value,类似[key,value]
// 当没有更多属性的时候,返回undefined
// 同样这个工厂能够选择性接受第二个参数,该参数也是一个generator
// 这个generator创造一个keys数组用来取属性
// 默认情况下它返回所有的自己的属性以插入的顺序
function property(object,gen = element(Object.keys(object))) {
    return function property_generator(...args) {
        const key = gen(...args);
        if (key !== undefined) {
            return [key,object[key]]
        }
    };
}

// collect工厂接受一个generator和一个数组
// 它返回一个generator,这个返回的generator跟接受的generator基本相似
// 除了它也会追加返回的值到数组中去
// 所有的实参都会被传入新的函数（这个函数是被传入就函数的函数）
function collect(generator,array) {
    return function collect_generator(...args) {
        const value = generator(...args);
        if (value !== undefined) {
            array.push(value);
        }
        return value;
    }
}

// 我们可以用repeat函数作为一个驱动
// 它接受一个函数并且调用它直到函数返回undefined
// 这就是我们需要的唯一的循环
// 我们可以用一个do来写它
// 但是crockford先生更喜欢用尾调来写
function repeat(generator) {
    // 注意这个if条件
    // 这个条件相当于调用了generator
    // 只要结果不是undefined就会return repeat(generator)来继续尾调
    if (generator() !== undefined) {
        return repeat(generator);
    }
}

//const my_array = [];
//repeat(collect(integer(0,7),my_array))
//console.log(my_array);
// [0,1,2,3,4,5,6]

// harvest函数,我们能够把repeat和collect组合在一起
// harvest函数不是一个工厂也不是一个generator
// 它接受一个generator作为它的实参
function harvest(generator) {
    const array = [];
    repeat(collect(generator,array));
    return array
}

// limit工厂接受一个函数并且返回一个函数,这个函数只能够被用有限次
// 当count数量消耗完,这个函数将会什么事情也不错,只会返回undefined
// 给工厂的第二个参数是新函数可以被调用的次数

function limit(generator,count = 1) {
    return function (...arg) {
        if (count >= 1) {
            count -= 1;
            return generator(...args);
        }
    }
}

// limit工厂能够被用到任何函数上面.例如，如果你把一个实现愿望的函数和3传入limit中
// 那么你得到了一个只能实现3个愿望的函数

// filter函数接受一个generator和一个可以陈述函数,一个陈述函数是一个函数返回true或者false
// 它返回一个新的generator，这各generator工作就像久的一样除了它只传陈述函数返回true的值
function filter(generator,predicate) {
    return function filter_generator(...args) {
        const value = generator(...args);
        if (value !== undefined && !predicate(value)) {
            return filter_generator(...args);
        }
        return value;
    }
}

const my_third_array = harvest(filter(integer(0,42),function divisible_by_three(value) {
    return (value % 3) === 0;
}))
console.log(my_third_array);
// [0,3,6,9,12,15,18,21,24,27,30,33,26,39]

// concat工厂可以接受2个或者更多的generator并且把它们拼接在一起
// 来制造一个结合它们的顺序的generator
// 它从第一个generator中拿到值,只到返回undefined之前
// 然后转换到下一个generator
// concat工厂用element工厂能够很聪明地通过generator来工作
function concat(...generators) {
    const next = element(generators);
    let generator = next();
    return function concat_generator(...args) {
        if (generator !== undefined) {
            const value = generator(...args);
            if (value === undefined) {
                generator = next();
                return concat_generator(...args);
            }
            return value
        }
    }
}

const my_concat_generator = concat(integer(1,10),integer(15,20),integer(25,30));
const my_concat_harvest = harvest(my_concat_generator);
console.log(my_concat_harvest);
// [1,2,3,4,5,6,7,8,9,15,16,17,17,19,25,26,27,28,29]

// join factory 接受一个函数 和一个或多个generator并且返回一个新的generator
// 每次新的generator调用的时候，它会去调用所有的老的generators然后把它们的结果传入到函数中
// 你能够使用join和repeat做所有你曾经用for of做的事情
// 函数的实参到join中，做一个阻塞的工作
// join工厂能够一次和多个generator流一起工作
function join(func,...gens) {
    return function join_generator() {
        return func(...gens.map(function(gen) {
            return gen();
        }))
    }
}

const my_join_generator = join(function(){console.log(arguments)},integer(1,6),integer(10,16),integer(20,26));
// my_join_generator();//{"0":1,"1":10,"2":20}
// my_join_generator();//{"0":2,"1":11,"2":21}
// my_join_generator();//{"0":3,"1":12,"2":22}
// my_join_generator();//{"0":4,"1":13,"2":23}

// map,我们能够用所有的这些来创造一个map函数，看起来像array的map方法。
// 它接受一个函数和一个数组,并且返回一个新的数组,该数组每个元素包含以array的每个元素作为参数调用function的结果的这个值.

function map(array,func) {
    // 将array的每个元素返回,放入到func中调用返回的结果,放入到一个结果集中
    return harvest(join(func,element(array)));
}

// const my_map_array = map([1,2,3],function(a) { return a*a ? a*a:undefined;})
// console.log(my_map_array);
// [1,4,9]

// objectify 工厂给我们另外一个方式来创建数据对象
function objectify(...names) {
    return function objectify_constructor(...values) {
        const object = Object.create(null);
        names.forEach(function(name,name_nr) {
            object[name] = values[name_nr]
        });
        return object;
    }
}
// let data_marry_kill = objectify("date","marry","kill");
// let my_little_object = data_marry_kill("butterfly","unicorn","monster");
// console.log(my_little_object);
// {date:"butterfly",marry:"unicorn",kill:"monster"}

// generator生存在纯粹函数和非纯粹函数的边界上。被constant工厂创造的generator是纯粹的
// 但是大部分的genrator毋庸置疑都是不纯粹的。generator是状态化的，所以不纯粹，但是他们把他们的状态
// 隐藏在了这个工厂的闭包里面。状态仅仅能够通过调用generator来更新.它们没有副作用,这个副作用折磨着
// 大部分的不纯粹函数.虽然不完全纯粹,generator的无副作用确实已经很好地让它组成
// 让我们的程序越纯粹越好。程序和万物交互不可能完全纯粹因为万物是不纯粹的.我们如何知道什么能够纯粹
// 什么必须不纯粹?generators可以给我们展示一条路.