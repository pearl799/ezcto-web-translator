import type { TrpcResult } from '../types';

/**
 * tRPC 代理工具
 *
 * tRPC 响应格式（单端点）：
 *   { result: { data: { json: <actual_data> } } }
 *
 * tRPC 响应格式（batch）：
 *   [{ result: { data: { json: <actual_data> } } }]
 *
 * Worker 需要解包后返回干净的 JSON 给客户端
 */

// 解包 tRPC 响应数据
function unwrapTrpc<T>(raw: unknown): T | null {
  if (!raw || typeof raw !== 'object') return null;

  // batch 格式：数组
  if (Array.isArray(raw)) {
    const first = raw[0] as TrpcResult<T>;
    return first?.result?.data?.json ?? null;
  }

  // 单端点格式：对象
  const single = raw as TrpcResult<T>;
  return single?.result?.data?.json ?? null;
}

// tRPC Query（GET 请求 → 查询操作）
export async function trpcQuery<T>(
  backendUrl: string,
  procedure: string,
  input: unknown,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const encodedInput = encodeURIComponent(JSON.stringify({ json: input }));
    const url = `${backendUrl}/api/trpc/${procedure}?input=${encodedInput}`;

    const resp = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'ezcto-worker',
      },
      // 10 秒超时
      signal: AbortSignal.timeout(10_000),
    });

    if (!resp.ok) {
      return { data: null, error: `Backend ${resp.status}: ${resp.statusText}` };
    }

    const raw = await resp.json();
    const data = unwrapTrpc<T>(raw);
    return { data, error: null };
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { data: null, error: 'Backend request timed out after 10s' };
    }
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// tRPC Mutation（POST 请求 → 写操作）
export async function trpcMutation<T>(
  backendUrl: string,
  procedure: string,
  input: unknown,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const resp = await fetch(`${backendUrl}/api/trpc/${procedure}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'ezcto-worker',
      },
      body: JSON.stringify({ json: input }),
      signal: AbortSignal.timeout(30_000), // mutation 给更长超时
    });

    if (!resp.ok) {
      return { data: null, error: `Backend ${resp.status}: ${resp.statusText}` };
    }

    const raw = await resp.json();
    const data = unwrapTrpc<T>(raw);
    return { data, error: null };
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { data: null, error: 'Backend request timed out after 30s' };
    }
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
