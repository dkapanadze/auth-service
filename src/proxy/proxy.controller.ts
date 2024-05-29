import { Controller, Req, Res, All, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}
  @All('/user*')
  handleUserService(@Req() req: Request, @Res() res: Response) {
    const userServiceProxy = this.proxyService.createProxy(
      process.env.USER_SERVICE_URL,
      { '^/': '' },
      //   t
    );
    userServiceProxy(req, res);
  }

  @All('/product/*')
  handleProductService(@Req() req: Request, @Res() res: Response) {
    const productServiceProxy = this.proxyService.createProxy(
      process.env.PRODUCT_SERVICE_URL,
      { '^/product': '' },
    );
    productServiceProxy(req, res);
  }
}
