// Pages Functions TypeScript API Demo
// 访问路径: /api/hello

// 定义环境变量类型（未来可扩展 KV、D1 等绑定）
interface Env {
  // 示例：KV_NAMESPACE: KVNamespace;
  // 示例：DB: D1Database;?
  [key: string]: unknown;
}

// API 响应类型
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// 创建 JSON 响应的辅助函数
function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// GET 请求处理
function handleGet(url: URL): Response {
  const name = url.searchParams.get("name") || "World";

  return jsonResponse({
    success: true,
    message: `Hello, ${name}!`,
    data: {
      greeting: `你好，${name}！`,
      method: "GET",
    },
    timestamp: new Date().toISOString(),
  });
}

// POST 请求处理
async function handlePost(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    return jsonResponse({
      success: true,
      message: "数据接收成功",
      data: {
        received: body,
        method: "POST",
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return jsonResponse(
      {
        success: false,
        error: "无效的 JSON 数据",
        timestamp: new Date().toISOString(),
      },
      400,
    );
  }
}

// Pages Function 入口 - 使用简单类型定义
export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request } = context;
  const url = new URL(request.url);

  switch (request.method) {
    case "GET":
      return handleGet(url);
    case "POST":
      return handlePost(request);
    default:
      return jsonResponse(
        {
          success: false,
          error: "Method Not Allowed",
          timestamp: new Date().toISOString(),
        },
        405,
      );
  }
};
