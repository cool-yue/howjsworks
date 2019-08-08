/**
 * how javascript works chapter 9
 * how Strings works
 * 翻译
 */

 // 计算机擅长处理bit形式.人类不擅长。Strings在计算机和人类之间建立了桥梁.
 // 字符针对整形数的映射是数字计算机发展中的一个重大进步之一.
 // 这也是用户接口(UI)发展中的第一个重要一步

 // 我们不知道为什么叫这种类型为 string.
 // 为什么我们不叫他 text,没有人知道,一个javascript string并没有组装一块细线或者带子(string的单词意思)
 // 我们可以讨论一串字符,但是讨论语句串,bit串是不容易的,甚至是失败的串.
 // 在现实世界中,我们不去联系strings之间的关系(讽刺concat是连接字符串的功能,但是字面意思是联系事物的关系)
 // 我们只连接strings

 /**
  * foundation
  * 基础
  */

// 一个string是一个不可变的装有16bit无符号整形数(从0到65536)的数组
// 一个string可以挺过String.fromCharCode函数来制造
// 这个函数接受任意数量的number
// 一个string的元素能够通过charCodeAt来访问
// 每个元素不可变,因为strings总是被frozen了
// Strings像arrays一样,有一个length属性

const my_little_array = [99,111,114,110];// 每个数字当成一个16bit,也就是4位16进制无符号数
const my_little_string = String.fromCharCode(...my_little_array);//得到一个四位的字符串"corn"
my_little_string.charCodeAt(0) === 99 //true
my_little_string.length // 4
typeof my_little_string // "string"

// 中括号这个记号,能够被用来获取一个string中的某一个值,比如"corn"中的"r"
// 但是它不会像一个数组给一个数字给你,虽然说字符串本质上是一个16bit的无符号数的不可变数组
// 它会返回一个新的string,长度为1,它的内容也是个数字

my_little_string[0] === my_little_array[0] // false
my_little_string[0] === String.fromCharCode(99) // true

// String.prototype 包含一些方法作用在string上.
// concat和slice方法工作非常像是array方法
// 但indexOf方法工作不相同,indexOf的参数是一个string,不是一个数字
// 它目的是在第一个string中元素序列中匹配参数中所有的元素

my_little_string.indexOf(String.fromCharCode(111,114)) // 1
my_little_string.indexOf(String.fromCharCode(111,110)) // -1

// 方法 startsWith,endsWith 和contains仅仅是indexOf和lastIndexOf的包装器
// Strings包含一样的内容的被===操作符考虑成是相等的
// 内容一样的数组只有在它们是同一个数组的时候才相等

my_little_array === my_little_array; // true
my_little_array === [99,111,114,110] // false
my_little_string === String.fromCharCode(99,111,114,110) // true

// 字符串的相等是一个非常强大的功能
// 它终结了symbol类型的必要因为内容一样的数组被考虑成是一样的对象
// 这个在java语言中是不成立的

/**
 * Unicode
 */

// javascript允许所有的65536的16bit形式作为string的元素
// 但是通常的实践是考虑每个元素为一个字符,并且Unicode标准决定了字符的编码
// javascript有很多句法和方法支持对于Unicode
// Unicode标准申明一些码不是字符并且不应该被使用
// javascript不关心.它允许所有的16bit码,如果你视图让你的系统与其他系统交互
// 其他系统是通过一个lesser language,比如java,你应该不能乱用Unicode

// String字面量以双引号围绕0个或者多个Unicode字符(但引号也行,不推荐因为没必要)
// 每一个字符代表一个16bit的元素

// + 操作符用来做拼接操作
// 我们已经看到 + 也被用来做加法操作,如果你意图拼接他们
// 这时候你需要确保至少有一个操作数是string
// 一个实践方式是创造一个字符串字面量的操作数
// 另外一个方式是传一个值到String 函数中

my_little_string = "corn"; // true
"uni" + my_little_string //"unicorn"
3 + 4 // 7
String(3) + 4 // "34"
3 + String(4) // "34"

// 一个字符串字面量所有的必须在一行
// \用来作为转移字符,能够允许" \还有换行在string字面量中

// 中括号能够被用来从一个字符串中拿到字符
// 拿到的字符是以包含一个字符的字符串作为表现形式返回
// 没有character这个类型,一个character既能表示一个数也能表示一个字符串

// 很多语言确实有character类型,它经常被缩写成char,但是没有一个标准的发音

// 所有的字符串都被frozen,当它们被创建的时候,一旦被创建,一个字符串就不能被改变了
// 能够从字符串中拷贝的更小的块,但是每一块都是新的字符串
// 新的字符串能够通过拼接字符串来创建

const mess = "monster";
const the_four = "uni" + my_liitle_string + " rainbow butterfly " + mess;
// unicorn raibow butterfly monster
const first = the_four.slice(0,7) // "unicorn"
const last = the_four.slice(-7) // last is "monster"
const parts = the_four.split(" ");
// ["unicorn","ranibow","butterfly","monster"]

parts[2][0] === "b"; // true
"*".repeat(5) // "*****"
// 字符串填充方法,意思就是在rainbow前面添加/直到上限10
parts[1].padStart(10,"/") // "///rainbow"

/**
 * More unicode
 * 更多 unicode
 */

 // unicode的原始目的是能够以16bit来表示全世界存在的语言
 // 它的表后来改变成了21bit来表示全世界的语言
 // 不幸的是javascript被设计的时候处在Unicode 16bit的阶段

 // Unicode拿到JavaScript的字符并且把它们拆成2个新的术语,code unit 和code point
 // 一个code unit是这些16bit字符中的一个
 // 一个code point是一个字符对应的数字
 // 一个code point可以从1个或者多个code unit来形成

 // unicode定义了1114112 code points,分解成了17个65536 code points的平面
 // 原始平面现在称呼为Basic Multilinagual Plane(BMP)
 // 剩余的16个平面是补充平面
 // javascript能够简单地使用BMP中的平面因为在这个平面中一个code point能够被一个code unit来区分
 // 如果是补充字符的话,就会更复杂

 // javascript访问补充字符通过使用替代对(surrogate pair).
 // 一个替代对被2个特殊的code units构成
 // 有1024个高替代code units 和 1024个低的code units
 // 高的替代code units的codes比低的要小

 //0xD800 到 0XDBFF //高替代code units
 //0xDC00 到 0xDFFF //低替代code units

// 当成功配对时,每一个替代code unit贡献10个bit来形成一个20bit的偏移
// 相对65536（已经被添加）从而形成了code point
// 这个添加是为了终结有2个不同序列的code units但是最后制造了同一个code point的困惑
// 我认为这个解决方法导致更多的的困惑
// 一个简单的解决是让使用替代对在BMP中变成合法来表示一个code point
// 这个就产生了一个20bit的字符集,而不是一个21bit的字符集

// 考虑到the code ponit U+1F4A9(128169).
// 我们减去65536然后产生62633或者0xF4A9
// 高10bit是0x03D,低10位是0X0A9
// 0B 0000111101 0010101001  === 62633
// 我们添加0xD800到高位,0xDC00到低位
// 然后我们得到一个surrogate pair
// 所以javascript存U+1F4A9为U+D83D U+DCA9
// 从javascirpt的观点来看,U+1F4A9是2个16bit字符.它会显示成一个字符
// 如果操作系统合格的话.Javascript是最不能意识到补充平面的
// 但是它也没有对他们有明显的敌意

// 有2个方式来写code point U+1F4A9 在字符串中带转义
"\uD83D\uDCA9" === "\u{1F4A9}" // true
// 它们都创造了同一个string,这个string的长度为2
// 有一个string.fromCodePoint函数能够创造surrogate pairs
String.fromCharCode(55357,56489) === String.fromCodePoint(128169) //true

// codePointAt 方法跟 charCodeAt相似，除了它会看下一个字符
// 如果它们能够组成一个替代对,那么它就返回一个补充code point
"\uD83D\uDCA9".codePointAt(0) // 128169

// 大多数的字符,人们需要的来作为全球交流沟通的,基本上能够在BMP平面里找到
// 所以替代这个东西不是总是需要的,即使如此,补充字符能够在任意不确定的时候
// 出现,所以你的程序中应该能够有对它们的预见性

// Unicode 包含结合和修改字符,这些字符被加上了音调和其他的修改。它也包含字符
// 控制书写的方向和其他服务.有时候这些会变得复杂,所以2个字符串看起来包含了同样
// 的字符，但是他们不相等.unicode已经标准化规则,指定事物必须出现的顺序,并且当
// 基本的字符带有修饰的应该被复合的字符所替换
// 人类不会被这些规则所绑定,所以如果你必须处理不规范的资料,javascript包装了
// normalization规则在normalize方法中

// 音符
const combining_diaeresis = "\u0308";//
// u + 音符
const u_diaeresis = "u" + combining_diaeresis; //"ü"
// 直接带音符的u
const umlaut_u = "\u00FC";//"ü"
// 他们的结果并不相等
u_diaeresis === umlaut_u; //false
u_diaeresis.normalize() === umlaut_u.normalize(); //true

// unicode包含了很多重复和看起来很像的,所以string看起来内容一样但是不相等
// 这种情况还是会发生,甚至是在normalizion之后
// 这是一个疑惑之源也是一个安全危险的源头

/**
 * template String Literals
 * 模板字符串字面量
 */

 // 模板在web应用中的开发是一个非常流行的实践
 // 由于浏览器的DOM API已经不占主要地位了同时也有错误倾向
 // 盛行的实践是通过模板来创建html view
 // 这个相比于跟dom摔跤,这个能够简单很多
 // 它也会导致XSS和其他web安全的错误
 // javascritp模板字符串字面量意图是为模板提供支持
 // 同时减轻安全问题,这个部分情况下是成功的

 // 模板字符串字面量是能够放入多个行字符串字面量
 // `用来作为分隔符

 const old_form = (
     "can you "
     +"\nbelieve how"
     +"\nincreadibly"
     +"\nlong this"
     +"\nstring literal"
     +"\nis?"
 );

 const new_form = `can you
 believe how
 incredibly
 long this
 string literal
 is?`;

 old_form === new_form; //true

// 新的形式的提供了相对旧的形式的一个有重大意义的优势么？
// 有一个小的记号上的优势,但是它带来一个开销:
// 在语言中的最大的语法结构被一个最轻的在键盘上的可选字符所限制
// 潜在的错误数量很大.一个可见的模棱两可的被添加了
// 在incredibly后面有没有空格(这个可以通过调整编辑器来显示,但是默认是没有的)
// 用旧的形式来看的话,显然是没有

// 在大多数情况,长文本形式的资料不应该被存在程序中.
// 它应该被一个合理的工具来维护
// 像一个文本编辑器后者一个JSON编辑器或者一个数据库工具
// 然后这个文本被程序以资源的形式捆绑的形式读取
// 新的语法在鼓励一个不好的实践

// 用字符串来记录人类的语言很普遍
// 这些文本经常需要被翻译然后为全球观众所服务
// 我们不想维护一个分离的版本,每个版本装有不同的语言
// 我们想要一个单一的程序版本,能够以本地文本来接收
// 新的形式让这个变得复杂因为它限制了template string能够被提供给程序的方式

// 新的语法的好处是它提供了插入文字的功能.合法的表达式放在${}中
// 这个expression被计算,转化成字符串,然后插入

let fear = "monsters";
const old_way = "the only thing we have to fear is " + fear + ".";

const new_way = `the only thing we have to fear is ${fear}`

old_way === new_way // true;

// 新老方式的共同危险是内容可能是一些不友好的内容
fear = "<script src=https://themostevilserverintheworld.com/malware.js>";
// web提供很多机会来激活怀有恶意的资料.模板可能会增加这个脆弱性
// 大多数模板工具提供了减轻危险的机制,但是仍然允许这样的行为发生
// 最不好的是,模板字符串字面量带有插入文本的,默认就是不安全的

// 在这个案例中减轻这个是一个特殊的函数叫做tag function
// 用一个函数表达式处理模板字符串字面量之前,导致函数以tempelate string和表达是的值作为参数
// 来被调用,这个想法就是tag function被传入所有的块,这些块被正确的过滤,编码，组装和返回

// dump函数是一个tag函数,这个tag函数仅仅是返回人类可读的形式的所有的输入的资料
function dump(strings,...values) {
    return JSON.stringify({
        strings,
        values
    },undefined,4);
}

const what = "ram";
const where = "rama lama ding dong";

`Who put the ${what} in the ${where}` // "Who put the ram in the rama lama ding dong"

// 以下这种写法只能针对字符串模板,所谓的tag函数
const result = dump`Who put the ${what} in the ${where}`;

//the result is `{
//    "strings":["Who put the","in the","?"],
//    "values":["ram","rama lama ding dong"]
//}`

// strings被一起传入作为一个数组,但是values被传入作为单独的arguments
// tag function 能够减轻XSS和其他安全危险如果他们被正确地创建,如果tag函数
// 实际使用,但是再一次重申,默认是不是安全的

// 模板字符串字面量添加了很多新的语法,机制和复杂性,它们鼓励不好的实践,但是
// 确实也提供了一些好处,针对于大字符串的字面量

/**
 * Regular Expressions
 * 正则表达式
 */

 // 这些字符串函数能够接受正则对象作为参数,
 // match,replace,search,split
 // 正则表达式对象也有它们自己的方法
 // exec,test

 // 正则对象在string上面执行模式匹配
 // 正则表达式莫名其妙的简洁,但是非常地昂贵
 // 和它们一样强大,也有很多事情他们不能够做
 // 正则不够强大地去解析JSON text
 // 这是因为JSON parseing需要一些push down store来处理嵌套结构
 // 正则没有pushdown stores
 // pushdown stores
 // a storage device that handles data so that the next item to be
 // retrived is the item most recently stored (LIFO)
 // 后面进去的最先出来,类似于栈结构

 // 正则对象能够把JSON文本转成token
 // 这样就对于实现一个JSON parse有很大意义

 /**
  * Tokenization
  * 标记化
  */
 // 编译器tokenlize源程序作为编译的一部分.
 // 有其他的程序也会依赖tokenization
 // 包括编辑器,代码装饰器,静态分析,macro处理器和压缩器
 // 高交互的程序,像编辑器需要快速tokenlize
 // 不幸的是javascript是个非常复杂的语言来tokenize

 // 这是由于在正则和自动分号插入中间的交互
 // 这个导致模棱两可,让程序非常困难地解释

 // return /a/i , // 返回一个正则对象
 // return b.return /a/i; // 返回((b.return)/a)/i

 // 这个展示了不可能整体地正确地tokenize javascript程序
 // 不能够同时做一个完全的解析

 // 在template string字面量加入的时候就会更糟糕
 // 一个表达式能够被插入一个字面量,其余的模板能够嵌套在那个表达式的
 // 这个能够深入任意层.
 // 这个表达式也能够包含正则的字面量和strings包含`
 // 它非常困难去决定一个`是否是关闭当前字面量,或者开启一个嵌套的字面量
 // 它非常困难地决定出一个事物的结构是怎么样的

 // `${`${"\"}`"}`}`

 // 它会更变更糟糕,如果这些表达式能够也包含functions，functions里面又有正则字面量
 // 和丢失的分号和更多的字符串模板

 // 像编辑器这样的工具会假定你的程序行为正常,有一个javascript的子集能够tokenize而不是
 // 做一个完全的解析,如果你疯狂地尝试这个全解析,你应该会期待你的工具失败

 // 我希望下一代语言能够轻松tokenize?(be trivial to tokenize).同时,我不推荐使用插入文本在字符串模板中

/**
 * Fulfill
 */

// 让我们来考虑一个字符串模板插入的一个另外的实现方式,一个加fulfill的函数
// 它传入一个string,这个string可能也包含symbolic变量,和一个对象,或者一个数组包含
// 值,这个值应该替换掉这个symboli变量.它也能够传入一个函数或者函数的对象,函数可以编码这个替换

// 字符串模板的一个潜在的问题是任何东西在作用域中都是可用的插入内容
// 很方便但是有一个安全危险
// fulfill函数只有你明确传入的值的这些访问范围,所以要安全一些
// 默认的编码器在某些上下文中移除了那些被认为是危险的字符
// 所以在HTML中,它默认是安全的,不像模板字符串,它默认就是不安全的
// 但是像模板字符串的插入,它可能不安全,如果你乱用编码器

// 字符串能够来自任意的源,例如一个JSON或者一个字符串字面量.
// 它不需要在javascript文件中才用.这个最好是能够适应本地应用的需要

// 一个symbolic变量被包装在{}中.它不能包括任何的空格和大括号.
// 它能够包含一个path,并且可选地一个冒号,冒号后面跟着编码的名字
// 一个路径是一个或多个名字或者数字,被.来分离

// {a.very.long.path:hexify}

// container是一个对象或者数组,它会保存值,这些值会代替symbolic变量.
// 它能够包含检讨的对象和数组
// 这个values将会被发现通过这个path
// 如果代替物是一个函数,就调用这个函数,它的返回值是这个代替的值
// 容器自己也能是一个函数,调用它,传入路径和编码来得到代替的值

// 代替值能够通过一个编码器被转化.这个是主要在模板中减轻安全问题
// 当然还有其他的用途

// 可选的编码器参数能够是一个对象包含encoder functions.对symbolic variaable编码的这一部分选择
// encoders中的一个.如果encoder对象没有一个匹配的函数,原始的symbolic variable将不会被替换.encoder
// 参数也能是一个encoder function,所有的symbolic variable都会经过这个函数
// 一个encoder function被传入替代候选,路径和encoding的名称
// 如果它不返回一个string或者一个数,原始的symbolic variable将不会被替换

// 如果一个symbolic variable没有指定一个编码,就假定是""

// 一个path包含一个数,这个数对应一个值的数组中的一个元素
// 或者在值的对象中的属性的名字.路径能够包含.所以属性从一个嵌套的对象和数组中能够被找到

// Symbolic variables仅在他的很好的结构的时候才会被替换,如果有一个替换的值,并且编码也指定了并且
// 正确地实现了.如果有任何东西不对,symbolic variable就会被留在那个位置.大括号能够放入到字符串中不需要
// 转义,如果他们不是一个symblic variable的一部分,他们会被留在那里

const example = fulfill(
    "{greeting},{my.place:upper}! :{",
    {
        greeting:"Hello",
        my:{
            fabulous:"Unicorn",
            insect:"Butterfly",
            place:"World"
        },
        phenomenon:"Rainbow"
    },
    {
        upper:function upper(string) {
            return string.toUpperCase();
        },
        "":function identitiy(string) {
            return string;
        }
    }
);

console.log(example);
// example的值是 "Hello,WORLD! :{"

// entitiyify 函数让text插入到html中更安全
function entitiyify(text) {
    return text.replace(/&/g,"$amp;").replace(/</g,"$lt;").replace(/>/g,"$gt;").replace(/\\/g,"$bsol").replace(/"/g,"$quot;");
}

// 我们现在在一个模板中插入危险的数据
const  template = "<p>Lucky {name.first} {name.last} won ${amount}.</p>";
const person = {
    first:"Da5id",
    last:"<script src=http://enemy.evil/pwn.js>"
};
// 我们调用fulfill function
fufill(template,{name:person,amount:10},entityify);
//"<p>Lucky Da5id $lt;script src=enemy.evil/pwn.js/$gt;won$10.</p>"

// the entityify编码器渲染邪恶的脚本标签,对HTML无害

// 现在我将要像你展示我使用代码来准备书的章节列表

// 章节列表是以json文本的形式,有字面的大括号在模板中
// 呈现出来没有问题.它展示了嵌套调用来调用fulfill
// 避免了词法上的嵌套模板的复杂性(也就是写一个很复杂的字面量出来)

// 下面来看看fullfil的实现
const rx_delete_default = /[<>&%"\\]/g;
const rx_syntactic_variable = /\{([^{}:\s]+)(?::([^{}:\s]+))?\}/g;

// capturing groups:
// [0]origin (在括号中的symbolic variable)
// [1]path
// [2]encoding

function default_encoder(replacement) {
    return String(replacement).replace(rx_delete_default,"");
}

// fulfill
function fulfill(
    string,
    container,
    encoder = default_encoder
) {
    // fulfill函数接受一个含有symbolic variable的字符串,一个generator的函数或者一个对象或者数组包含
    // 值来替换symbolic variables,然后一个可选的encoder函数或者encoder函数对象
    // 默认的encoder移除了所有的尖括号

    // 大部分的工作都是通过replace方法来完成,该方法找到symbolic variables,展现他们作为原始的子字符串
    // 一个path 字符串和一个可选的编号字符串
    return string.replace(
        rx_syntactic_variable,
        function (original,path,encoding="") {
            try{
                //使用path从容器中获取一个单一的替换值.
                //path包含一个或者多个names或者nubmers以.来分离
                let replacement = (
                    typeof container === "function"
                    ?container
                    :path.split(".").reduce(
                        function (refinement,element) {
                            return refinement[element];
                        },
                        container
                    )
                );
                // 如果这个替换值是一个函数,调用它来获取这个替换值
                if (typeof replacement === "function") {
                    replacement = replacement(path,encoding);
                }
                // 如果encoder对象已经提供了,调用它其中的一个函数
                // 如果encoder是一个函数,调用它
                replacement = (
                    typeof encoder === "object"
                    ? encoder[encoding]
                    : encoder
                )(replacement,path,encoding);

                // 如果replacement是一个number或者boolean
                // 把它转化成一个string
                if (
                    typeof replacement === "number"
                    || typeof replacement === "boolean"
                ) {
                    replacement = String(replacement);
                }

                // 如果replacement是一个字符串,就做替换
                // 除此之外就让这个symbolic variable保持原始状态
                return (
                    typeof replacement === "string"
                    ? replacement
                    : original
                );
            } catch (ignore) {
                return original;
            }
        }
    );
}

// 下面看看实践
const chapter_names = [
    "Read Me First!",
    "How Names Work",
    "How Numbers Work",
    "How Big Integers Work",
    "How Big Floating Point Works",
    "How Big Rational Work",
    "How Boolean Work",
    "How Array Works",
    "How Objects Works",
    "How Strings Work",
    "How Bottom Values Work",
    "How Statements Work",
    "How Functions Work",
    "How Generations Work",
    "How Exception Work",
    "How Programs Work",
    "How this Works",
    "How Class Free Works",
    "How Tail Calls Work",
    "How Purity Works",
    "How Eventual Programming Works",
    "How Date Works",
    "How JSON Works",
    "How Testing Works",
    "How Optimiziong Works",
    "How Transpiling Works",
    "How Tokenizing Works",
    "How Parsing Works",
    "How Code Generation Works",
    "How Runtimes Works",
    "How Wat Works",
    "How This Book Works"
];
const chapter_list = "<div>[</div>{chapters}<div>]</div>";
const chapter_list_item = `{comma}<a href="#{index}">{"number":{index},"chapter":"{chapter}"}</a>`;
fulfilll(
    chapter_list,
    {
        chapters:chapter_names.map(function(chapter,chapter_nr) {
            return fulfill(
                chapter_list_item,
                {
                    chapter,
                    index:chapter_nr,
                    comma:(chapter_nr > 0)
                        ?",":""
                }
            ).join("");
        })
    },
    entityify
)

// 上面的逻辑是,首先在chapter_names这一层级循环调用fullfil整成一个巨大的字符串
// 然后在外层继续调用这个fulfill,来将生成的巨大字符串一些敏感字符替换掉,最后替换到
// 最外成的字符串中
