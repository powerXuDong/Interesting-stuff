# 箭头函数在vue、react中的区别

在使用react和vue的时候发现一个问题：vue告诉我们在方法、生命周期函数中不能用箭头函数表示，在react类组件或者函数组件中却需要我们使用箭头函数。

问其原因，大部分人认为这是理所当然的规定，但当我们把这个问题剖开，会发现this的指向性问题在箭头函数中的应用。

在这里我们会讨论到关于this指向、作用域链和原型的问题。

## this 指向丢失的问题

### React 中 this 的丢失

``` jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

class Demo extends React.Component {
  state = {
    someState:'state'
  }
  
  arrowFunMethod = () => {
    console.log('THIS in arrow function:',this)
    this.setState({
      someState:'arrow state'
    })
  }
  
  ordinaryFunMethod() {
    console.log('THIS oridinary function:',this)
    this.setState({
      someState:'ordinary state'
    })
  }
  
  render(){
    return (
      <div>
        <h2>{this.state.someState}</h2>
        <button onClick={this.arrowFunMethod}>call arrow function</button>
        <button onClick={this.ordinaryFunMethod}>call ordinary function</button>
      </div>
    )}
}

createRoot(document.getElementById('root')).render(<Demo />)
```

这个React组件内定义了两个函数，一个用箭头函数函数实现，一个用普通函数。在调用的时候打印其中的this，结果如下：

![React 打印结果](images/arrowFunction-1.png)

可以发现，箭头函数中正确指向了组件实例，而普通函数却指向了undefined，为什么呢？

其实这个和React特性无关，剥离React带来的心智负担，上面的代码不过是一个类，简化一下，就是这样的：

``` jsx
class ReactDemo {
  arrowFunMethod = () => {
    console.log('THIS in arrow function:', this)
  }

  ordinaryFunMethod() {
    console.log('THIS in oridinary function:', this)
  }
}

const reactIns = new ReactDemo();

const arrowFunWithoutCaller = reactIns.arrowFunMethod;
const ordinaryFunWithoutCaller = reactIns.ordinaryFunMethod;

arrowFunWithoutCaller();
ordinaryFunWithoutCaller();
```

运行一下这个类的代码会发现是一样的，箭头函数会指向这个类，普通函数指向 undefined。

![React 箭头函数解析](images/arrowFunction-2.png)

#### 首先从React运行的角度解释一下

在 React 事件触发的时候，回调函数执行。在 React 中回调函数不是由组件实例直接调用执行的：reactIns.arrowFunMethod()，而是做了一层代理，最后真正调用的是：arrowFunWithoutCaller()。这时候就会出现 this 指向的问题了。

但为什么箭头函数的 this 可以指向正确的实例，普通函数却指向 undefined 呢？首先回顾一个知识点：class 是一个语法糖，本质上不过是一个构造函数，上面的代码用最原始的方式写出来：

``` jsx
'use strict'
function ReactDemo() {
  this.arrowFunMethod = () => {
    console.log('THIS in arrow function:', this);
  }
}

ReactDemo.prototype.ordinaryFunMethod = function ordinaryFunMethod() {
  console.log('THIS in oridinary function:', this);
}

const reactIns = new ReactDemo()
```

可以看到，普通函数式挂载在原型链上的，而箭头函数是直接赋给了实例，是实例的一个属性，并且是在构造函数作用域的时候定义的，我们都知道箭头函数是没有自己的this的，用的时候只能根据作用域链去寻找最近的那个。放在这里也就是组件实例。

**这也就是为什么在React中需要箭头函数才能使this指向正确的组件实例。**

### Vue 中 this 的丢失

把上面的组件用vue来写一遍（vue2 的写法）

``` jsx
import { createApp } from "vue";

const Demo = createApp({
  data() {
    return {
      someState:'state'
    }
  },
  
  methods:{
    arrowFunMethod: () => {
      console.log('THIS in arrow function:',this);
      this.someState = 'arrow state'
    },
    
    ordinaryFunMethod() {
      console.log('THIS in oridinary function:',this);
      this.someState = 'ordinary state'
    }
  },
  
  template: `
    <div>
    	<h2>{{this.someState}}</h2>
     	<button @click='this.arrowFunMethod'>call arrow function</button>
      <button @click='this.ordinaryFunMethod'>call ordinary function</button>
    </div>
  `
});

Demo.mount('#root')
```

运行一下，会发现结果对调了：普通函数 this 指向组件实例，箭头函数 this 指向 undefined。

这部分解释起来会涉及一些 Vue 的源码。主要的操作是 vue 对组件方法对一些处理，最核心的有三处。

``` jsx
function initMethods(vm: Component, methods: Object) {
  for (const key in methods) {
    vm[key] = bind(methods[key], vm)
  }
}
```

vue 会把我们传入的 methods 方法进行一次遍历，在一个个赋到组件实例上面，在这个过程中处理的 this 的绑定

> bind(methods[key], vm)：把每个方法都绑定在了组件实例中

普通函数都有自己的 this，所以处理后 this 都能指向正确的组件实例；但箭头函数没有自己的 this，没有办法修改，只能通过父级作用域去寻找this。这个父级作用域是谁呢，是组件实例吗？**我们知道作用域有两种：全局作用域和函数作用域。**回到我们写 vue 的代码，vue 的组件本身是一个对象（具体一点是一个组件的配置对象，有data, methods， mouted属性等，通过 createApp 来创建一个 vue 组件实例），也就是说我们在一个对象中定义了一个方法，因为对象构不成作用域，所以这些方法都指向的全局作用域，普通函数通过 bind 修改了this指向，那么箭头函数没办法修改所以只能指向全局作用域——window对象。

**上面说了这么多，总结一下：vue 对传入的方法 methods 对象做了处理，在函数被调用前做了 this 指向的绑定，只有拥有 this 的普通函数才能被正确的绑定到组件实例上。而箭头函数则会导致 this 的指向丢失。**

「为什么 react 中用箭头函数，vue 中用普通函数」这是一个挺很有意思的问题，简单来说，这种差异是由于我们写的 react 是一个类，而 vue 是一个对象导致的。

在类中定义只有箭头函数才能根据作用域链找到组件实例；在对象中，只有拥有自身 this 的普通函数才能被修改 this 指向，被 vue 处理后绑定到组件实例。
