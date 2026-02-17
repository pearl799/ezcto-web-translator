import type { Env } from '../types';
import { getContentType, SITE_HEADERS } from '../utils/response';

/**
 * Content Negotiation Handler
 *
 * 处理 {subdomain}.ezcto.fun 的请求
 * 根据 Accept header 从 R2 返回不同格式的内容：
 *   - text/markdown       → {subdomain}/content.md
 *   - application/json    → {subdomain}/schema.json
 *   - 其他（默认浏览器）   → {subdomain}/index.html
 *
 * 特殊路径直接映射：
 *   /llms.txt, /content.md, /schema.json,
 *   /media-manifest.json, /robots.txt
 */

// 特殊路径 → R2 key 后缀的映射
const SPECIAL_PATHS: Record<string, string> = {
  '/llms.txt': 'llms.txt',
  '/content.md': 'content.md',
  '/media-manifest.json': 'media-manifest.json',
  '/schema.json': 'schema.json',
  '/robots.txt': 'robots.txt',
  '/favicon.ico': 'favicon.ico',
};

export async function handleSiteRequest(
  request: Request,
  env: Env,
  subdomain: string,
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const accept = request.headers.get('Accept') ?? '';

  // --- 特殊路径直接映射 ---
  const specialSuffix = SPECIAL_PATHS[pathname];
  if (specialSuffix) {
    return serveR2(env, `${subdomain}/${specialSuffix}`, getContentType(specialSuffix));
  }

  // --- 静态资源路径（图片、CSS、JS 等）直接从 R2 取 ---
  if (pathname !== '/' && pathname !== '') {
    const r2Key = `${subdomain}${pathname}`;
    const obj = await env.R2_BUCKET.get(r2Key);
    if (obj) {
      const contentType = getContentType(pathname);
      return new Response(obj.body, {
        headers: {
          'Content-Type': contentType,
          ...SITE_HEADERS,
        },
      });
    }
    // 静态资源不存在 → 回退到 index.html（SPA fallback）
  }

  // --- Content Negotiation（根路径 + SPA fallback）---
  let r2Key: string;
  let contentType: string;

  if (accept.includes('text/markdown')) {
    r2Key = `${subdomain}/content.md`;
    contentType = 'text/markdown; charset=utf-8';
  } else if (accept.includes('application/json') && !accept.includes('text/html')) {
    // 注意：浏览器的 Accept 通常包含 application/json 和 text/html
    // 只在 Accept 明确不包含 text/html 时才返回 JSON（即 Agent/API 调用）
    r2Key = `${subdomain}/schema.json`;
    contentType = 'application/json; charset=utf-8';
  } else {
    r2Key = `${subdomain}/index.html`;
    contentType = 'text/html; charset=utf-8';
  }

  return serveR2(env, r2Key, contentType);
}

// 从 R2 获取对象并返回
async function serveR2(env: Env, r2Key: string, contentType: string): Promise<Response> {
  const obj = await env.R2_BUCKET.get(r2Key);

  if (!obj) {
    return new Response(
      `Site or resource not found: ${r2Key}`,
      {
        status: 404,
        headers: { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' },
      },
    );
  }

  // 利用 R2 对象的 ETag 支持浏览器缓存验证
  const etag = obj.httpEtag;
  const ifNoneMatch = '';  // request.headers.get('If-None-Match') ?? ''

  if (etag && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, ...SITE_HEADERS },
    });
  }

  const responseHeaders: Record<string, string> = {
    'Content-Type': contentType,
    ...SITE_HEADERS,
  };

  if (etag) {
    responseHeaders['ETag'] = etag;
  }

  // 传递 R2 对象的自定义 metadata（如果后端写入了的话）
  if (obj.customMetadata?.['last-modified']) {
    responseHeaders['Last-Modified'] = obj.customMetadata['last-modified'];
  }

  return new Response(obj.body, { headers: responseHeaders });
}
