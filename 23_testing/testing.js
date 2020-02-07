/**
 * How Testing Works
 * 程序测试能够用来展示有哪些bug,但是从来不会展示bug不存在！
 */

 // 电脑程序是人类创造的最复杂的东西
 // 没有别的东西是由这么多错综复杂的东西组成并且还都需要互相适配然后完美地协同工作
 // 一个完成的程序必须在每方面都完美(perfect)
 // 对于所有的输入,对于所有的状态,对于所有的条件,对于所有的时间
 // 我们跟计算机之间的契约是如果我们给了一个不是很完善的程序,那么计算机就有资格做可能在最坏的时间里面做最糟糕的事情
 // 这不是计算机的错,这是你的错

 // 我们没有一个针对完美性的测试
 // 我们可以证明一个程序存在缺陷,但是我们不能证明一个程序没有缺陷
 // 测试可以作为是正确工作的证据
 // 一个程序可以通过以数学方式证明的它是没有bug的
 // 这个被当做在计算机科学中最重要而突出的问题
 // 但是不幸的是,它从来没有被解决
 // 这些数学证据要比它们意图证明没有bug的程序本身要复杂得多
 // 这个复杂性是压倒性的

 // Robin Milner 和其他一些提议type类型的可靠性可以成为另外一个更实际的一种证据
 // type能够比验证更加简单地集成进程序
 // Milner著名地说出,良好的type程序不会"出错"
 // 但是在那些拥有良好type系统的语言,像haskell,还有那些拥有非常糟糕的type系统的语言,像C++,Java
 // 程序还是会出错.可能有一天type会还债,只是现在还没有到时候

 // 随着数学验证和type的失败,我们把我们已经知道并不完美的程序放入产品模式(production)
 // 希望我们能够在任何人发现错误之前发现并且修改错误
 // 这个很疯狂,这个是当时的技术水平

 // 应该有更好的方式,但是如果有,当时还没有人发现它

 // 所以这个把我们带回了测试
 // 测试,当做得很好的时候,能够识别出缺陷并且给我们信心缺陷已经修复了
 // 甚至当测试做得很好了,依然不能证明bug已经没了
 // 然而呢测试不是总是做得很好的

 // 在70年代末期和80年代初期,Atari比地球上面其余的公司卖出更多的软件
 // 大部分的软件都是烧进ROM(read only 内存)chips
 // ROM里面的错误如果要被修复
 // 你必须把它们丢掉然后重新做个新的
 // Atari做了一个拥有一个操作系统在rom中的家用电脑
 // 我确实对那个印象很深
 // 他们编程是哪里来的信心把那个东西放进ROM里面.它们是怎么做的?

 // 我作为一个研究者在Atari合作实验室里面工作.
 // 这个让我找到了Atari是如何做的
 // 这也是他们的秘密
 // 他们会把那些东西试一试
 // 如果它看起来可以工作
 // 他们就会把它送到工厂
 // 他们很幸运
 // 当他们的ceo宣布E.T.这个游戏不需要更多测试的时候,他们的运气也耗尽了
 // 他们的公司没有活过那个决定

 // 程序在那个时候是要小很多和简单很多。
 // 如果一个程序只有几KB的话
 // 认真的写代码,认真的测试能够产出一个好的结果
 // 今天的程序是庞大的.没有人可以把它们所有的都理解
 // 我们怎么能确定太复杂以至于不能够理解的东西，它是正确的？

 /**
  * bugs
  */
 // bugs是被thomas alva edison发明的
 // 他正在开发他的留声机，这是一个可以录音,然后用一个触笔放在一片箔板环绕的一个旋转的圆盘上,重新制造出之前录音的设备
 // 他的这个原型，在每一次这个触笔旋转穿过箔纸薄片的边缘的时候会发出声音
 // Edison给一个记者说道他弄了一整晚来把虫子(bugs)从留声机里面弄出去

 // 这个词疯狂流行了
 // 多年来有很多故事关于疯狂发明家他们把他们的发明中的最后一个虫子弄出去而一夜暴富的故事

 // 有一个非常有名一个飞蛾被困在了Harvard Mark II机器的中继器中的故事
 // Grace Murray Hopper把那个飞蛾用胶带粘在它的日志本里面
 // 带着“第一个实际的发现虫子的案例”的说明文字
 // 这不是第一个bug,但是它是第一个被昆虫导致的bug
 // 尽管有正当的理由bug是被人工智能潜在造成的,但是大多数还是人类造成的

 // 我们必须尝试劲量终结我们的程序中的困惑
 // 当我们期待一个程序做一件事的时候它做了其他的事情
 // 这个就会让我们对于程序变得困惑
 // 我们必须让我们的程序劲量简单和干净来减少困惑
 // Bug就是Confusion的另外一个单词
 // 消除困惑比测试更加富有成效

 /**
  * Bloat
  */

  // 软件开发中的一个最大问题之一是软件肥胖或者膨胀
  // 程序太大了。
  // 这个可以是由于非成熟特性的选择,但是通常是差的架构导致的
  // 继承是一个很流行的代码复用模式
  // 但是它并不能很好地工作,所以拷贝-粘贴经常被使用
  // 也存在过度依赖库,平台和一些包,这些跟很多其他的库,平台,包存在紧耦合
  // 膨胀是敏捷开发实践的副作用
  // 开发团队被扩大来处理膨胀,但是大的团队导致了更多的膨胀

  // 膨胀导致被攻击面增加和给bug更多的位置隐藏从而导致安全问题
  // 膨胀的系统非常难以准确地测试

  // 缓存可以减轻一些浏览器中膨胀的症状,但是不幸的是,浏览器不是非常善于缓存
  // 存在一些工具将lazy loaders和tree shakers,这些延迟或者移除一些不必要的代码
  // 但是为了解决这个症状,它们积累了更多的膨胀代码

  // 最好的解决膨胀的问题是开始就不让它发生
  // 把软件精简作为设计的第一优先
  // 避免非常膨胀的依赖包
  // 和导致膨胀的工具
  // 避免类
  // 雇佣更小更加良好训练的开发团队
  // 并且积极实践代码删除
  // 保留一些开发流程循环中的移除不必要的代码和淘汰一些有问题的package
  // 当一个项目中的代码行数下降这是值得庆幸的
  // 采纳"最小的大原则"

  // 一些特性有一些收益,但同时它们也有开销
  // 如果我们没有考虑开销
  // 我们要付出膨胀的代价

  /**
   * TDD
   */

   // 我喜欢测试驱动开发作为方法论
   // 我讨厌测试驱动开发作为一种信仰
   // TDD狂热分子告诉过我凌乱的,容易出错的代码是被允许的,在TDD模式下是鼓励的
   // 这个就在假设测试能够找到所有的bug
   // 所以就不需要一个成熟老练具有良好训练的代码风格

   // 这就是一个好的实践如何转变成了一个差的实践
   // 事实是测试并不能够被依赖去找到所有的bugs
   // 我们应该在避免bug上面投资
   // 好的代码实践是一个质量上的便宜的投资
   // 我自己的代码风格多年来随着我观察到的bug产生的形式和我减轻bug的形式而改变

   // 我从一个狂热分子那里接收到一个JSLint的bug报告
   // 他引入一个JSLint排斥的函数
   // 他说JSLint肯定是错了因为这个函数通过了单元测试
   // 随便一看,JSLint是正确的
   // JSLint在正则中找到了一个bug而测试没有发现
   // 是这个测试包含错误
   // 虚假的否定通常能够快速得到修复
   // 虚假的肯定是名垂千古地存在而不会解决
   // 这些测试给了我们假的信心,这不是真正的质量,什么能够测试你的测试呢？

   // 单元测试是在低层次的代码中非常高效的
   // 例如,在第三章的Big Integer库是个低层次的
   // 几乎没有任何依赖
   // 我为它写了很多单元测试
   // 这些测试在对于开发库是一个很大的帮助

   // 单元测试变得没那么高效当我们向上爬的时候
   // 随着依赖的增加,测试变得没那么有意义
   // 测试的开销也提升了,因为需要开发stubs,mocks和fakes（我听说过开发者浪费时间来争论什么东西是一个fake什么是一个mock）
   // 随着我们的上升,复杂度从组件转移到了组件之间的关联了

   // 随着纯粹度的下降,bugs就上升了,但是单元测试不能够测试纯粹
   // 如果有一个很差的模块化,bugs就更容易出现,但是单元测试也不能测试模块化的设计
   // 随着时间的推移,代码就膨胀了,但是单元测试也不能够测试膨胀
   // 到达极限的时候,我们是在测试fakes和mocks而不是程序
   // 我不是说单元测试是坏的
   // 我是在说它们不够
   // 我们写了越来越多的测试然后发现越来越少的bug
   // 除了这个以外,这个结果被称作"tolerance"(忍受程度)

   // 它听起来没希望,但是测试是必要的
   // 好的和认真的设计和编程是最重要的
   // 但是还不够,我们依旧需要高效地测试
   // 我们必须测试

   /**
    * You Shall Not Pass
    */
   // 大部分的测试库支持像这样的调用:
   assertEquals("add 3 + 4",7,add(3,4));
   // 它让我对于写一个测试有一个好的感觉
   // 但是思考一下,一个简单的相加，是否能够发现这个add函数中一些细微的错误？
   // 一个非常多的测试需要建立在一个更大范围的值的基础上
   // 但是谁愿意写出所有的这些测试呢?
   // 同时,这种形式不能够测试异步程序
   // 它只能够测试同步的函数

   // 这就是为什么我写了一个测试的库叫做JSCheck，这个是受到一个Haskell工具叫做QuickCheck的启发
   // JSCheck做case的生成,自动化创建很多随机的尝试
   // JSCheck也支持事件性编程来测试服务器和浏览器的应用

   jsc.claim(name,predicate,signature,classifier)

   // JSCheck提供的最重要的函数叫claim函数
   // 一个claim函数是一个程序的断言

   // name是一个描述性字符串用在报告中

   // predicate是一个函数传递ture如果程序正确的工作
   // 这个函数接受一个判决(verdict)回调,这个回调函数用来传送每一次的测试案例的结果
   // 剩下的参数被signature参数所决定

   // signature是一个装generator函数的数组,它是为predicate函数创造参数的
   // 这些generators能够简单地用JSCheck提供的指定参数生成器来创建

   // classifier函数可选
   // 它能够被用来阻止那些不合法的测试
   // 它也能够被用来分类测试来让模式简单化,容易计算出结果

   jsc.check(configuration)

   // 你可以创建足够多的你想要的claim
   // 然后你调用jsc.check函数来检查所有的claims都是好的

   // jsc.check函数接收一个配置对象,这个配置对象可以包含下列属性:

   // time_limit:毫秒为单位.每个测试可能有3个输出.PASS,FAIL,LOST.任何一个在过期之前不传verdict回调的测试都被认为是LOST
   // 在某些情况下,太晚地拿到正确的结果跟失败没有区别

   // on_pass:一个针对通过的测试的回调
   // on_fail:一个针对失败的测试的回调
   // on_lost:一个针对不能在指定时间回传一个verdict的测试的回调
   // on_report:一个针对report的回调
   // on_result:一个针对总结的回调
   // nr_trails:每一个claim有多少次测试会被执行
   // detail:报告中的详细信息的等级
   // 0:没有报告
   // 1:有一个简短的报告,展示每个claim的通过的分数
   // 2:每个独立的失败的案例会被报告
   // 3:分类的汇总也会被报告
   // 4:所有的案例都会被报告

   // 与其在Big Integer中独立测试每个函数
   // 我设计了一个测试,这个测试可以包含多个一起工作的函数
   // 例如,demorgan测试用了random,mask,xor,or和eq
   // JSCheck创造一个随机整数,这个整数被用来创建随机的big integers,这个应用了DeMorgan Law

   jsc.claim(
       "demorgan",
       function (verdict,n) {
           // !( a && b) === !a || !b;

           let a = big_integer.random(n);
           let b = big_integer.random(n);
           let mask = big_integer.mask(n);
           let left = big_integer.xor(mask,big_integer.and(a,b));
           let right = big_integer.or(
               big_integer.xor(mask,a),
               big_integer.xor(mask,b)
           );
           return verdict(big_integer.eq(left,right));
       },
       [jsc.integer()]
   );

   // 我创建一个generator,这个generator制造大整数用作我的一些测试
   // JSCheck提供的指定器非常强大,但是 它们对大整数一无所知,所以我创建了一个自己的

   function bigint(max_nr_bits) {
       return function () {
           let nr_bits = Math.floor(Math.random * max_nr_bits);
           let result = big_integer.random(nr_bits);
           return (
               Math.random() < 0.5
               ? big_integer.neg(result)
               : result
           );
       }
   }

   // 我一起来测试乘法和除法
   // 我提供了一个分类器函数来拒绝除0的测试

   jsc.claim(
       "mul & div",
       function (verdict,a,b) {
           let product = big_integer.mul(a,b);
           return verdict(big_integer.eq(a,big_integer.div(product,b)));
       },
       [bigint(99),biginit(99)],
       function classifier(a,b) {
           if (!big_integer.is_zero(b)) {
               return "";
           }
       }
   );
   // 我一起来测试乘法和除法
   // 但是这一次包含余数
   // 分类器emits(发出)2个值的符号
   // 创造分类的行为,"--","-+","+-"和"++"
   // 这个帮助隔离那些由于符号的操作引起的bug

   jsc.claim("div & mul & remainder",function(verdict,a,b) {
       let [quotient,remainder] = big_integer.divrem(a,b);
       return verdict(big_integer.eq(
           a,
           big_integer.add(big_integer.mul(quotient,b),remainder);
       ));
   },[bigint(99),bigint(99)],function classifier(a,b) {
       if (!big_integer.is_zero(b)) {
           return a[0] + b[0];
       }
   });

   // 我围绕着一致性建立测试.
   // 例如,给一个n个1的字符串bit加上1
   // 跟2**n的结果一样

   jsc.claim("exp & mask",function(verdict,n) {
       return verdict(
           big_integer.eq(
               big_integer.add(big_integer.mask(n),big_integer.wun),
               big_integer.power(big_integer.two,n)
           );
       )
   },[jsc.integer(100)])

   // 这里有另外一个相等性：(1 << n) -1 应该是n个1的bit
   jsc.claim("mask & shift_up",function(verdict,n) {
       return verdict(big_integer.eq(
           big_integer.sub(
              big_integer.shift_up(big_integer.wun,n),
              big_integer.wun
           ),
           big_integer.mask(n)
       ));
   },[jsc.integer(0,96)]);
   // 我创建一个像这些大的集合的test
   // 这种testing的风格相较于从3+4,我得到了更多的信息。
