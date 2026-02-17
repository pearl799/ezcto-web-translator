import type { Env, TranslateLookupResult } from '../types';
import { trpcQuery } from '../utils/trpc';
import { jsonResponse, errorResponse } from '../utils/response';

/**
 * GET /v1/translate?url={URL}
 *
 * 查询翻译资产库缓存（免费，无限次）
 * 若命中则返回结构化 JSON；未命中则返回 { found: false }
 */
export async function handleTranslate(request: Request, env: Env): Promise<Response> {
  const reqUrl = new URL(request.url);
  const targetUrl = reqUrl.searchParams.get('url');

  // 参数验证
  if (!targetUrl) {
    return errorResponse('Missing required parameter: url', 400);
  }

  // 基本 URL 格式验证
  try {
    new URL(targetUrl);
  } catch {
    return errorResponse('Invalid URL format', 400);
  }

  console.log(`[translate] lookup: ${targetUrl}`);

  const { data, error } = await trpcQuery<TranslateLookupResult>(
    env.BACKEND_URL,
    'translate.lookup',
    { url: targetUrl },
  );

  if (error) {
    console.error(`[translate] backend error: ${error}`);
    // 后端不可用时，返回 miss 而非 500（降级策略）
    return jsonResponse(
      {
        found: false,
        message: 'Translation service temporarily unavailable. Please try again later.',
        _error: error, // 调试用，生产可以去掉
      },
      503,
    );
  }

  if (!data) {
    return jsonResponse({ found: false });
  }

  // 命中缓存，加适当的缓存 header（CDN 可以缓存热门 URL）
  return jsonResponse(data, 200, {
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    'X-Cache': 'HIT',
  });
}
