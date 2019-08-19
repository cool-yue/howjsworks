/**
 * How this works
 */

 // Self语言是一个SmallTalk的方言,把class替换成了prototype
 // 一个对象可以直接继承另外一个对象
 // 类这样的模型遭受着脆弱性和由于通过extends的类的耦合导致的代码膨胀
 // Self语言的prototypes是一个明智的简化
 // prototype模型更轻但是更性能更昂贵

 // javaScript实现了一个基于prototype模型的奇怪的东西

 // 当一个对象产生,一个prototype就被指定,这个prototype上面存在一些或者所有的这个对象的内容

 const new_object = Object.create(old_object);

 // 对象只是属性的容器,prototype也是对象,方法只是存在对象里面的函数

 // 如果我们尝试获取一个对象身上不存在的一个属性的值,结果就是undefined这个值
 // 但是如果对象有一个prototype属性(正如new_object有一个old_object的原型)
 // 然后这个返回的值就是原型的属性的值
 // 如果这个过程也没找到,如果原型还有原型,然后返回的值就是原型的原型的属性值
 // 一直这样往后面走

 // 很多个对象共享一个prototype是可以做到的
 // 这些对象可以被看成是一个类的实例
 // 但是它们确实是一个独立的对象碰巧共享一个原型

 // prototype最普遍的使用是当做一个存方法的地方
 // 类似的对象可能会有一个类似的方法
 // 所以这个就会是一种内存的节省如果方法都放在一个单一的prototype中而不是放在每一个对象中

 // 一个在prototype中的function如何知道工作在哪个对象上呢?这就是为什么this会被引入

 // 语法上,一个方法调用是一个三元运算符的使用,.和()或者[]和()
 // 3个子表达式在这个三元表达式中分别是:
 // 关心的对象,方法名,参数列表

 // 对象和它的原型链,在上面搜索那个指定名字的方法
 // 如果一个函数没有被发现
 // 一个异常就会出来
 // 这是一个非常好的东西
 // 这个鼓励多态的使用
 // 你不用关心对象是继承谁
 // 你只关心它具备不具备调用方法的环境
 // 我们使用它,不关心它是怎么来的

 // 如果一个方法找到,然后使用实数列表的参数进行调用
 // 函数同样也接受一个this,作为一个隐藏参数指代目标对象

 // 如果一个方法内部好汉一个内部函数,内部函数不能访问这个this
 // 因为内部函数是作为函数调用的,仅仅只有方法的调用拿到这个this的绑定

 old_object.bud = function bud() {
     const that = this;

     // lou can not see bud's this,but lou can see bud's that
     function lou() {
         do_it_to(that);
     }
     lou();
 };

 // 这个绑定仅仅工作在方法的调用上,所以

 new_object.bud();

 // 可以成功,但是
 const funky = new_object.bud;
 funky();
 // 不会成功,这里funky存着一个new_object.bud相同函数的引用
 // 但是funky是作为函数调用的,所以没有this的绑定

 // this同样很奇怪的是它是动态绑定的,其他所有的变量都是静态绑定的
 // 这也是疑惑之源

 function pubsub() {
     // the pubsub factory makes a publish/subscribe object.
     // Code that gets access to the object can subcribe a function that receives
     // publications,and can publish stuff that will be delivered to all of
     // the subscribers

     // the subcribers array is used to hold the subscriber functions
     // it is hidden from the outside by the pubsub function's scope
     const subscribers = [];
     return {
         subscribe:function (subscriber) {
             subscribers.push(subscriber)
         },
         publish:function(publication) {
             const length = subscribers.length;
             for (let i = 0; i < length; i +=1) {
                 subscribers[i](publication);
             }
         }
     }
 }

 // 一个subscriber函数拿到一个this的绑定,这个绑定到subscribers数组因为
 // subscribers[i](publication)
 // 是一个方法的调用,它看起来不像一个方法的调用,但是它确实是方法的调用
 // 它给了每一个subscriber方法访问subscribers数组的权利
 // 这个会让一个subscriber来做非常坏的事情
 // 比如删掉所有其他的subscribers或者中断或者改变它们的信息

 my_pubsub.subscribe(function(publication)) {
     this.length = 0;
 }

 // this这个成为了一个安全和可靠性的危险东西
 // 当一个函数被存在一个数组并且后面会被调用
 // 但是给了this一个绑定到数组的引用
 // 如果我们没有让function能够访问数组的意图,当然我们大多数肯定不会想这样
 // 然后有一个新的机会让东西变得不对

 // publish函数能够被修复,通过将for替换成forEach
 publish:function(publication) {
     subscribers.forEach(function (subscriber) {
         subscriber(publication);
     })
 }

 // 所有的变量都是静态绑定的，这是一个好事
 // 只有this是动态绑定,它指代函数的调用者而不是函数的制造者,决定它的绑定
 // 这个偏差就是困惑之源

 // 一个函数对象有2个prototype属性.它有它的委托链(__proto__)到Function.prototype
 // 它还包含一个prototype属性存着一个对象的引用,这个对象用来当做对象的原型,对象是通过以new为前缀来调用函数得到的

 // 一个constuctor的调用是通过在函数调用的前面放一个new,这些是new到底做了什么

 // 通过Object.create(function.prototype)来创造一个this的值,也就是this现在是个对象
 // 通过使用this来调用函数,this这个时候已经是新的对象了
 // 如果函数没有返回一个对象,强制它返回this

 // 一类的继承是可以通过使用Object.assign函数来从一个prototype拷贝方法到另外一个
 // 一个更常见的做法是,代替一个函数对象的prototype属性,用被另外一个创造器创建的对象来代替

 // 由于每个函数是一个潜在的constructor,随时知道一个调用是不是应该加new前缀是困难的
 // 更不好的是,没有警告,当需要的时候但是又忘记了

 // 这就是为什么我们有一个约定,Functions如果被用来作为带new以constructor的形式调用的话必须要把要首字母大写
 // 其余的都不能以大写字母开始

 // JavsScript也有更多的约定的类class语法,这个是为那些不太懂javascript如何工作的开发者所准备的
 // 它允许在没有学习新的东西的情况下从lesser language转过来

 /**
  * this free
  */
  // 在2007年,有一些研究项目尝试开发一个JavaScript的安全的子集
  // 这个最大问题之一是处理this
  // 在一个方法调用中,this被绑定到目标对象
  // 这个有时是个好事情,但是同样的函数对象被作为函数调用
  // this会被绑定成全局对象,这是一个很糟糕的事情

  // 我的解决方式是宣布this完全非法
  // 我的辩论论据是this存在问题性和不必要性.
  // 如果我们把this从语言中移出,语言仍然是完整的
  // 我开始使用抛弃this的风格来变成,来获得一个抛弃this的痛苦的感觉

  // 我非常惊奇地发现那样让事情变得更简单了,而不是更难了我的程序变小和变好了

  // 这就是为什么我推荐废除this.你将会变成一个更好,更开心的程序员如果你学会不要this来编程
  // 我不是在把你的东西都拿走,我是给你一个通过写更好的程序来生活得更好的一种方式

  // 程序员使用class将要走入坟墓,从来不知道他们是有多么的困惑

  // this 不是一个好东西

  // this是一个指示代词,让它在语言中让语言更难沟通
  // 就像abbott和costello的他们进行结对编程


