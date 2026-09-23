import { InjectModel } from '@nestjs/mongoose';
// import { UserAbstractRepository } from '../user-abstract.repository';
import { Model } from 'mongoose';
import { User } from '../user.schema';
import { UserAdapter } from '../user.interface';

export class UserMongooseRepository implements UserAdapter {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  find(): Promise<any[]> {
    return this.userModel.find();
  }
  create(userObj: any): Promise<any> {
    return this.userModel.create(userObj);
  }
  update(userObj: any): Promise<any> {
    return this.userModel.updateOne({ _id: userObj._id }, userObj);
  }
  delete(id: string): Promise<any> {
    return this.userModel.deleteOne({ _id: id });
  }
}
