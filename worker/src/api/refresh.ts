import type { Env, RefreshBody } from '../types';
import { trpcMutation } from '../utils/trpc';
import { jsonResponse, errorResponse } from '../utils/response';

/**
 * POST /v1/refresh
 *
 * 强制刷新翻译缓存（付费，需要 API Key，消耗 3x 配额）
 * 当网站更新后，用来强制重新翻译并替换缓存
 */
export async function handleRefresh(request: Request, env: Env): Promise<Response> {
  let body: RefreshBody;
  try {
    body = await request.json() as RefreshBody;
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  if (!body.url || typeof body.url !== 'string') {
    return errorResponse('Missing required field: url', 400);
  }
  if (!body.api_key || typeof body.api_key !== 'string') {
    return errorResponse('Missing required field: api_key', 400);
  }

  try {
    new URL(body.url);
  } catch {
    return errorResponse('Invalid URL format', 400);
  }

  if (body.api_key.length < 16) {
    return errorResponse('Invalid api_key format', 401);
  }

  console.log(`[refresh] url=${body.url}`);

  // refresh = force_refresh=true 的 serverTranslate
  const { data, error } = await trpcMutation(
    env.BACKEND_URL,
    'translate.serverTranslate',
    {
      url: body.url,
      api_key: body.api_key,
      force_refresh: true,
    },
  );

  if (error) {
    console.error(`[refresh] backend error: ${error}`);
    if (error.includes('401') || error.includes('403') || error.toLowerCase().includes('unauthorized')) {
      return errorResponse('Invalid or expired API key', 401);
    }
    if (error.includes('429') || error.toLowerCase().includes('quota')) {
      return errorResponse('API quota exceeded. Refresh costs 3x quota.', 429);
    }
    return errorResponse(`Refresh failed: ${error}`, 502);
  }

  return jsonResponse(
    {
      success: true,
      message: 'Translation refreshed successfully (3x quota consumed)',
      data,
    },
    200,
    { 'Cache-Control': 'no-store' },
  );
}
