import jsc from "./jscheck.js";
import big_integer from "./big_integer.js";




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

jsc.check({
    detail:5,
    on_pass:function(passRes) {
        console.log(passRes);
    }
});