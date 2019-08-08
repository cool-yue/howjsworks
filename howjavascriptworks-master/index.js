import tokenize from "./neo.tokenize.js";
import code from "./neo.js";
import parse from "./neo.parse.js";

export default tokenize;

const code1 = tokenize(code);

function repeat(generator) {
    // 注意这个if条件
    // 这个条件相当于调用了generator
    // 只要结果不是undefined就会return repeat(generator)来继续尾调
    if (generator() !== undefined) {
        console.log(generator());
        return repeat(generator);
    }
}
repeat(code1);

