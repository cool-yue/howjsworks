function EventTarget() {
    this._listeners = {};
}

EventTarget.prototype.addEventListener(eventName,listener) {
    if (!this._listeners.eventName) {
        this._listeners.eventName = [];
    }
    this._listeners.eventName.push(listener);
}


EventTarget.prototype.removeEventListener(eventName) {
    let index = this._listeners.eventName.indexOf(listener);
    if (index >= 0) {
        this._listeners.eventName.splice(listener);
    }
}

EventTarget.prototype.dispatch = function(type) {
    let dispatchListeners = this._listeners[type];
    dispatchListeners && dispatchListeners.forEach((l) => {
        l();
    })
}