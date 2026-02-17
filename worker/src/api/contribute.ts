import type { Env, ContributeBody } from '../types';
import { trpcMutation } from '../utils/trpc';
import { jsonResponse, errorResponse } from '../utils/response';

/**
 * POST /v1/contribute
 *
 * 贡献翻译结果到资产库（免费，众包模式）
 * 贡献后所有用户均可免费查询
 */
export async function handleContribute(request: Request, env: Env): Promise<Response> {
  // 解析请求体
  let body: ContributeBody;
  try {
    body = await request.json() as ContributeBody;
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  // 必填字段验证
  if (!body.url || typeof body.url !== 'string') {
    return errorResponse('Missing required field: url', 400);
  }
  if (!body.html_hash || typeof body.html_hash !== 'string') {
    return errorResponse('Missing required field: html_hash', 400);
  }
  if (!body.structured_data || typeof body.structured_data !== 'object') {
    return errorResponse('Missing required field: structured_data', 400);
  }

  // URL 格式验证
  try {
    new URL(body.url);
  } catch {
    return errorResponse('Invalid URL format', 400);
  }

  // html_hash 格式验证（64 位十六进制 = SHA256）
  if (!/^[a-f0-9]{64}$/i.test(body.html_hash)) {
    return errorResponse('Invalid html_hash format. Expected 64-char hex string (SHA256)', 400);
  }

  // 防止 structured_data 体积过大（最大 1MB）
  const dataSize = JSON.stringify(body.structured_data).length;
  if (dataSize > 1_000_000) {
    return errorResponse('structured_data too large (max 1MB)', 413);
  }

  console.log(`[contribute] url=${body.url} contributor=${body.contributor_id ?? 'anonymous'}`);

  const { data, error } = await trpcMutation(
    env.BACKEND_URL,
    'translate.contribute',
    {
      url: body.url,
      html_hash: body.html_hash,
      structured_data: body.structured_data,
      contributor_id: body.contributor_id ?? 'anonymous',
    },
  );

  if (error) {
    console.error(`[contribute] backend error: ${error}`);
    return errorResponse(`Failed to contribute translation: ${error}`, 502);
  }

  return jsonResponse(
    {
      success: true,
      message: 'Translation contributed successfully. Thank you for contributing!',
      ...(data ? { result: data } : {}),
    },
    201,
  );
}
