import { Injectable } from '@nestjs/common';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

@Injectable()
export class ProxyService {
  createProxy(target: string, pathRewrite: { [key: string]: string }) {
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite,
      // Cast options to 'any' type to resolve TypeScript error
      onProxyReq: (proxyReq: any, req: any, res: any) => {
        console.log(`Proxying request to: ${target}`);
      },
    } as any); // Type assertion to 'any' type
  }
}
