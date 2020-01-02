/**
 * How Objects Work
 */

 // JavaScript过渡使用了object这个单词
 // 这是一个任何东西都是对象的语言(除了null和undefined)
 // 但是通常,尤其在这一章,object指代更具体的东西

 // JavaScript的主要数据结构被称为object.
 // 一个对象是属性或者成员的容器
 // 每个属性有一个名字和值
 // 名字是一个字符串,值可以是任意类型
 // 在其他的语言中,object的类型可能会被称为一个hash表,map,record,struct,关联数组(php),字典,
 // 或者在一些粗辱的语言,dict

 // 一个新的对象可以通过字面量来创建
 // 一个对象字面量创建一个值这个值可以存入一个变量,一个对象或数组,或者传入一个函数,或者从一个函数中return的值

 // 一个对象字面量通过{和}来定界.内部嵌套可以是0到多个属性以逗号(,)来分离,一个属性可以是：

 // 一个字符串后跟带一个冒号(:),冒号后面带一个表达式
 // 属性名是一个字符串,属性的值是表达式的值

 // 一个名字(标识符)后面跟一个冒号(:),冒号后面带一个表达式
 // 属性名是这个名字转化成字符串形式,值为表达式的值

 // 一个名字.
 // 属性名是这个名字转化成字符串形式,值为具有相同名字的变量或参数的值

 // 一个名字后面接着一个参数列表包装在()中,紧接着跟着一个函数体,包装在{}中
 // 这是一个缩写,一个name跟一个冒号,冒号后面是一个function表达式的缩写
 // 这种形式允许省略:function,看起来失去了清晰度,感觉不值得

 // 所以举个例
 let bar = "a long rod or rigid piece of wood or metal";
 let my_little_object = {
     "0/0":0,
     foo:bar,
     bar,
     my_little_method() {
         return "So small"
     }
 }

 // 我们可以通过使用.这个记号加上一个name,访问一个对象的属性
 my_little_object.foo === my_little_object.bar // true

 // 我们也能够访问一个对象属性使用方括号.我们能够用方括号访问属性名不是一个合法标识符的属性
 // 我们也可以用方括号访问计算属性名字,在方括号中的表达式会被计算然后转化成一个字符串如果必要
my_little_object["0/0"] === 0 // true

// 如果我们通过点号和方括号来要一个名字的属性值,如果该属性没有找到
// 那么保底的值(bottom value)会被提供给这个属性值
// 访问一个不存在的属性或者丢失的属性不会被看成一个错误
// 它是一个创造undefined的正常操作

my_little_object.rainbow //undefined
my_little_object[0] // undfined

// 新的属性能够通过赋值加到对象里面.已存在的属性的值也可以被赋值操作给替换

my_little_object.age = 39;
my_little_object.foo = "slightly frilly or fancy";

// 我推荐不要在object里面存undefined.
// JavaScript允许它,并且会正确地退回成undefined值
// 但是如果一个属性修饰了,同样也是一样的undefined
// 这就是困惑的根源,但是它可以被避免
// 我希望存储undefined能够导致属性被移除掉,但是它没有
// 一个属性可以通过delete操作符来删除
delete my_little_object["0/0"];

// 成熟的数据结构能够在对象以外来创建,因为对象的引用能够被存在object中
// 所有类的图和循环的结构能够被创建
// 没有嵌套深度的限制,但是不要疯狂！

// 当typeof操作符给一个对象的时候,它返回一个"object"
typeof my_little_object === "object" //true

/**
 * Case
 * 大小写
 */

 // 键值的匹配是大小写敏感的.所以 my_little_object.cat 跟 my_little_object.Cat或者my_little_object.CAT
 // 都不是同样的属性,===的操作符能够决定names属性的string的匹配

 /**
  * Copy
  */

  // Object.assign函数能够从一个对象中拷贝属性到另外一个对象.
  // 你可以制造一个object的copy通过指定一个空对象
  let my_copy = Object.assign({},my_little_object);
  my_copy.bar // "a long rod or rigid piece of wood or metal"
  my_copy.age // 39
  my_copy.age += 1;
  my_copy.age // 40
  delete my_copy.age;
  my_copy.age // undefined

  // 一个对象能够从很多对象中来赋值,以这种方式,一个复杂的对象能够通过简单的对象进行组装来构建

  /**
   * Inheritance
   * 继承
   */
// 在JavaScript,一个对象能够以继承另外一个对象来创建
// 这是一个非常不同继承形式,和在一些语言中实践的紧耦合的编程结构比如classes不同
// 在JavaScript中，是data耦合了,这个能够减轻脆弱性有非常重大意义,这样就能够抓住一个application的数据结构

// Object.create(prototype)接受一个已存在的对象然后返回一个新的对象,新的对象继承这个已存在的对象
// 已存在的对象是这个新对象的prototype
// 任何对象都能够变成新对象的prototype
// 一个对象继承自prototype也能够成为一个新对象的prototype
// 原型链的长度没有限制,但是保持它们较短是明智的

// 如果有一个目的去访问一个缺失的属性,在返回undefined之前
// 系统会首先去到prototype里面,然后prototype的prototype,然后继续下去
// 如果一个相同名字的属性在原型链上面找到了,就像是这个属性是在起始对象上面一样

// 当赋值给一个对象的时候,仅仅是最顶层的对象改变
// 原型链上的属性不会变

let my_clone = Object.create(my_little_object);
my_clone.bar // "a long rod or rigid piece of wood or metal"
my_clone.age //39
my_clone.age += 1
my_clone.age //40
delete my_clone.age
my_clone.age // 39

// 原型最流行的用法是作为一个存函数的地方
// JavaScript自己也是这么做的
// 当一个对象是用对象字面量创建的
// 那个对象继承自Object.prototype
// 类似的,array的方法继承自Array.prototype
// number继承自Number.prototype
// String集成值String.prototype
// 甚至function继承自Function.prototype
// 数组和字符串的方法非常有用
// 但是在Object.prototype中的几乎没用

// 因为我们有了继承,我们现在又2种类型的数据
// 自身属性（在最顶层的对象中的属性） 和 继承属性(在原型链中的属性)
// 多数时候他们工作机制一样
// 有时候你需要知道属性确实是对象自身的
// 大多数的对象继承了一个hasOwnProperty(string)函数
// 但是不幸的是它有一个稳定性的危险
// 它接受一个字符串然后返回true,如果对象里面包含那个名字的属性同时不是继承属性
// 不幸的是,如果object有一个属性名字叫hasOwnProperty,它将会取代Object.prototype.hasOwnProperty
// 这就会导致一些失败和困惑最好是把hasOwnProperty当成一个操作符
// 这样对象的状态不会导致hasOwnProperty的调用失败
// 如果没有继承属性的话,这个就更好,就会让这个有问题的方法没什么存在必要

my_little_object.hasOwnProperty("bar")  // true
my_copy.hasOwnProperty("bar") // true
my_clone.hasOwnProperty("bar") // false
my_clone.hasOwnProperty = 7;
my_clone.hasOwnProperty("bar") // EXCEPTION

// 如果你有一个属性叫hasOwnProperty,你就不能用继承的hasOwnProperty方法
// 你将会调用自身的属性

// Object.prototype.toString共享了同样的失败风险但是当它可以工作的时候
// 依旧比较失望

my_clone.toString() // "[ obejct,Object]"

// 你不需要被告知你的对象是个对象,你很可能已经知道这一切了
// 你想要展示它里面包含什么
// 如果你想要把一个对象转化成一个字符串
// 使用JSON.stringify更好

// Object.create(prototype)相对Object.assign(Object.create({}),prototype)的优势是
// 使用更少的内存,在大对数情况下,节约的并不是很可观,Prototypes能够添加很多困惑,而不是添加很多好处

// 也存在一个问题就是无意图继承.你可能想要使用一个对象就像使用一个hash table一样
// 但是对象继承了像toString,constructor这样还有实现的其他名字的属性的依赖
// 这样就会潜意识中让你的属性变得很困惑

// 幸运地是,Object.create(null)创造了一个对象,什么也不继承.
// 就没有继承属性和无意图继承的一些困惑
// 除非你明确把属性放进对象,要不然对象里面不会有东西
// 现在我经常使用Object.create(null)

/**
 * keys
 */
// Object.keys(object)函数能够拿到所有"自有"属性（没有继承属性）
// 然后返回一个字符串数组
// 这个允许你使用数组的方法来处理一个对象的属性 Object.keys(obj).forEach.....
// 在数组中的字符串是以它们插入的顺序排列的
// 如果你需要它们以不同的顺序,你可以也能够Array的sort方法

/**
 * Freeze
 */

 // Object.freeze(object)接受一个对象并且冰冻它,让它不能修改
 // 不能修改的特性能够带来更可靠的系统
 // 一旦一个对象按照你的想要的构建了它是可以被冷冻,这样保证了它不会被破坏
 // 或者篡改,这不是一个深度的冰冻,只有顶层的对象被冰冻了

// 不能修改的对象可能有一点有有价值的性能特性
// 如果它是一个从来不变的对象,这样一个强大的优化集能在语言的实现中能够让这些优化应用

// 不可变的对象有完美的安全属性,这个很重要因为当前行业的实践鼓励安装不可信的代码到我们的系统
// 不可变可能有一天能够帮助我们达成一个安全的实践
// 拥有不可变属性,我们能够给对象更好的接口,这个接口能够保护他们自己

// Object.freeze(object)和const语句做了2件不一样的事情.
// freeze操作值,const操作变量
// 若果你把一个可变的对象赋值给一个const变量
// 你任然可以改变这个对象,但是你不能替换这个对象成为不一样的值
// 如果你把一个不可变的对象给一个普通的变量
// 你不能改变对象,但是能够为这个变量赋一个不同的值

Object.freeze(my_copy);
const my_little_constant = my_little_object;

my_little_constant.foo = 7;// 允许
my_little_constant = 7 ;// 语法错误
my_copy.foo = 7 ;//异常
my_copy = 7; // 允许

/**
 * Prototypes And Freezing Do Not Mix
 */

 // prototype的一种使用方式是对象的浅拷贝的创建
 // 我们可能有一个充满属性的对象.我们想要另外一个对象一样
 // 但是只有一个属性变了,我们可以通过Object.create来实现
 // 正如我们看到的,这个会节约一些创建新对象的时间
 // 但是获取属性可能要开销多一点,因为需要查找原型链

 let freezeObj = Object.freeze({a:11});
 let aaa = Object.create(freezeObj);
 aaa.a //11
 aaa.a = 1 // 不报错
 aaa.a //11,还是11


 // 不幸的是,这个不管用如果原型是冰冻的.如果一个属性在一个原型中是不可变的
 // 实例不能够有他们自己的那个属性的版本
 // 在一些函数式编程风格中我们想要所有的对象都是冰冻的
 // 因不可改变而得到稳定性收益
 // 所以与其创建一个copy来找到一个改变,我们创建一个实例继承那个冰冻的对象将会更好
 // 更新实例,然后冰冻实例
 // 但是那个不能工作.
 // 更新一个实例会抛出一个异常
 // 就算能更新,它总体上同样也会减慢插入新属性的速度
 // 任何时候一个新的属性插入,它都要去原型链上面去找是否有这样一个属性
 // 来决定祖先中这个属性是不是可改变的属性
 // 这个搜索可以避免,如果使用Object.create(null)来创建你自己的属性。



 /**
  * WeakMap
  */

  // 一个JavaScript的设计失误是对象里面的属性名称必须是字符串
  // 有些时候,你想要使用一个对象或者数组作为一个键
  // 不幸的是,JavaScript对象做了错误的事情,将对象键转化成一个字符串键,使用toString方法
  // 这种情况下我们看到的是失望

  // 相比给我们一个所有键都能正确工作的对象,JavaScript给了我们一个第二个类型的对象,叫做WeakMap
  // WeakMap允许对象作为键,但是不能是字符串
  // 并且有一套完全不同的api

  //Object
  object = Objecet.create(null);
  object[key]
  object[key] = value;
  delete object[key]

  //WeakMap
  weakmap = new WeakMap();
  weakmap.get(key)
  weakmap.set(key,value)
  weakmap.delete(key)

  // 这2个东西做同样的事情,语法上看起来如此不一样,没什么道理
  // 同时这2个东西不是同一个东西,也没有道理
  // 成了一个东西只能用字符串当键,另外一个东西只能用对象当键
  // 应该有一个东西既能够用字符串也能够用对象当键

  // 尽管这样,WeakMap还是很好的设计,这里有2个使用它的例子

  // 我们想要把一个私密的属性放在一个对象上
  // 为了能够访问私密属性,你需要有权访问那个对象和那个秘密键
  // 你只有拥有上述2个条件的情况下才能够访问属性
  // 我们可以用WeakMap来实现,我们把WeakMap作为秘密键

  const secret_key = new WeakMap();
  secret_key.set(obejct,secret);
  secret = secret_key.get(object);

  // 你必须要能够访问object和secret key才能够让secret出现
  // 一个关于这种手段很好的实践是我们能够在一个冰冻的对象上面高效地添加secret属性

  // 我们想要能够给一个对象一些代码,这些码能够为我们做一些有用的事情
  // 像分类或者存下以便以后的访问,但是我不想也给那些代码修改对象或者调用它的方法的能力
  // 实际生活中,我们想要一个仆人帮我们停车而不是储物箱或者机车被掏空了,甚至被卖掉了
  // 诚信系统在现实生活中能够对人类起作用,但是在计算机的网络中对代码不起作用

  // 所以我们创建了一个设备叫做盖章器.
  // 我们给一个盖章器一个对象,并且返回一个盒子,这个盒子不能够被打开
  // 那个盒子可以交给仆人
  // 如果要恢复这个原始的对象
  // 要给这个盒子一个匹配的解印器
  // 我们可以简单地用WeakMap来实现这个功能

  function sealer_factory() {
      const weakmap = new WeakMap();
      return {
          sealer(object) {
              const box = Object.freeze(Object.create(null));
              weakmap.set(box,object);
              return box;
          },
          unsealer(box) {
              return weakmap.get(box);
          }
      };
  }

  // weakMap不允许探测它的内容
  // 你不能从里面拿到值,除非你持有那个钥匙
  // WeakMap能够更JavaScript的垃圾收集器很好的交互
  // 如果没有这个key的拷贝存在,那么那个key的属性就会被weakmap自动删除
  // 这个可以帮助防止内存泄露

  // javaScript也有一个类似的东西叫Map,但是Map没有安全和内存泄露的保护
  // 但是WeakMap有,同时WeakMap是一个可怕的名字,Map就更困惑了
  // 它跟数组的map方法没有什么联系
  // 并且它还会跟地图绘制的一些函数搞得很困惑
  // 那就是为什么我不推荐用Map
  // 但是我喜欢用WeakMap和Array的map函数

  // javascript有一个东西叫Symbol,它能做到的一件事同时WeakMap也能做
  // 我不推荐用Symbol,因为没有必要
  // 我在寻找简化,通过消除那些我们用不到的多余的功能

  /**
   * conclusion
   */
  // object涉及到的方法

  // Object.create(null) 继承
  // Object.assign(); 拷贝
  // Object.prototype.hasOwnProperty
  // Object.keys ;键值
  // Object.freeze();冰冻
  // WeakMap