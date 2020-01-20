function Subject(a = 1,b = 2) {
    this._listeners = [];
    this.a = a;
    this.b = b;
}

Subject.prototype.notify = function() {
    this._listeners.forEach(l => {
        l.update();
    })
}

Subject.prototype.set = function(key,value) {
    if (!key) return;
    if (Object.keys(this).indexOf(key) > 0) {
        if (this[key] !== value) {
            this.key = value;
            this.notify();
        }
    }
}


function Listener(subject) {
    this.subject = subject;
    this.subject._listeners.push(this);
    Object.keys(this.subject).forEach((key) => {
        this[key] = this.subject[key];
    })
}

Listener.prototype.update = function() {
    console.log("我知道变化了");
}

let sub = new Subject();

let Listener1 = new Listener(sub);
let Listener2 = new Listener(sub);
let Listener3 = new Listener(sub);
let Listener4 = new Listener(sub);
let Listener5 = new Listener(sub);
let Listener6 = new Listener(sub);
let Listener7 = new Listener(sub);

sub.set("a",2); // 这里如果把2换成1就没有通知了

