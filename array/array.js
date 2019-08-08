/**
 * How Arrays work
 */

 // 数组是一个最值得尊重的数据结构。一个数组是一个连续部分的内存
 // 每一部分分解成相同尺寸片段,这每个片段都能联系着一个整数和通过这个整数快速访问
 // javaScript在第一次发布的时候并没有把array包含进来
 // 但是这种遗漏array并没有被注意到,因为JavaScript的对象太强大了
 // 抛开性能问题,对象可以做任何数组能够做的事情

 // 情况任然如此，任何字符串都能被使用到数组中的索引。
 // javascript的数组确实是对象
 // 在今天的javascript中,数组和对象略微不一样主要是以下4个方面:

 // Array有一个魔术length属性.一个数组的length属性不一定非要是数组中元素的数量
 // 它是最好的序数+1,这个就支持了数组的伪装,就好像数组是真正的数组了
 // 一个Javascript数组,允许用同样的过时的for语句来处理,这个for语句你能够在半个世纪前的c语言中找到

 // Array继承自Array.prototype,这个里面包含了更好的方法集合,相比Object.prototype

 // Array的创建使用array的字面量,不是对象字面量.array字面量在语法上更简单,左右方括号
 // 包含0个或者多个表达式并且以,分离

 // JSON对待array和objects非常不一样,尽管JavaScript几乎把他们看成一样

 // JavaScript自己就对数组很困惑.当给一个数组,typeof操作符返回的是字符串"object"
 // 显然这个是错的,你应该用Array.isArray(value)这个函数来决定value是一个数组

 const what_is_it = new Array(1000);
 typeof what_is_it // "object"
 Array.isArray(what_is_it) // true

 /**
  * Origin
  */

  // 由于计数的发明,人们给他们使用的单词编号来，以1来开始.
  // 在60年代中叶,一个很小的但是很有影响力的一波程序员决定我们应该从0开始
  // 今天差不多所有的程序员以0开始编号.其余的人类,包括大部分的数学家,仍然使用1开始
  // 数学家经常把起始标记为0，但是大多数的有序集合的第一个成员的标签都是1,他们如何这样做是一个谜

  // 有一个有效的从0开始的论证,但是由于太脆弱导致没有什么价值
  // 相似的,有一个正确的论证从0开始能够导致更少的差1错误(off-by-one error)
  // 但是那个感觉有问题.好像应该有一个好的理由为什么程序员技术跟其他人不一样
  // 或许有一天应该会知道

  // 影响JavaScript的是数组元素的个数或者更小程度,一个字符串的字符个数
  // 这个想法,array因此应该处理一个元素最早可以归宿到FORTRAN那个时代
  // 现代的观念来是以函数式来处理数组
  // 这个简化了代码通过消除了明确的循环管理和创造在潜在地多处理器分发工作这些东西

  // 一个用设计的好的语言,写出来的好的程序不应该关心array是否是从0还是1开始.
  // 我不会假设Javascript是一个设计得很好的语言,但是它确实是在FORTRAN上有个很大的改进
  // 实际上脱离FORTRAN这个模型,我们不需要总是关心元素如何计数

  // 有时候我们不必在意.单词first变成了有问题了因为它关联着one,所以我用zeroth
  // 它让我们起始变得很清晰

  // [0] zeroth 0th

  // 沿着这些移动,第四个,第五个,第六个貌似很模拟两可,但是到我们已经过了最小的整数时,就很清晰起始是什么了

  /**
   * initialization
   * 初始化
  */

// 有2个方式来创建一个新的数组,1数组字面量,2new Array(integer)

let my_little_array = new Array(10).fill(0);
// [0,0,0,0,0,0,0,0,0,0]
let same_thing = [0,0,0,0,0,0,0,0,0,0,0];

my_little_array === same_thing //false

// 注意到my_little_array和same_thing完全是一样的.但它们是分开的,独一无二的值
// 不像字符串,像对象,一样的数组只有当它们确实是同一个数组的时候才相等

/**
 * Stack and Queues
 */

 // 数组有方法能够让数组表现得像一个栈.pop方法移除然后返回数组最后一个值.
 // push方法追加一个新的元素到array

 // 栈经常用在解释器和计算器

 function make_binary_op(func) {
     return function (my_little_array) {
        let wunth = my_little_array.pop();
        let zeroth = my_little_array.pop();
        my_little_array.push(func(zeroth,wunth));
        return my_little_array;
     }
 }

 let addop = make_binary_op(function(zeroth,wunth) {
     return zeroth + wunth;
 })

 let mulop = make_binary_op(function(zeroth,wunth) {
     return zeroth * wunth;
 })

 let my_little_stack = [];// []
 my_little_stack.push(3);// [3]
 my_little_stack.push(5);// [3,5]
 my_little_stack.push(7);// [3,5,7]
 mulop(my_little_stack);//[3,35]
 addop(my_little_stack);//[38]
 let answer = my_little_stack.pop();//38

 // shift方法跟pop方法很相似,除了它会移除和返回zeroth元素而不是最后一个元素
 // 非常怪异的名字unshift方法就像push除了它将新的元素前置到一个数组而不是末尾
 // shift和unshift方法比pop和push慢很多,尤其是如果数组很大的话
 // 使用shift和push制造了一个队列,你追加在后面追加新的元素然后从前面得到输出

 /**
  * Searching
  */

  // JavaScript 提供方法来搜索一个数组.indexOf方法接受一个值,它会跟数组的每一个元素进行比较
  // 从头开始.如果你的值匹配到了一个元素,它会停止搜索,并且返回那个元素的序号

  // 如果它匹配失败,它会返回-1.注意到这是一种等待发生的类型的错误
  // 因为-1是一个数,跟其他数都很像.
  // 如果你用indexOf的返回值没有明确地去检查-1,那么计算就可能导致错误，也没有警告

  //javascript有很多保底的值,它们其中的任何一个应该用到这里来

  // lastIndexOf方法跟indexOf方法很相似,除了它是在数组的尾部开始倒过来搜索
  // 它仍然使用-1来作为失败码

  // includes方法跟indexOf也很相似除了它返回true如果值被找到,找不到返回false

  /**
   * Reducing
   * 减轻
   */

   // reduce方法把一个数组减轻到只有单个值.它接受一个函数,这个函数接受2个参数
   // reduce方法以成对的值为参数来调用那个函数,反复调用
   // 知道只有单个值的时候,那个就是最终的结果

   // 有2个方式来设计reduce方法,一种方式是让它为每个元素都调用方法
   // 一个初始化的值必须要提供出来,来让事情开始

   function add(reduction,element) {
       return reduction + element;
   }
   let my_little_array = [3,5,7,11];

   let total = my_little_array.reduce(add,0); //total is 26

   // 对于每个元素,reduction的值会被传入到add里面,顺着当前的数组元素
   // 我们明确地传入了0,作为初始化的reduction value.add函数接受到的参数如下
   (0,3) //3
   (3,5) //8
   (8,7) //15
   (15,11)//26
   // add函数返回的每一个值变成了reduction 的下一次调用add的值

   // 初始的reduction也总是为0.如果我们传一个乘法函数来reduce,
   // 这样初始化的reduction应该是1.如果我们传一个Math.max到reduce
   // initial的reduction应该是-Infinity.
   // 这个创建一个危险,你需要注意选择reduction的值

   // 另外一种方式设计reduce是不需要一个初始的reduction value
   // 而是函数少调用一次.第一次调用它接受zeroth和wunth元素,zeroth元素变成了
   // 初始化的reduction的值

   total = my_little_array.reduce(add); //26
   // 现在add函数看到的参数是
   (3,5) //8
   (8,7) //15
   (15,11)//26

   // 函数被少调用一次,这样就没有选择了错误的初始值的可能性

   // Javascript做的一件很明智的事情是它的reduce方法能够在任意一种方式工作
   // 如果你传初始值,这个函数就为每个元素来调用
   // 如果你不传初始值,函数就不会为第一个元素调用,第一个元素作为初始值
   // 因此上面的reduce add的2种方式都能工作

   // reduceRight方法以同样的方式工作,除了它从数组的末尾开始.
   // 我希望它能够被取名为reduce_reverse

   // 我使用reduce来计算这本书的ISBN的check digit

   function isbn_13_check_digit(isbn_12) {
       const string_of_digits = isbn_12.replace(/-/g,"");
       if (string_of_digits.length === 12) {
           const check = string_of_digits.split("").reduce(
               function(reduction,digit,digit_nr) {
                   return reduction + (
                       digit_nr % 2 === 0
                       ? Number(digit)
                       : Number(digit)*3
                   );
               },
               0
           ) % 10;
           return (
               check > 0
               ? 10 - check
               : check
           );
       }
   }

   isbn_13_check_digit("978-1-94-981500") // 9

   /**
    * Iterating
    */

    // 对数组做的最常用的操作是为每个元素都做点事情
    // 历史上这种是被for语句来完成
    // Javascript提供了一套更加现代的实现

    // forEach的方法需要一个数组和一个函数.
    // 它为数组中的每个元素调用那个函数
    // 函数有3个参数,element,element_nr和array
    // element就是数组的元素
    // element_nr就是数组的序数,这序数很方便,如果有另外一个数组参与计算,并且你需要定位元素
    // array是个错误,不应该在这里,邀请你来修改这个正在处理的数组,通常都是一个坏的事情

    // 不幸的是,没有一个方法可以反向来处理,有一个reverse方法能够先调用
    // 但是reverse是一个破坏性方法,不能够在一个frozen的数组上使用

    // forEach方法不管它调用的方法的返回值
    // 又去的方法能够被制造出来,如果你注意它的返回值,下面就来看看这几个方法

    // every方法看到这个返回值.如果是falsy,every方法就会停止处理然后返回一个false
    // 如果是truthy,every方法继续处理,如果every方法到达数组的末尾,它返回true

    // some方法跟every方法很相似,不明白为什么这个功能还在语言中。如果函数的返回值是truthy
    // some方法就停止处理然后返回true
    // 如果是falsy,some方法继续处理,如果some方法达到了最后一个元素,它就返回false

    // find方法很像some方法,除了它不返回true或者false,他返回传入的函数处理之后是truthy的那个元素

    // findIndex方法很像find方法,除了它返回的是被处理的元素通过调用函数得到truthy的元素序数

    // filter方法很像find方法,除了filter返回所有的调用函数是truthy值,它跟find的区别是，find找到第一个匹配的
    // 而filter找到所有匹配的

    // map方法很像forEach,除了它收集了所有函数返回的值,并且将他们作为一个新的数组返回,map方法是一个理想的方式
    // 来做转化,然后创造一个新的数组,这个新的数组来放这些基于原始值的改进的或者放大

    // 这些方法都是更好的方式来处理数组而不需要回到for循环,但是这个方法的集合并不完整

    // forEach和find能够提前退出(带有退出心事的forEach有every和some),map,reduce，和filter没有提前退出的选项

    // reduce方法有一个反向运行的方法,reduceRight,但是forEach,map,filter和find没有选项能够反向工作

    // 这些的缺失,作为用来不废除for语句的正当理由

    /**
     * Sorting
     */

     // JavaScript有一个sort方法,不幸的是,它有一些问题

     // 它就在本地排序,修改了它排序的数组.那就意味着它不能够排序一个frozen的数组,并且排序一个共享数组也不安全

     let my_little_array = ["u","r","b","m"];
     my_little_array.sort();
     // my_little_array is ["b","m","r","u"]
     // 它的默认比较函数想把values当时string来处理,甚至它们是数字也是。
     let my_little_array = [11,2,19];
     my_little_array.sort();
     // my_little_array is [11,19,2]
     // 这个不仅是很恐怖的低效率,它也是个错的
     // 幸运的是,我们能够减轻这个通过传入一个比较函数到sort
     // 这个方法被给了2个元素.
     // 它期待返回一个负数如果第一个元素应该放在前面
     // 或者一个0,如果比较函数不能够得出结果

     // 这个比较函数能够正确地排一个数字数组(只要所有的元素是有限数值)

     function compare(first,second) {
         return first - second;
     }

     // 如果你想要比较不是有穷的(像NaN和Infinity),那么你的compare函数会不得不更复杂地工作

     // sort的下一个问题列表是缺少稳定性.一个排序是稳定的如果元素是均衡的(所有元素都相等,你的comparen函数返回0)
     // 如果是稳定就会数组里面的元素保持原始的相对位置不变
     // Javascript并不能保证这个稳定性
     // 当排序字符串或者数字的时候,这并不是一个需要忧虑的事情
     // 当排序变成数组的数组或者对象数组的时候,这就成了忧虑的事情
     // 一个复杂的排序,想要根据last name来排序,当last name一样的时候,根据first name来排序
     // 一种方式实现是第一次根据first name来排序,然后再根据last name来排序
     // 那个不能够工作因为sort是不稳定的,通过first name排好序的信息可能会丢失了

     // 我们能够减轻这个通过使用一个更复杂的比较函数,来使得它更简单,我们创造一个工厂,这个工厂制造compare函数

     function refine(collection,path) {
         // 接受一个数组或者对象,和一个字符串数组形式的路径
         // 返回路径最后的值,如果没有值,返回undefined
         return path.reduce(
             function(refinement,element) {
                 try {
                     return refinement[element];
                 } catch(ignore) {

                 }
             },
             collection
         );
     }

     function by(...keys) {
         // 这个工厂创造了一个比较函数来帮助一个对象数组或者数组的数组来排序
         // 参数是一个或者多个字符串或者整形数,代表着比较的属性名或者元素
         // 如果第一个参数难见分晓,然后尝试二个,第三个...

         // 将每个key转化到字符串数组中去

         const paths = keys.map(function (element) {
             return element.toString().split(".");
         });

         // 比较每一对值直到找到一个不匹配的
         // 如果没有不匹配的,那么这两个值相等
         return function compare(first,second) {
             let first_value;
             let second_value;
             if (paths.every(function (path) {
                 first_value = refine(first,path);
                 second_value = refine(second,path);
                 return first_value === second_value;
             })) {
                 return 0;
             }

             // 如果2个值是同一个类型,然后我们可以比较这2个值
             // 如果类型不同,我们需要有一个机制来对付这种怪异的情况
             // 我们最简单的机制是比较types的名字
             // boolean < number < string < undefined(也许给个失败更好,而不是来排序这种讨厌的类型)

             return (
                 (
                     typeof first_value === typeof second_value
                     ? first_value < second_value
                     : typeof first_value < typeof second_value
                 )
                 ? -1
                 : 1
             );
         };
     }

     /**
      * potpourri
      * 杂烩
      */
     // concat方法接受2个或者更多数组,然后连接它们来创造一个新的数组
     let part_zero = ["u","r"];
     let part_wun = ["b","m"];
     let whole = part_zero.concat(part_wun);
     // whole is ["u","r","b","m"]

     // join方法接受一个字符串数组和一个分割字符串
     // 它创造一个大的字符串能够连接任何东西
     // 用一个空的字符串作为分隔符如果你不想要分割
     // 这个是split方法的逆向操作

     let string = whole.join("&");
     // string is "u&r&b&m";

     // reverse方法移动元素,让他们以相反的顺序展现
     // 这是一个波坏性的操作,就像sort函数

     whole.reverse()
     // whole is ["m","b","r","u"];

     // slice方法能够拷贝一个数组,或者数组一部分的拷贝
     // 第0个参数决定的在哪个序数开始
     // 第一个参数是第0个参数加上元素的个数然后来拷贝
     // 举例来说,slice(1,4),表示从第index为1的元素开始拷贝,拷贝多少个？
     // 拷贝 4 - 1个也就是3个,也就会index为1,2,3的元素
     // 如果第一个参数省略,所有的剩余的参数都会被拷贝

     let element_nr = whole.indexOf("b");
     let good_parts;
     if (element_nr == -1) {
         good_parts = whole.slice(element_nr);
     }
     // good_parts is ["b","r","u"]


     /**
      * pure and Impure
      */
     // 函数式变成有个鼓励的原则是尽可能的pure
     // 数组的一些方法是pure,不改变他们的输入
     // 有一些不是,有一些应该是,但是却不是
     // 有些压根就不是pure但是却很有用

     // 当处理pure/impure 二重性的时候,知道哪些是pure哪些不是pure很重要

     // Pure methods:
     // concat,every,filter,find,findIndex,forEach,indexOf,join,lastIndexOf,map,reduce,reduceRight,slice,some

     // Impure methods:
     // fill,pop,push,shift,splice,unshift

     // Impure方法但是应该弄成pure的
     // reverse,sort



/**
 * conclusion
 */
//这一节涉及到的函数包括
// Array.isArray 数组的判断
// push pop shift unshift 数组模拟stack 和 queue
// indexOf lastIndexOf 数组的搜索
// reduce,reduceRight 数组的reduction
// forEach,every,some,find,findIndex,filter,map 数组的遍历
// sort(注意到这是不稳定的,同时也是破坏性的,能够通过写compare函数来排序较为复杂的排序) 数组的排序
// reverse，concat,join,slice 数组杂项







