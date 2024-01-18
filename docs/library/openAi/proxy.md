# PAC代理问题

> 我们在使用 SSR 或者 v2Ray 代理大部分走的都是订阅模式，在使用的过程中，发现在访问 OpenAi / ChatGPT 时不走代理的 PAC 规则，只有在全局模式才能正常访问 :vomiting_face:

这是因为 OpenAi 的网站启用了 http3，基于 quic，走的是 udp 协议而非 tcp

最简单的解决办法就是关闭浏览器的 http3，这样的话就都会降级到 http2 走 tcp，让你设置的代理路由规则生效

用 Chrome 打开 chrome://flags/#enable-quic，选择 Disabled

Edge的话地址是 edge://flags/#enable-quic

关闭后浏览器会重启，重启后把 OpenAi 几个域名加入你的代理规则就可以啦

```
sentry.io
chat.openai.com
openai.com
pay.openai.com
identrust.com
openaiapi-site.azureedge.net
challenges.cloudflare.com
auth0.openai.com
platform.openai.com
```
