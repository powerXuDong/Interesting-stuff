# 动效词云图

## 创建类
``` ts
class CustomWordCloud {
  // 配置信息
  static defaultConfig = {
    radius: 100,
    direction: 135, // 滚动方向
    initSpeed: 'normal', // 初始速率
    speedCoefficient: 'normal', // 速率系数
    containerClass: 'tagcloud',
    itemClass: 'tagcloud-item'
  };

  // 获取速率系数
  static getSpeedCoefficient = (name) => {
    const speedCoefficientMap = {
      slow: 0.5,
      normal: 1,
      fast: 2,
    };

    return speedCoefficientMap[name] || 1;
  };

  // 获取初始速率
  static getInitSpeed = (name) => {
    const initSpeedMap = {
      slow: 16,
      normal: 32,
      fast: 80,
    };

    return initSpeedMap[name] || 32;
  };

  constructor(container = document.body, texts = [], options = {}) {
    if (!container || container.nodeType !== 1) {
      return new Error('Incorrect element type')
    };

    const { defaultConfig, getSpeedCoefficient, getInitSpeed } = CustomWordCloud;

    this.$container = container;
    this.texts = texts;
    this.config = { ...defaultConfig, ...options };

    const { radius, speedCoefficient, initSpeed, direction } = this.config;

    this.radius = radius;
    this.depth = 1.5 * radius;
    this.size = 1.5 * radius;
    this.direction = direction;
    this.initSpeed = getInitSpeed(initSpeed);
    this.speedCoefficient = getSpeedCoefficient(speedCoefficient);

    this.createElment();
    this.init();
  };

  createElment() {
    const { containerClass, radius } = this.config;

    // 外部容器
    const $el = document.createElement('div');
    $el.className = containerClass;

    $el.style.position = 'relative';
    $el.style.width = `${2 * radius}px`;
    $el.style.height = `${2 * radius}px`;

    this.$el = $el;

    this.items = [];
    this.texts.forEach((text, index) => {
      const item = this.createTextItem(text, index);

      $el.appendChild(item.el);
      this.items.push(item);
    });
    this.$container.appendChild($el);
  };

  createTextItem(text, index) {
    const { itemClass } = this.config;

    const itemEl = document.createElement('span');
    itemEl.className = itemClass;
    itemEl.style.fontFamily = 'SourceHanSansCN-Regular';

    itemEl.style.position = 'absolute';
    itemEl.style.top = '50%';
    itemEl.style.left = '50%';
    itemEl.style.opacity = 0;
    itemEl.style.zIndex = index + 1;
    itemEl.style.transformOrigin = '50% 50%';
    itemEl.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';

    itemEl.style.willChange = 'transform, opacity';

    itemEl.innerText = text;

    return {
      el: itemEl,
      name: text,
      ...this.computePosition(index),
    };
  };

  computePosition(index) {
    const textsLength = this.texts.length;

    /**
     * PI 为圆周率 => 3.1415926
     * Math.acos(x) 返回反余弦(返回值在0 - PI 之间)，x => (-1, 1) 开区间, 所以 Math.acos(x) => (0, PI)开区间
    */
    const phi = Math.acos(-1 + (2 * index + 1) / textsLength);
    const theta = Math.sqrt((textsLength + 1) * Math.PI) * phi;

    return {
      x: (this.size * Math.cos(theta) * Math.sin(phi)) / 2,
      y: (this.size * Math.sin(theta) * Math.sin(phi)) / 2,
      z: (this.size * Math.cos(phi)) / 2,
    };
  };

  init() {
    /**
     * this.direction * (Math.PI / 180) 表示角度
    */
    const deg = this.direction * (Math.PI / 180);

    this.initSpeedX = this.initSpeed * Math.sin(deg);
    this.initSpeedY = this.initSpeed * Math.cos(deg);

    this.next();
  };

  next() {
    const speedX = (this.initSpeedX / this.radius) * this.speedCoefficient;
    const speedY = (this.initSpeedY / this.radius) * this.speedCoefficient;

    if (Math.abs(speedX) <= 0.01 && Math.abs(speedY) <= 0.01) {
      return;
    }

    const degUnit = Math.PI / 180;
    const sc = [
      Math.sin(speedX * degUnit),
      Math.cos(speedX * degUnit),
      Math.sin(speedY * degUnit),
      Math.cos(speedY * degUnit)
    ];

    this.items.forEach(item => {
      const initX = item.x;
      const initY = item.y * sc[1] + item.z * (-sc[0]);
      const initZ = item.y * sc[0] + item.z * sc[1];

      const currentX = initX * sc[3] + initZ * sc[2];
      const currentY = initY;
      const currentZ = initZ * sc[3] - initX * sc[2];

      const per = (2 * this.depth) / (2 * this.depth + currentZ);

      item.x = currentX;
      item.y = currentY;
      item.z = currentZ;
      item.scale = per.toFixed(3);
      let alpha = per * per - 0.25;
      alpha = (alpha > 1 ? 1 : alpha).toFixed(3);

      const itemEl = item.el;
      const left = (item.x - itemEl.offsetWidth / 2).toFixed(2);
      const top = (item.y - itemEl.offsetHeight / 2).toFixed(2);
      const transform = `translate3d(${left}px, ${top}px, 0) scale(${item.scale})`;

      itemEl.style.opacity = alpha;
      itemEl.style.transform = transform;
    });

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.next.bind(this));
    };
  };
}

export const creatCustomWordCloud = (elStr, texts, options) => {
  if (elStr) {
    const elDom = document.getElementById(elStr);

    if (elDom) {
      return new CustomWordCloud(elDom, texts, options);
    }
  };
  
  throw new Error('invalid element');
};
```

## 实例化
``` ts
const container = 'tagcloudWrap';
const texts = [
  'VR游场馆', '亚运数字世界', 'AR导航',
  '美食通', '慢直播', '游亚运',
  '城市体验',
];
const options = {
	radius: '200'
};

try {
  creatCustomWordCloud(container, texts, options);
} catch(e) {
  console.log(e);
}
```

## DOM 结构
``` xml
<div id='tagcloudWrap'></div>

#tagcloudWrap {
  background-color: #000;
  border-radius: 10px;
  color: #FFF;
  font-size: 20px;
}
```
