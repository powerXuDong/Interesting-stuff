# 个人文档

> 代理访问 OpenAi / ChatGPT 时不走规则只能全局模式的问题

OpenAi 网站使用 ChatGPT 时候必须要用全局，否则就不走代理，添加了路由和域名规则都没有用

这是因为 OpenAi 的网站启用了 http3，基于 quic，走的是 udp 协议而非 tcp。

最简单的解决办法就是关闭浏览器的 http3。这样的话就都会降级到 http2 走 tcp，让你设置的代理路由规则生效。

用Chrome打开 chrome://flags/#enable-quic，选择Disabled。
Edge的话地址是 edge://flags/#enable-quic

关闭后浏览器会重启，重启后把OpenAi几个域名加入你的代理规则就可以啦
sentry.io
pay.openai.com
identrust.com
openaiapi-site.azureedge.net
challenges.cloudflare.com
auth0.openai.com
platform.openai.com
