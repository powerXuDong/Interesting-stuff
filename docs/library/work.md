# 工作文档

> 工作中的问题及解决都会记录到这里

## 竞态请求

工作中难免遇到切换TAB取消之前请求的情况，我们来介绍一下竞态请求的实现

> 竞态请求的关键是 AbortController 的单例模式

## 单例模式的实现

```js
class ReuqestAbort {
  private static instance: ReuqestAbort | null;
  private abort: AbortController;

  constructor() {
    this.abort = new AbortController();
  }

  static getInstance(): ReuqestAbort {
    if (!ReuqestAbort.instance) {
      ReuqestAbort.instance = new ReuqestAbort();
    }
    return ReuqestAbort.instance;
  }

  getAbort(): AbortController {
    return this.abort;
  }

  clearAbort() {
    ReuqestAbort.instance = null;
  }
}
```

> request 拦截器中要设置 signal

## 设置 signal

```js
const request = <T>(url: string, options: RequestOptionsInit) => {
  return Request<T>(url, {
    credentials: 'include',
    signal: ReuqestAbort.getInstance().getAbort().signal,
    ...options,
  });
};
```

> 在对使用当前 signal 的请求取消后，需要重置当前 AbortController 的实例，否则后续的请求都是 cancel

## 重置 AbortController

```js
ReuqestAbort.getInstance().getAbort().abort();

ReuqestAbort.getInstance().clearAbort();
```

**3.我要在线上用**

[《AbortController对象》](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)
