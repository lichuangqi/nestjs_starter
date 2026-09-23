import { Inject } from '@nestjs/common';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from '../../generated/prisma-postgresql/client';
import { UserAdapter } from '../user.interface';

export class UserPrismaRepository implements UserAdapter {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  find(): Promise<any[]> {
    return this.prismaClient.user.findMany({});
  }
  create(userObj: any): Promise<any> {
    return this.prismaClient.user.create({ data: userObj });
  }
  update(userObj: any): Promise<any> {
    return this.prismaClient.user.update({
      where: { id: userObj.id },
      data: userObj,
    });
  }
  delete(id: string): Promise<any> {
    return this.prismaClient.user.delete({ where: { id: Number(id) } });
  }
}
