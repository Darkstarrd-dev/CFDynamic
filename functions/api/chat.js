/**
 * 这是一个安全的后端 Function。
 * 它的工作是：
 * 1. 接收前端发来的 prompt。
 * 2. 从 Cloudflare 的安全环境变量中读取 API_KEY。
 * 3. 调用 OpenRouter API。
 * 4. 将结果安全地返回给前端。
 * * 用户的 API Key 永远不会暴露给浏览器。
 */

export async function onRequest(context) {
    // 1. 只接受 POST 请求
    if (context.request.method !== 'POST') {
        return new Response(JSON.stringify({ error: '仅允许 POST 方法' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // 2. 从 Cloudflare 环境变量中安全地获取 API Key
        //    *** 你必须在 Cloudflare 仪表盘中设置这个变量 ***
        const OPENROUTER_API_KEY = context.env.OPENROUTER_API_KEY;

        if (!OPENROUTER_API_KEY) {
            throw new Error("服务器未配置 API Key");
        }

        // 3. 解析前端发来的 JSON 数据
        const requestData = await context.request.json();
        const userPrompt = requestData.prompt;

        if (!userPrompt) {
            throw new Error("未收到 prompt");
        }

        // 4. 准备调用 OpenRouter API
        const API_URL = "https://openrouter.ai/api/v1/chat/completions";

        // 注意：你可以替换成 OpenRouter 上的任何其他模型
        // Mistral 7B Free 是一个很好的、免费且快速的选择
        const payload = {
            model: "mistralai/mistral-7b-instruct:free",
            messages: [
                { role: "user", content: userPrompt }
            ]
        };

        // 5. 发起 `fetch` 请求到 OpenRouter
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                // OpenRouter 推荐的 HTTP 头
                'HTTP-Referer': 'http://localhost:3000', // 替换成你的网站域名
                'X-Title': 'My AI Chat App', // 替换成你的项目名称
            },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            // 如果 OpenRouter 返回错误，将其传递给前端
            const errorText = await apiResponse.text();
            console.error('OpenRouter API Error:', errorText);
            throw new Error(`OpenRouter API 错误: ${apiResponse.status} ${errorText}`);
        }

        // 6. 解析 OpenRouter 的响应
        const responseData = await apiResponse.json();
        const aiReply = responseData.choices[0].message.content;

        // 7. 将干净的回复返回给前端
        return new Response(JSON.stringify({ reply: aiReply }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Function Error:', error.message);
        // 返回一个通用的错误消息
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
