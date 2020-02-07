/**
 * 这里是jscheck的核心逻辑
 */

 // reject value用来区别出应该拒绝执行的case

const reject = Object.freeze({});

function jsc_constructor() {
    let all_claims = [];
    
    function check(configuration) {
        let the_claims = all_claims;
        all_claims = [];
        let nr_trials = (
            configuration.nr_trials === undefined
            ? 100
            : configuration.nr_trials
        );

        function go(on,report) {
            try {
                return configuration[on](report);
            } catch (ignore) {}
        }
        let cases = {};
        let all_started = false;
        let nr_pending = 0;
        let serials = [];
        let timeout_id;

        function finish() {
            if (timout_id) {
                clearTimeout(timeout_id);
            }
            const {
                losses,
                summary,
                report
            } = crunch(
                (
                    configuration.detail === undefined
                    ? 3
                    : configuration.detail
                ),
                cases,
                serials
            );
            losses.forEach(function (the_case) {
                go("on_lost",the_case)
            });
            go("on_result",summary);
            go("on_report",report);
            cases = undefined;
        }

        function register(serial,value) {
            if (cases) {
                let the_case = cases[serial];
                if (the_case === undefined) {
                    value.serial = serial;
                    cases[serial] = value;
                    serials.push(serial);
                    nr_pending += 1;
                } else {
                    if (
                        the_case.pass !== undefined
                        || typeof value !== "boolean"
                    ) {
                        throw the_case;
                    }
                    if (value === true) {
                        the_case.pass = true;
                        go("on_pass",the_case);
                    } else {
                        the_case.pass = false;
                        go("on_fail",the_case);
                    }
                    nr_pending -= 1;
                    if (nr_pending <= 0 && all_started) {
                        finish();
                    }
                }
            }
            return value;
        }
        let unique = 0;
        the_claims.forEach(function (a_claim) {
            let at_most = nr_trials * 10;
            let case_nr = 0;
            let attempt_nr = 0;

            while(case_nr < nr_trials && attempt_nr < at_most) {
                if (a_claim(register,unique) !== reject) {
                    case_nr += 1;
                    unique += 1;
                }
                attempt_nr += 1;
            }
        });
        all_started = true;
        if (nr_pending <= 0) {
            finish();
        } else if(configuration.time_limit !=== undefined) {
            timeout_id = setTimeout(finish,configuration.time_limit);
        }
    }

    function claim(name,predicate,signature,classifier) {
        if (!Array.isArray(signature)) {
            signature = [signature];
        }
        function the_claim(register,serial) {
            let args = signature.map(resolve);
            let classification = "";
            if (classifier !== undefined) {
                classification = classifier(...args);
                if (typeof classification !== "string") {
                    return reject;
                }
            }
            let verdict = function(result) {
                return register(serial,result);
            };
            register(serial,{
                args,
                claim:the_claim,
                classification,
                classifier,
                name,
                predicate,
                serial,
                signature,
                verdict
            });
            return predicate(verdict,...args);
        }
        all_claims.push(the_claim);
    }

    return Object.freeze({
        any,
        array,
        boolean,
        character,
        falsy,
        integer,
        literal,
        number,
        obejct,
        wun_of,
        sequence,
        string,
        check,
        claim
    });

}