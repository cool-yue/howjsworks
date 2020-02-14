import $NEO from "./neo.runtime.js"
const $1 = $NEO.number("1");
const $0 = $NEO.number("0");

var reduce_reverse = $NEO.stone(function (array, callback_function, initial_value) {
    var element_nr = $NEO.length(array);
    var reduction = initial_value;
    if ($NEO.eq(reduction, undefined)) {
        element_nr = $NEO.sub(element_nr, $1);
        reduction = $NEO.get(array, element_nr);
    }
    var exit = $NEO.stone(function (final_value) {
        element_nr = $0;
        return final_value;
    });
    while (true) {
        element_nr = $NEO.sub(element_nr, $1);
        if ($NEO.lt(element_nr, $0)) {
            break;
        }
        reduction = callback_function(reduction, $NEO.get(array, element_nr), element_nr, exit);
    }
    return reduction;
});



let ast = codeGen(parse(tokenize(
    `def reduce reverse: ƒ array, callback function,initial value {
        var element nr:length(array)
        var reduction:initial value
        if reduction = null
            let element nr:element nr - 1
            let reduction:array[element nr]
        def exit:ƒ final value {
            let element nr:0
            return final value
        }
        loop
            let element nr:element nr - 1
            if element nr < 0
                break
            let reduction: callback function(
                reduction
                array[element nr]
                element nr
                exit
            )
        return reduction
    }`)));