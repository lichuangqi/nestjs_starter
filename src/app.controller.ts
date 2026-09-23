import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import { type Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private cacheManger: Cache) {}

  @Get()
  @Version('2')
  async getHellov2(@Query('token') token?: string): Promise<any> {
    const res = await this.cacheManger.get('token');
    await this.cacheManger.set('token', token || 'default token');
    return { token: res };
  }

  @Post(':id')
  @Version('1')
  async postHello(
    @Query('page') page: string,
    @Param('id') id: string,
    @Body() body: any,
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<any> {
    console.log('🚀 ~ AppController ~ postHello ~ page:', page);
    return { page, id, body, tenantId };
  }
}
