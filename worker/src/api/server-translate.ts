import type { Env, ServerTranslateBody } from '../types';
import { trpcMutation } from '../utils/trpc';
import { jsonResponse, errorResponse } from '../utils/response';

/**
 * POST /v1/translate-server
 *
 * 服务端翻译（付费，需要 API Key）
 * 后端负责实际的 HTML 抓取 + LLM 翻译 + 存储
 */
export async function handleServerTranslate(request: Request, env: Env): Promise<Response> {
  let body: ServerTranslateBody;
  try {
    body = await request.json() as ServerTranslateBody;
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  // 必填字段验证
  if (!body.url || typeof body.url !== 'string') {
    return errorResponse('Missing required field: url', 400);
  }
  if (!body.api_key || typeof body.api_key !== 'string') {
    return errorResponse('Missing required field: api_key', 400);
  }

  // URL 格式验证
  try {
    new URL(body.url);
  } catch {
    return errorResponse('Invalid URL format', 400);
  }

  // API Key 基本格式检查（Worker 层不做完整鉴权，由后端负责）
  if (body.api_key.length < 16) {
    return errorResponse('Invalid api_key format', 401);
  }

  console.log(`[server-translate] url=${body.url} force_refresh=${body.force_refresh ?? false}`);

  const { data, error } = await trpcMutation(
    env.BACKEND_URL,
    'translate.serverTranslate',
    {
      url: body.url,
      api_key: body.api_key,
      force_refresh: body.force_refresh ?? false,
    },
  );

  if (error) {
    console.error(`[server-translate] backend error: ${error}`);
    // 401/403 可能是 API Key 无效
    if (error.includes('401') || error.includes('403') || error.toLowerCase().includes('unauthorized')) {
      return errorResponse('Invalid or expired API key', 401);
    }
    if (error.includes('429') || error.toLowerCase().includes('quota')) {
      return errorResponse('API quota exceeded. Please upgrade your plan.', 429);
    }
    return errorResponse(`Translation failed: ${error}`, 502);
  }

  return jsonResponse({ success: true, data }, 200, {
    // 服务端翻译不缓存（每次调用都消耗配额）
    'Cache-Control': 'no-store',
  });
}
