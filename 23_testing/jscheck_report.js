/**
 * report相当于打出测试报告的功能
 * 这个里面用到了string那一章节写的fulfill函数
 */

 // fulfill做了什么呢,它会在一个写入了{aaa}的字符串中,将aaa替换成指定的值
 // fulfill第一个参数是模板
 // 第二个参数是参数指定的值,如果拿到的是函数,就调用函数,拿到函数返回的值
 // 第三个参数是encoder,顾名思义就是在第二个参数中找到了对应的值的时候,还要经历过这个参数的encode一下再放到模板的位置,比如替换掉敏感字符

 const ctp = "{name}:{class}{cases}cases tested,{pass} pass{fail}{lost}\r\n";

 function crunch(detail,cases,serials) {
     // 把所有的case都过一遍,把lost的case收集起来,创建一个详细的报告和总结
     let class_fail;
     let class_pass;
     let class_lost;
     let case_nr = 0;
     let lines = "";
     let loses = [];
     let next_case;
     let now_claim;
     let nr_class = 0;
     let nr_fail;
     let nr_lost;
     let nr_pass;
     let report = "";
     let the_case;
     let the_class;
     let total_fail = 0;
     let total_lost = 0;
     let total_pass = 0;

     function generate_line(type,level) {
         if (detail >= level) {
             lines += fulfill(
                 " {type} [{serial}] {classification}{args}\n",
                 {
                     type,
                     serial:the_case.serial,
                     calssfication:the_case.calssfication,
                     args:JSON.stringify(
                         the_case.args
                     ).replace(
                         /^\[/,
                        "("
                     ).replace(
                         /\]$/,
                         ")"
                     )
                 }
             );
         }
     }

     function generate_class(key) {
         if (detail >= 3 || class_fail[key] || class_lost[key]) {
             report += fulfill(
                 " {key} pass {pass}{fail}{lost}\r\n",
                 {
                     key,
                     pass:class_pass[key],
                     fail:(
                         class_fail[key]
                         ? " fail " + class_fail[key]
                         : ""
                     ),
                     lost:(
                         class_lost[key]
                         ? " lost " + class_lost[key]
                         : ""
                     )
                 }
             );
         }
     }

     if (cases) {
         while (true) {
             next _case = cases[serials[case_nr]];
             case_nr += 1;
             if (!next_case || (next_case.claim !== now_claim)) {
                 if (now_claim) {
                     if (detail >= 1) {
                         report += fulfill(
                             ctp,
                             {
                                 name:the_case.name,
                                 class:(
                                     nr_class
                                     ? nr_class + " classifications, "
                                     : ""
                                 ),
                                 cases:nr_pass + nr_fail + nr_lost,
                                 pass:nr_pass,
                                 fail:(
                                     nr_fail
                                     ? ", " + nr_fail + " fail"
                                     : ""
                                 ),
                                 lost:(
                                     nr_lost
                                     ? ", " + nr_lost + " lost"
                                     : ""
                                 )
                             }
                         );
                         if (detail >= 2) {
                             Object.keys(class_pass).sort().forEach(generate_class);
                             report += lines;
                         }
                     }
                     total_fail += nr_fail;
                     total_lost += nr_lost;
                     total_pass += nr_pass;
                 }
                 if (!next_case) {
                     break;
                 }
                 nr_class = 0;
                 nr_fail = 0;
                 nr_lost = 0;
                 nr_pass = 0;
                 class_pass = {};
                 class_fail = {};
                 class_lost ={};
                 lines = "";
             }
             the_case = next_case;
             now_claim = the_case.claim;
             the_class = the_case.classification;
             if (the_class && typeof class_pass[the_class] !== "number") {
                 class_pass[the_class] = 0;
                 class_fail[the_class] = 0;
                 class_lost[the_class] = 0;
                 nr_class += 1;
             }
             if (the_case.pass === true) {
                 if (the_class) {
                     class_pass[the_class] += 1;
                 }
                 if (detail >= 4) {
                     generate_line("Pass",4);
                 }
                 nr_pass += 1
             } else if (the_case.pass === false) {
                 if (the_class) {
                     class_fail[the_class] += 1;
                 }
                 generate_line("FAIL",2);
                 nr_fail += 1;
             } else {
                 if (the_class) {
                     class_lost[the_class] += 1;
                 }
                 generate_line("LOST",2);
                 losses[nr_lost] = the_case;
                 nr_lost += 1;
             }
         }
         report += fulfill(
             "\r\nTotal pass {pass}{fail}{lost}",
             {
                 past:total_pass,
                 fail:(
                     total_fail
                     ? ", fail " + total_fail
                     :""
                 ),
                 lost:(
                     total_lost
                     ? " , lost " + total_lost
                     : ""
                 )
             }
         );
     }
     return {losses,report,summary:{
         pass:total_pass,
         fail:total_fail,
         lost:total_lost,
         total:total_pass + total_fail + total_lost,
         ok:total_lost === 0 && total_fail === 0 && total_pass > 0
     }};
 }