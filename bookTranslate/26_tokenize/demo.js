let tokenizeGenerator = tokenize(
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
    }`);

function repeat(tokenizeGenerator) {
    let res = tokenizeGenerator();
    if (res !== undefined) {
        console.log(JSON.stringify(res,null,4));
        return repeat(tokenizeGenerator);
    }
}

// token列表

{
    "id": "def reduce reverse",
    "alphameric": true,
    "line_nr": 0,
    "column_nr": 0,
    "column_to": 18
}
{
    "id": ":",
    "line_nr": 0,
    "column_nr": 18,
    "column_to": 19
}
{
    "id": "ƒ",
    "line_nr": 0,
    "column_nr": 20,
    "column_to": 21
}

{
    "id": "array",
    "alphameric": true,
    "line_nr": 0,
    "column_nr": 22,
    "column_to": 27
}

{
    "id": ",",
    "line_nr": 0,
    "column_nr": 27,
    "column_to": 28
}

{
    "id": "callback function",
    "alphameric": true,
    "line_nr": 0,
    "column_nr": 29,
    "column_to": 46
}

{
    "id": ",",
    "line_nr": 0,
    "column_nr": 46,
    "column_to": 47
}

{
    "id": "initial value",
    "alphameric": true,
    "line_nr": 0,
    "column_nr": 47,
    "column_to": 60
}

{
    "id": "{",
    "line_nr": 0,
    "column_nr": 61,
    "column_to": 62
}

{
    "id": "var element nr",
    "alphameric": true,
    "line_nr": 1,
    "column_nr": 4,
    "column_to": 18
}

{
    "id": ":",
    "line_nr": 1,
    "column_nr": 18,
    "column_to": 19
}

{
    "id": "length",
    "alphameric": true,
    "line_nr": 1,
    "column_nr": 19,
    "column_to": 25
}

{
    "id": "(",
    "line_nr": 1,
    "column_nr": 25,
    "column_to": 26
}

{
    "id": "array",
    "alphameric": true,
    "line_nr": 1,
    "column_nr": 26,
    "column_to": 31
}

{
    "id": ")",
    "line_nr": 1,
    "column_nr": 31,
    "column_to": 32
}

{
    "id": "var reduction",
    "alphameric": true,
    "line_nr": 2,
    "column_nr": 4,
    "column_to": 17
}

{
    "id": ":",
    "line_nr": 2,
    "column_nr": 17,
    "column_to": 18
}

{
    "id": "initial value",
    "alphameric": true,
    "line_nr": 2,
    "column_nr": 18,
    "column_to": 31
}

{
    "id": "if reduction",
    "alphameric": true,
    "line_nr": 3,
    "column_nr": 4,
    "column_to": 16
}
{
    "id": "=",
    "line_nr": 3,
    "column_nr": 17,
    "column_to": 18
}

{
    "id": "null",
    "alphameric": true,
    "line_nr": 3,
    "column_nr": 19,
    "column_to": 23
}

{
    "id": "let element nr",
    "alphameric": true,
    "line_nr": 4,
    "column_nr": 8,
    "column_to": 22
}

{
    "id": ":",
    "line_nr": 4,
    "column_nr": 22,
    "column_to": 23
}
{
    "id": "element nr",
    "alphameric": true,
    "line_nr": 4,
    "column_nr": 23,
    "column_to": 33
}
{
    "id": "-",
    "line_nr": 4,
    "column_nr": 34,
    "column_to": 35
}

{
    "id": "(number)",
    "readonly": true,
    "number": {
        "coefficient": [
            "+",
            1
        ],
        "exponent": 0
    },
    "text": "1",
    "line_nr": 4,
    "column_nr": 36,
    "column_to": 37
}

{
    "id": "let reduction",
    "alphameric": true,
    "line_nr": 5,
    "column_nr": 8,
    "column_to": 21
}

{
    "id": ":",
    "line_nr": 5,
    "column_nr": 21,
    "column_to": 22
}

{
    "id": "array",
    "alphameric": true,
    "line_nr": 5,
    "column_nr": 22,
    "column_to": 27
}

{
    "id": "[",
    "line_nr": 5,
    "column_nr": 27,
    "column_to": 28
}

{
    "id": "element nr",
    "alphameric": true,
    "line_nr": 5,
    "column_nr": 28,
    "column_to": 38
}

{
    "id": "]",
    "line_nr": 5,
    "column_nr": 38,
    "column_to": 39
}

{
    "id": "def exit",
    "alphameric": true,
    "line_nr": 6,
    "column_nr": 4,
    "column_to": 12
}

{
    "id": ":",
    "line_nr": 6,
    "column_nr": 12,
    "column_to": 13
}

{
    "id": "ƒ",
    "line_nr": 6,
    "column_nr": 13,
    "column_to": 14
}

{
    "id": "final value",
    "alphameric": true,
    "line_nr": 6,
    "column_nr": 15,
    "column_to": 26
}

{
    "id": "{",
    "line_nr": 6,
    "column_nr": 27,
    "column_to": 28
}

{
    "id": "let element nr",
    "alphameric": true,
    "line_nr": 7,
    "column_nr": 8,
    "column_to": 22
}

{
    "id": ":",
    "line_nr": 7,
    "column_nr": 22,
    "column_to": 23
}

{
    "id": "(number)",
    "readonly": true,
    "number": {
        "coefficient": [
            "+"
        ],
        "exponent": 0
    },
    "text": "0",
    "line_nr": 7,
    "column_nr": 23,
    "column_to": 24
}

{
    "id": "return final value",
    "alphameric": true,
    "line_nr": 8,
    "column_nr": 8,
    "column_to": 26
}

{
    "id": "}",
    "line_nr": 9,
    "column_nr": 4,
    "column_to": 5
}

{
    "id": "loop",
    "alphameric": true,
    "line_nr": 10,
    "column_nr": 4,
    "column_to": 8
}

{
    "id": "let element nr",
    "alphameric": true,
    "line_nr": 11,
    "column_nr": 8,
    "column_to": 22
}

{
    "id": ":",
    "line_nr": 11,
    "column_nr": 22,
    "column_to": 23
}

{
    "id": "element nr",
    "alphameric": true,
    "line_nr": 11,
    "column_nr": 23,
    "column_to": 33
}

{
    "id": "-",
    "line_nr": 11,
    "column_nr": 34,
    "column_to": 35
}
{
    "id": "(number)",
    "readonly": true,
    "number": {
        "coefficient": [
            "+",
            1
        ],
        "exponent": 0
    },
    "text": "1",
    "line_nr": 11,
    "column_nr": 36,
    "column_to": 37
}
{
    "id": "if element nr",
    "alphameric": true,
    "line_nr": 12,
    "column_nr": 8,
    "column_to": 21
}
{
    "id": "<",
    "line_nr": 12,
    "column_nr": 22,
    "column_to": 23
}
{
    "id": "(number)",
    "readonly": true,
    "number": {
        "coefficient": [
            "+"
        ],
        "exponent": 0
    },
    "text": "0",
    "line_nr": 12,
    "column_nr": 24,
    "column_to": 25
}
{
    "id": "break",
    "alphameric": true,
    "line_nr": 13,
    "column_nr": 12,
    "column_to": 17
}
{
    "id": "let reduction",
    "alphameric": true,
    "line_nr": 14,
    "column_nr": 8,
    "column_to": 21
}
{
    "id": ":",
    "line_nr": 14,
    "column_nr": 21,
    "column_to": 22
}
{
    "id": "callback function",
    "alphameric": true,
    "line_nr": 14,
    "column_nr": 23,
    "column_to": 40
}
{
    "id": "(",
    "line_nr": 14,
    "column_nr": 40,
    "column_to": 41
}
{
    "id": "reduction",
    "alphameric": true,
    "line_nr": 15,
    "column_nr": 12,
    "column_to": 21
}
{
    "id": "array",
    "alphameric": true,
    "line_nr": 16,
    "column_nr": 12,
    "column_to": 17
}
{
    "id": "[",
    "line_nr": 16,
    "column_nr": 17,
    "column_to": 18
}
{
    "id": "element nr",
    "alphameric": true,
    "line_nr": 16,
    "column_nr": 18,
    "column_to": 28
}
{
    "id": "]",
    "line_nr": 16,
    "column_nr": 28,
    "column_to": 29
}
{
    "id": "element nr",
    "alphameric": true,
    "line_nr": 17,
    "column_nr": 12,
    "column_to": 22
}
{
    "id": "exit",
    "alphameric": true,
    "line_nr": 18,
    "column_nr": 12,
    "column_to": 16
}
{
    "id": ")",
    "line_nr": 19,
    "column_nr": 8,
    "column_to": 9
}
{
    "id": "return reduction",
    "alphameric": true,
    "line_nr": 20,
    "column_nr": 4,
    "column_to": 20
}
{
    "id": "}",
    "line_nr": 21,
    "column_nr": 0,
    "column_to": 1
}
