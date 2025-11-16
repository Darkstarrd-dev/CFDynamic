/**
 * 这是一个安全的后端 Function。
 * * v3 更新：
 * - 将模型从 'mistralai/mistral-7b-instruct:free' 更换为 'google/gemma-7b-it:free'，
 * 因为 Mistral 免费版似乎会返回 '<s>' 或空字符串。
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
            // *** 关键修复：更换模型 ***
            // Mistral 的免费模型似乎会返回 '<s>' 或空回复
            // 我们换成 Google 的 Gemma 免费模型，它通常更稳定
            model: "google/gemma-3-12b-it:free",
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
                // 确保你已经将这里换成了你的真实域名
                'HTTP-Referer': 'https://cfdynamic.pages.dev',
                'X-Title': 'My Cloudflare AI Chat',
            },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('OpenRouter API Error:', errorText);
            throw new Error(`OpenRouter API 错误: ${apiResponse.status} ${errorText}`);
        }

        // 6. 解析 OpenRouter 的响应
        const responseData = await apiResponse.json();

        // 7. 增强的错误处理
        if (!responseData.choices || !responseData.choices.length > 0 || !responseData.choices[0].message) {
            console.error('OpenRouter 响应格式错误:', responseData);
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
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
