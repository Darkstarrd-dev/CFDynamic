
// 15. (后端)
//   这是 Cloudflare Function 的文件内容。
//   `onRequestGet` 是一个特殊的函数名，Cloudflare 会在收到 GET 请求时自动执行它。
//   对于 POST, PUT 等，你可以使用 `onRequestPost`, `onRequestPut` 或通用的 `onRequest`。
export function onRequestGet(context) {

    // 16. (后端)
    //   这是 Function 的核心逻辑。我们在这里不进行任何复杂操作。
    //   我们只预设了一句 "Hello world from the function!"
    const responseMessage = "Hello world from the function!";

    // 17. (后端)
    //   我们创建一个新的 Response 对象。
    //   第一个参数是我们要返回的内容（我们的预设信息）。
    //   第二个参数是一个对象，可以设置 `status`（状态码）和 `headers`（HTTP 头）。
    //   设置 'Content-Type': 'text/plain' 是一个好习惯，它告诉浏览器我们返回的是纯文本。
    return new Response(responseMessage, {
        status: 200, // 200 表示 "OK" 成功
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}
