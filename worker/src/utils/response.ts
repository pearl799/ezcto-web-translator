import { CORS_HEADERS } from './cors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonValue = any;

// 统一 JSON 响应格式（自动加 CORS）
export function jsonResponse(data: JsonValue, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

// 错误响应
export function errorResponse(message: string, status = 500, details?: unknown): Response {
  return jsonResponse(
    {
      error: true,
      message,
      ...(details ? { details } : {}),
    },
    status,
  );
}

// 从路径推断 Content-Type
export function getContentType(path: string): string {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.md')) return 'text/markdown; charset=utf-8';
  if (path.endsWith('.json')) return 'application/json; charset=utf-8';
  if (path.endsWith('.txt')) return 'text/plain; charset=utf-8';
  if (path.endsWith('.css')) return 'text/css; charset=utf-8';
  if (path.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.ico')) return 'image/x-icon';
  if (path.endsWith('.woff2')) return 'font/woff2';
  if (path.endsWith('.woff')) return 'font/woff';
  return 'application/octet-stream';
}

// 生成网站响应专用 Headers（AI 爬虫友好标记）
export const SITE_HEADERS: Record<string, string> = {
  'Content-Signal': 'ai-train=allow, search=allow, ai-input=allow',
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=3600',
  'X-Robots-Tag': 'index, follow',
};
