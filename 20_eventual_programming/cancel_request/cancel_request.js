const http = require("http");

function handle(req,res) {
    if (req.url.indexOf("1") >= 0) {
        const ip = res.socket.remoteAddress;
        const port = res.socket.remotePort;
        res.end(`Your IP address is ${ip} and your source port is ${port}.`);
        app.emit("abort",ip);
    } else if (req.url.indexOf("2") >= 0) {
        console.log(2);
        const ip = res.socket.remoteAddress;
        const port = res.socket.remotePort;
        console.log(`Your IP address is ${ip} and your source port is ${port}.`);
        setTimeout(function(){
            res.end("success");
        },1000*10)
    } else if (req.url.indexOf("3") >= 0) {
        console.log(3);
        const ip = res.socket.remoteAddress;
        const port = res.socket.remotePort;
        console.log(`Your IP address is ${ip} and your source port is ${port}.`);
        setTimeout(function(){
            res.end("success");
        },1000*15)
    } else if (req.url.indexOf("4") >=0) {
        console.log(4);
        const ip = res.socket.remoteAddress;
        const port = res.socket.remotePort;
        console.log(`Your IP address is ${ip} and your source port is ${port}.`);
        setTimeout(function(){
            res.end("success");
        },1000*18)
    }
}

const app = http.createServer(handle);
const resColleciton = {};

app.on("request",function(req,res) {
    const ip = res.socket.remoteAddress;
    const key = ip
    resColleciton[key] = resColleciton[key] || [];
    resColleciton[key].push(res);
    console.log(resColleciton[key].length);
});

app.on("abort",function(key) {
    console.log("abort",key);
    resColleciton[key] = resColleciton[key] || [];
    resColleciton[key].forEach(res => {
        res && res.end("don't need this request any more");
    });
});

app.on("error",function(err) {
    console.log("server 500!")
})

app.listen(9000);