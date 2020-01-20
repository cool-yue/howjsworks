## 发布订阅 ##
发布订阅的核心思路就是,一个`发布者`，收集多个`订阅者`也可以称呼为`观察者`也可以叫`监听者`也可以叫`句柄`等等`（subscriber,watcher,listener,handler）`，`发布者`这里有一份这些`订阅者`共同关心的`状态`(state,也可以简单理解为数据),在初始化的时候，`发布者`需要收集这些`订阅者`，如果方便每个`订阅者`也有一个`发布者`的引用，这样就能够访问`发布者`的所有信息。现在当一个事件（比如修改某个数据之后或者html中event触发的时候）发生后，`发布者`有一个`notify`的方法，订阅者有一个`update`的方法，`notify`方法去找到每个订阅者然后去执行需要它们的`update`。

## 那些用到了发布订阅模型 ##
vue框架的`状态响应式更新`,vue框架的自定义`event`,html的`addEventListener`,node的`eventEmitter`，这些常见的例子全部使用了这个模型。但是它们有略微的区别。

## vue框架的状态响应式更新 ##
vue的data里面的每一个字段数据，都相当于生成了一个发布者对象,这个发布者对象通过`defineProperty("字段数据",{})`这个api中定义`get`过程来收集需要这个属性的对象也就是订阅者,`set`方法来给这个属性赋值的同时,通知（notify）这些订阅者去更新（update）订阅者状态。vue由于体量过于大，因此这个中间的观察者，订阅者全部是都是较为复杂的对象实体。

## 其他几种模式几乎类似 ##
其他的几种模式,如果简单实现,从头到尾就是一个对象,listener就是方法，不需要去调用listener的update，而是直接调用listener。比如一个dom就是一个eventTarget，需要写出3个方法,addEventListener,removeEventLister,dispatch,3个方法。

首先eventTarget有一个属性`listener`,它是一个对象,它的属性是事件名称,值为数组,收集这些listener函数。

这3个方法简单来说就是，addEventListener在eventTarget中的`listeners`属性中加listener函数。

removeEventLister通过拿到listener函数的引用，来去`listeners`属性中删除。

dispatch就是传入事件名称来触发。注意在dom中的触发时间，是需要生成一个Event对象,然后这个Event对象要能够匹配当前的事件才能够触发（这是dom的机制），如果仅仅用代码来实现，其实就是通过这个事件名称去找到`listener`属性中对应的方法数组，然后逐个调用就行。

##代码##
见`.js`文件