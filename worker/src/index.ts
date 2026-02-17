import type { Env } from './types';
import { handleCors } from './utils/cors';
import { jsonResponse, errorResponse } from './utils/response';
import { handleTranslate } from './api/translate';
import { handleContribute } from './api/contribute';
import { handleServerTranslate } from './api/server-translate';
import { handleRefresh } from './api/refresh';
import { handleSiteRequest } from './content-negotiation/handler';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // --- CORS preflight（所有路径统一处理）---
    if (request.method === 'OPTIONS') {
      return handleCors();
    }

    // --- A. API 网关：api.ezcto.fun ---
    if (hostname === `api.${env.CUSTOM_DOMAIN}` || hostname === 'api.ezcto.fun') {
      return handleApiRequest(request, env, url);
    }

    // --- B. 生成网站 Content Negotiation：{subdomain}.ezcto.fun ---
    const subdomain = extractSubdomain(hostname, env.CUSTOM_DOMAIN);
    if (subdomain) {
      return handleSiteRequest(request, env, subdomain);
    }

    // --- 其他请求 → 404 ---
    return errorResponse('Not Found', 404);
  },
};

// 从 hostname 提取子域名
// e.g. "shiba.ezcto.fun" → "shiba"，"ezcto.fun" → null
function extractSubdomain(hostname: string, domain: string): string | null {
  if (!hostname.endsWith(`.${domain}`)) return null;
  const sub = hostname.slice(0, -(`.${domain}`.length));
  // 过滤保留子域名
  if (!sub || sub === 'www' || sub === 'assets' || sub === 'api' || sub === 'cdn') return null;
  // 子域名只允许 字母、数字、连字符
  if (!/^[a-z0-9-]+$/i.test(sub)) return null;
  return sub;
}

// API 路由分发
async function handleApiRequest(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname, method } = { pathname: url.pathname, method: request.method };

  // GET /v1/translate?url=...
  if (pathname === '/v1/translate' && method === 'GET') {
    return handleTranslate(request, env);
  }

  // POST /v1/contribute
  if (pathname === '/v1/contribute' && method === 'POST') {
    return handleContribute(request, env);
  }

  // POST /v1/translate-server
  if (pathname === '/v1/translate-server' && method === 'POST') {
    return handleServerTranslate(request, env);
  }

  // POST /v1/refresh
  if (pathname === '/v1/refresh' && method === 'POST') {
    return handleRefresh(request, env);
  }

  // GET / — 健康检查 + API 说明
  if (pathname === '/' && method === 'GET') {
    return jsonResponse({
      name: 'EZCTO API Gateway',
      version: '1.0.0',
      status: 'ok',
      endpoints: {
        'GET  /v1/translate?url={URL}': 'Query translation cache (free)',
        'POST /v1/contribute': 'Contribute translation (free)',
        'POST /v1/translate-server': 'Server-side translation (paid, api_key required)',
        'POST /v1/refresh': 'Force refresh translation (paid, 3x quota)',
      },
      docs: 'https://ezcto.fun/api-docs',
    });
  }

  // 405 Method Not Allowed
  if (
    (pathname === '/v1/translate' && method !== 'GET') ||
    (['/v1/contribute', '/v1/translate-server', '/v1/refresh'].includes(pathname) && method !== 'POST')
  ) {
    return errorResponse(`Method ${method} not allowed for ${pathname}`, 405);
  }

  return errorResponse(`Unknown endpoint: ${method} ${pathname}`, 404);
}
