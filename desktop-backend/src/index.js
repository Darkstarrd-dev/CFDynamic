export default {
  async fetch(request, env, ctx) {
    // --- 1. CORS 配置 (给浏览器的通行证) ---
    // 允许任何网站访问 (Access-Control-Allow-Origin: *)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://hachimiapps.pages.dev/",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 如果浏览器只是试探性地问一下 (OPTIONS 请求)，直接放行
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // --- 2. 收集信息 ---
    // Cloudflare 提供的神奇对象 request.cf，里面有地理位置信息
    const country = request.cf?.country || "Unknown";
    const userAgent = request.headers.get("User-Agent") || "Unknown";
    const time = new Date().toISOString();

    // --- 3. 写入数据库 (记账) ---
    try {
      await env.DB.prepare(
        "INSERT INTO Visit_Logs (access_time, country, user_agent) VALUES (?, ?, ?)"
      ).bind(time, country, userAgent).run();

      // --- 4. 查询总数 (查账) ---
      // 这里的 count(*) 会告诉我们表里一共有多少行
      const result = await env.DB.prepare(
        "SELECT COUNT(*) as total FROM Visit_Logs"
      ).first();

      const count = result.total;

      // --- 5. 返回结果给前端 ---
      return Response.json(
        {
          message: "访问记录成功",
          total_visits: count,
          your_info: { country, userAgent } // 顺便把这人是谁也告诉他
        },
        { headers: corsHeaders } // 别忘了带上通行证
      );

    } catch (e) {
      // 如果出错了，也要告诉前端，并带上通行证
      return new Response(e.message, { status: 500, headers: corsHeaders });
    }
  },
};
