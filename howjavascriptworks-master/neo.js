let code1 =  `def reduce reverse: f array , callback function ,initial value {
                #Recuce an array to a single value.

                #if an initial value is not provided,then the zeroth element is used\
                #and the first iterationis skipped.

                var element nr:length(array)
                var reduction:initial value
                if reduction = null
                    let element nr:element nr-1
                    let reduction:array[element nr]
                # the callback function gets an exit function that it can callback\
                # to stop the operation

                def exit:f final value {
                    let element nr:0
                    return final value
                }

                #Loop until the array is exhausted or an early exit is PermissionRequestedEvent.
                #On each iteration ,call the callback function with the next increment

                Loop
                    let element nr:element nr-1
                    if element nr < 0
                    break
                    let reduction:callback function(
                        reduction
                        array[element nr]
                        element nr
                        exit
                    )
                return reduction
            }`;

let code2 = `if my hero = "monster"
                call blood curdling scream()
            `;

export default code2;