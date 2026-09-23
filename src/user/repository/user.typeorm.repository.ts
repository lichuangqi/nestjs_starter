import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UserAdapter } from '../user.interface';
import { TYPEORM_DATABASE } from '@/database/databse.constants';

export class UserTypeormRepository implements UserAdapter {
  constructor(
    @InjectRepository(User, TYPEORM_DATABASE)
    private userRepository: Repository<User>,
  ) {}
  find(): Promise<any[]> {
    return this.userRepository.find({});
  }
  create(userObj: any): Promise<any> {
    return this.userRepository.save(userObj);
  }
  update(userObj: any): Promise<any> {
    return this.userRepository.update({ id: userObj.id }, userObj);
  }
  delete(id: string): Promise<any> {
    return this.userRepository.delete(id);
  }
}
