// wrapper for async functions where actions can be yield-ed
const asyncFn = generator => {
    const iter = generator();
    const handleNext = val => {
        const res = iter.next(val);
        console.log(res);
        if(res.done)
            return res.value;
        else
            return Promise.resolve(res.value).then(handleNext);
    }
    handleNext();
}
// any async action (e.g. fetch())
const asyncAction = val => Promise.resolve(val);
// generator function
// you may treat these yield-s like await-s
function* incrementer() {
    let nextVal = yield asyncAction(1);
    console.log(nextVal);
    nextVal = yield asyncAction(++nextVal);
    console.log(nextVal);
    
    nextVal = yield asyncAction(++nextVal);
    console.log(nextVal);
    nextVal = yield ++nextVal;
    console.log(nextVal);
}
// consider it like `async incrementer() {...}`
asyncFn(incrementer);

// 2个要点
// 1,generator的yiled能够控制代码在这里停住
// 2,next(参数),能够反向赋值到yield语句的返回值