## white-space in JavaScript ##
一个whitespace字符是一个在屏幕上的"空的区域"（没有任何可视化的字符表示）。whiteSpace字符的样例包括空格字符，tabs字符，换行符（这里要跟意识中的键盘上的回车enter按钮区分开,后面分一节讲，严格来说应该称呼为enter而不是回车）。

whitespace is a set of characters used to show horizontal or vertical sapces between other charaters.They are often used to separate tokens in HTML,CSS,JavaScript,and other computer launguages.-MDN

whitespace是一个字符集用来展示其他字符之间的水平或者垂直空间。它们经常用来在HTML,CSS,JavaScript和其他编程语言中当分隔标记。-MDN

在Javascript中，使用多余（这里的多余指代无意义的whitespace，字符串中的空格是有意义的,包括一些申明的空格也是有意义的）的whitespace会被忽略掉(通过词法解析过滤),例如下面的代码:

    a=   b      *    d -    c;
    a = b * d - c;

以上2行代码的是一回事。这2个语句都会以相同的方式去解析(interpret)，既然Javascript会忽略whiteSpace那为什么要强调这个呢？因为有了whiteSpace，就能够将代码写得可读性更好，就好比一个文档里面如果没有分段，没有空格，全都挤在一起是不好阅读的，更不好修改，去发现错误的。在写代码的时候尽量清晰，这个是最最重要的，毕竟代码是人在写，而机器会在interprete的时候将无用的whitespace去掉，构建的时候可以通过工具做压缩。、

## White-space in HTML ##
whitespace在2个标签之间,会被渲染成匿名文本节点。whitespace在叶子节点（一个不包含其他元素的元素）中,它会作为文本内容的一部分。

在html中加上whitespace的方法有通过加上&nbsp(non-breaking space),或者设置一些margin,padding之类的信息。

## white-space in CSS ##
whitespace在css文件中会被忽略，跟JavaScript一样。但是，不是所有的属性都可以随意whitespace,对于calc这个属性就不可以whitespace。

## 回车，换行和键盘上的enter及系统表示 ##
回车 `\r`本意是光标重新回到本行开头,r的英文return,控制字符可以写成CR,即Carriage Return,对应的ascii是13.

换行 `\n`本意是光标往下一行(不一定到下一行行首),n的英文是newline,控制字符可以写成LF,Line Feed，对应的ascii是10.

这2个字符在不同的操作系统中表示是不相同。

比如MAC上，`\r`就表现为回到本行开头并往下一行。

在UNIX类系统,`\n`就表现为光标下一行并回到行首。

在win系统下，这2个字符就是本意，`\r`表示回到行首,`\n`表示换行。

enter按钮的定义是跟系统相关的，通常enter按键是这2个加一起。

MAC系统行末结束符是`\r`,UNIX系统行末结束符是`\n`,windows系统行末结束符是`\r\n`

## 硬回车和软回车 ##
硬回车就是普通我们按回车产生的，它在换行的同时也起着段落分隔的作用。

软回车是`shift + Enter`产生，它换行，但是并不换段，即前后两段文字在word中属于`同一段`。

软回车能够使前后两行的行间距大幅度缩小，因为它不是段落标记，跟硬回车是有区别。硬回车相当于html代码`<p></p>`,段落的内容就夹在里面，而软回车对应的代码`<br/>`

网页的文字如果赋值到word中，则硬回车变成弯曲的箭头（回车上面的箭头，如果有），软回车变成向下的箭头。