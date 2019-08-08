const rx_unicode_escapement = /\\ u \{ ( [0-9 A-F]{4,6}) \}/g;
const rx_crlf = /\n | \r\n/;
const rx_token = /( \u0020+ ) | ( # .*) | ([a-z A-Z](?:\u0020 [a-z A-Z] | [0-9 a-z A-Z])*\??) | (-? \d+(?:\.\d+)?(?:e\-?\d+)?) | ("(?:[^"\\] | \\(?: [n r " \\] | u\{[0-9 A-F]{4,6} \}))*") /y

// 这里加/y表示只从第一个字符就开始匹配,因为默认的lastIndex为0
const rx1 = /("(?:[^"\\] | \\(?: [n r " \\] | u\{[0-9 A-F]{4,6} \}))*")/
const rx2 = /(\.(?:\.\.))? | \/\\? | \\\/? | >>? | <<? | \[\]? |\{\}? | [() \] . , : ? ! ; ~ ]/


console.log(rx_unicode_escapement.test("\u{AA0F}"));