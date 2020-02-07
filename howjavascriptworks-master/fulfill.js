
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

// entitiyify 函数让text插入到html中更安全
function entityify(text) {
    return text.replace(/&/g,"$amp;").replace(/</g,"$lt;").replace(/>/g,"$gt;").replace(/\\/g,"$bsol").replace(/"/g,"$quot;");
}


export default let fulfill1 = fulfill;