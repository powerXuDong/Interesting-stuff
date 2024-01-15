# 资源、接口的性能上报

## 创建类

``` ts
import { v4 as uuid } from 'uuid';

type PerformanceQueType = {
  name: string;
  type: string;
  resourceTimes: Record<string, number | string>;
  value: any;
  valid: boolean;
};

type ScenarioApiType = {
  key: string;
  url: string;
};

const filterStr = (initStr: string, str: string) => {
  const replaceReg = `/[${str} | /testKey]/g`;
  return initStr.replaceAll(replaceReg, '');
};

class performanceMonitor {
  private static instance: performanceMonitor | null;

  requestApis: ScenarioApiType[];
  performanceInterfaceQue: PerformanceQueType[];
  performanceFontQue: PerformanceQueType[];

  constructor() {
    // 接口列表
    this.requestApis = [];

    this.performanceInterfaceQue = [];
    this.performanceFontQue = [];
  }

  static getInstance() {
    console.log('getPerformanceInstance');
    if (!performanceMonitor.instance) {
      console.log('initPerformanceInstance');
      performanceMonitor.instance = new performanceMonitor();
    }
    return performanceMonitor.instance;
  }

  initPerformance = (callback: (obj: PerformanceQueType) => void) => {
    const observer = new PerformanceObserver((list: any) => {
      for (const entry of list.getEntries()) {
        const { name, initiatorType } = entry;
        const { pathname } = new URL(name);

        // 接口性能
        if (initiatorType === 'xmlhttprequest') {
          const isScenarioApi = this.requestApis.find(
            (obj) =>
              filterStr(obj.url, '.json') === filterStr(pathname, '.json'),
          );

          if (isScenarioApi) {
            this.getResponseTime(entry, (obj) => {
              callback(obj);
            });
          }
        }

        // font性能
        if (initiatorType === 'script' && name.indexOf('font') > -1) {
          this.getFontTime(entry, (obj) => {
            callback(obj);
          });
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  };

  // 消费 performance 队列（因为在api的response中是全量查看请求资源的，所以不能FIFO，需要 valid 来标记）
  customPerformanceQue = (
    que: PerformanceQueType[],
    obj: PerformanceQueType,
  ) => {
    for (let i = 0; i < que.length; i++) {
      const item = que[i];

      if (item.name === obj.name) {
        item.valid = false;
      }
    }
  };

  // 调度 performance 队列
  schedulePerformanceQue = (
    que: PerformanceQueType[],
    callback: (obj: PerformanceQueType) => void,
  ) => {
    requestIdleCallback((deadline) => {
      const validPerformanceQue = que.filter((obj) => obj.valid);

      while (deadline.timeRemaining() > 0) {
        const data = validPerformanceQue.shift();

        if (data) {
          this.customPerformanceQue(que, data);
          callback(data);
        }
      }
      if (!!validPerformanceQue.length) {
        this.schedulePerformanceQue(que, callback);
      }
    });
  };

  getResourceTime = (
    entry: any,
    type: string,
    callback: (obj: PerformanceQueType) => void,
  ) => {
    const {
      name,
      startTime,
      responseEnd,
      domainLookupEnd,
      domainLookupStart,
      connectEnd,
      connectStart,
      secureConnectionStart,
      responseStart,
      requestStart,
      transferSize,
      responseStatus,
    } = entry;

    const { origin, pathname } = new URL(name);

    /** 性能时间 */
    const time = Math.floor(responseEnd - startTime); // 完整耗时

    const dnsLookupTime = Math.floor(domainLookupEnd - domainLookupStart); // DNS 解析耗时
    const initialConnectTime = Math.floor(connectEnd - connectStart); // TCP 连接耗时
    const sslTime = Math.floor(connectEnd - secureConnectionStart); // SSL 安全连接耗时
    const connectTime = Math.floor(requestStart - startTime); // 建联总耗时

    const requestTime = Math.floor(responseStart - requestStart);
    const ttfbTime = requestTime; // 网络请求耗时（前端发起请求到后端返回第一个字节的时间）

    const contentDownloadTime = Math.floor(responseEnd - responseStart); // 数据传输耗时（内容下载时间）

    let resourceName: string = '';

    // 接口标识名
    if (type === 'xhr') {
      const interfaceName = filterStr(
        pathname.split('/').slice(-1)[0],
        '.json',
      );
      resourceName = `${interfaceName}-${startTime}`;
    }

    // 字体文件标识名
    if (type === 'font') {
      resourceName = filterStr(pathname.split('/').slice(-1)[0], '.js');
    }

    const isRepeat = this.performanceInterfaceQue.some(
      (obj: PerformanceQueType) => obj.name === resourceName,
    );

    if (!isRepeat) {
      let request_url: string = '';

      // 接口url
      if (type === 'xhr') {
        request_url = `${origin}${pathname}`;
      }

      // 字体文件url
      if (type === 'font') {
        request_url = name;
      }

      this.performanceInterfaceQue.push({
        name: resourceName,
        type,
        value: entry,
        valid: true,
        resourceTimes: {
          request_url,
          time,
          dnsLookupTime,
          initialConnectTime,
          sslTime,
          connectTime,
          requestTime,
          ttfbTime,
          contentDownloadTime,
          transferSize,
          responseStatus,
          uuid: uuid(),
        },
      });

      this.schedulePerformanceQue(this.performanceInterfaceQue, callback);
    }
  };

  getResponseTime = (
    entry: any,
    callback: (obj: PerformanceQueType) => void,
  ) => {
    this.getResourceTime(entry, 'xhr', callback);
  };

  getFontTime = (entry: any, callback: (obj: PerformanceQueType) => void) => {
    this.getResourceTime(entry, 'font', callback);
  };
}
```
## 使用类

``` ts
const pMonitor = performanceMonitor.getInstance();

pMonitor.initPerformance((obj: PerformanceQueType) => {
  console.log('obj', obj);
});
```
