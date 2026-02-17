// Cloudflare Worker 环境绑定类型
export interface Env {
  // 环境变量
  BACKEND_URL: string;
  CUSTOM_DOMAIN: string;

  // R2 Bucket：存储用户生成的网站文件
  R2_BUCKET: R2Bucket;

  // KV：子域名 slug 元数据
  SLUG_KV: KVNamespace;
}

// tRPC 响应解包后的格式
export interface TrpcResult<T = unknown> {
  result?: {
    data?: {
      json?: T;
    };
  };
  error?: {
    message: string;
    code?: number;
  };
}

// 翻译查询响应
export interface TranslateLookupResult {
  found: boolean;
  data?: {
    url: string;
    domain: string;
    siteType: string;
    structuredData: unknown;
    verificationStatus: string;
    source: string;
  };
}

// 贡献请求体
export interface ContributeBody {
  url: string;
  html_hash: string;
  structured_data: unknown;
  contributor_id?: string;
}

// 服务端翻译请求体
export interface ServerTranslateBody {
  url: string;
  api_key: string;
  force_refresh?: boolean;
}

// 强制刷新请求体
export interface RefreshBody {
  url: string;
  api_key: string;
}
