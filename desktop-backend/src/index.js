export default {
  async fetch(request, env, ctx) {
    // ⚠️ 请务必替换下面的地址和端口
    // 例如：http://node1.wispbyte.com:9552
    const targetUrl = 'http://217.154.212.66:9552';

    try {
      const startTime = Date.now();

      // 发起请求
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Cloudflare-Worker-Test'
        }
      });

      const duration = Date.now() - startTime;
      const text = await response.text();

      return new Response(`✅ 连接成功！(来自 Cloudflare Worker)\n------------------\n⏱️ 耗时: ${duration}ms\n📩 WispByte 返回内容:\n${text}`, {
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      });

    } catch (e) {
      return new Response(`❌ 连接失败\n------------------\n错误信息: ${e.message}\n\n可能原因：Cloudflare 节点无法连接到该端口。`, {
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      });
    }
  },
};
