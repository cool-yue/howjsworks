function EventEmitter(obj) {
    this._events = {};
};

EventEmitter.prototype.on = function(type,listener) {
    let that = this;
    !this._events.type && (this._events.type = []);
    this._events.type.push(listener)
    return function() {
        let listenerIndex = that._events.type.indexOf(listener);
        that._events.type.splice(listenerIndex,1)
    }
}

EventEmitter.prototype.emit = function(type,...args) {
    if (!type) return;
    this._events.type && this._events.type.forEach(function(fn) {
        fn.apply(this,args);
    });
}

let a1 = new EventEmitter();
let a1Cancel1 = a1.on("event1",function() {
    console.log("event1 handler1");
});

let a1Cancel2 = a1.on("event1",function() {
    console.log("event1 handler2");
});

a1.emit("event1");
a1Cancel1();
a1.emit("event1")