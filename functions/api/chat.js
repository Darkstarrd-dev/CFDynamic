/**
 * 这是一个安全的后端 Function。
 * 它的工作是：
 * 1. 接收前端发来的 prompt。
 * 2. 从 Cloudflare 的安全环境变量中读取 API_KEY。
 * 3. 调用 OpenRouter API。
 * 4. 将结果安全地返回给前端。
 * * v2 更新：
 * - 增加了对 OpenRouter 成功响应 (HTTP 200) 但内容为空的检查。
 * - 提示用户必须修改 Referer 和 X-Title。
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

                // *** 关键修复 ***
                // 你必须把下面这两行改成你自己的信息
                // 1. 替换成你部署后的 Cloudflare Pages 域名 (例如: https://my-chat-app.pages.dev)
                'HTTP-Referer': 'https://cfdynamic.pages.dev',
                // 2. 替换成你自己的项目名 (可选，但推荐)
                'X-Title': 'cfdynamic',
            },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            // 如果 OpenRouter 返回 HTTP 错误 (4xx, 5xx)
            const errorText = await apiResponse.text();
            console.error('OpenRouter API Error:', errorText);
            throw new Error(`OpenRouter API 错误: ${apiResponse.status} ${errorText}`);
        }

        // 6. 解析 OpenRouter 的响应
        const responseData = await apiResponse.json();

        // 7. *** 关键修复 (增强的错误处理) ***
        // 检查即使是 200 OK，响应中是否真的包含我们期望的数据
        if (!responseData.choices || !responseData.choices.length > 0 || !responseData.choices[0].message) {
            console.error('OpenRouter 响应格式错误:', responseData);
            // 可能是因为 Referer 错误，OpenRouter 返回了 200 OK 但内容是 { "error": "..." }
            if (responseData.error) {
                 throw new Error(`OpenRouter 返回了错误: ${responseData.error.message || JSON.stringify(responseData.error)}`);
            }
            throw new Error('OpenRouter 返回了无效的响应 (未包含 choices)');
        }

        const aiReply = responseData.choices[0].message.content;

        // 8. 将干净的回复返回给前端
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
