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

let value = isbn_13_check_digit("978-1-94-981500") // 9
console.log(value);



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

let people = [
    {first:"Frank",last:"Farkel"},
    {first:"Fanny",last:"Farkel"},
    {first:"Sparkle",last:"Farkel"},
    {first:"Charcoal",last:"Farkel"},
    {first:"Mark",last:"Farkel"},
    {first:"Simon",last:"Farkel"},
    {first:"Gar",last:"Farkel"},
    {first:"Ferd",last:"Berfel"},
]

people.sort(by("last","first"));

console.log(people);