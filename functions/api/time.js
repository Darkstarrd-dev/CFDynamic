/**
 * 这是一个 Cloudflare Function。
 * 当 /api/time 路由被请求时，此函数会被执行。
 */
export async function onRequest(context) {

    // 1. 准备要返回的数据
    // 这是一个动态数据，它在服务器（边缘节点）上生成
    const data = {
        message: "你好，来自 Cloudflare 的边缘函数！",
        timestamp: new Date().toISOString()
    };

    // 2. 将数据序列化为 JSON 字符串
    const jsonResponse = JSON.stringify(data);

    // 3. 设置响应头，告诉浏览器我们返回的是 JSON
    const headers = {
        'Content-Type': 'application/json;charset=UTF-8'
    };

    // 4. 返回一个 Response 对象
    return new Response(jsonResponse, { headers: headers });
}
