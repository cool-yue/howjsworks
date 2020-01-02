JS是语句语言,一个语句可以是一个或者多个表达式组成的。

JS解析源码的时候,有自动插入分号的机制,初衷是帮助新人能够松散地写代码而不出错,然而crockford先生认为这个是弄巧成拙。JS不是一个不要分号的语言,它原则上是需要分号的,只是自动分号的插入,搞得它像不需要分号也能跑一样。

下面列出收到自动分号插入影响的语句。

1.empty statement，空语句.

2.var 语句.

3.expression statement,表达式语句。

4.do-while语句(几乎不用,完全能够被if取代)

5.continue语句(偶尔用,但是按照crockford的范式,这个也不应该用)

6.break语句(偶尔用,但是按照crockford的范式,这个也不应该用)

7.return语句

8.throw语句

## 案例 ##
    { 1
    2 } 3

转化成

    { 1
    ;2 ;} 3;

数字1后面跟着一个换行符,语法里面是没有换行符，根据插入分号规则.

    When a token (LineTerminator or }) is encountered that is not allowed by the grammar, a semicolon is inserted before it if:
    
    The token is separated from the previous token by at least one LineTerminator.
    
    
    The token is }

所以在换行符前面会插入一个分号，`LineTerminator`是依据系统的,通常windows是`\r\n`,而unix是`\n`.

而数字2后面跟着一个`}`因此在这个符号的前面会插入分号。

    a = b
    ++c

转换成

    a = b;
    ++c;

因为它们不能被分析成一个完整的语句,那么中间就会插入分号。

    return 
      "something";

转化成

    return;
      "something";

显然这样就是大问题了,所以在`return`,`break`, `throw`, `continue`都应该在同一行加上分号。


