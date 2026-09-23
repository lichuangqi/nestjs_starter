// 如果你预计将来可能需要替换数据访问技术，或者你希望保持业务逻辑与数据访问技术的松耦合，使用两个层次的抽象（UserAdapter 和 UserAbstractRepository）可能是更好的选择
// 在软件开发中，特定的数据库操作如复杂查询、数据维护任务和触发器管理，通常在数据库层实现而不在接口层暴露，以提高应用的封装性、安全性和性能。这种做法有助于减少系统各部分之间的耦合，确保数据的一致性和完整性，同时也简化了外部接口的设计。通过这种方式，可以有效地保护敏感逻辑并优化事务管理和数据处理。
export abstract class UserAbstractRepository {
  abstract find(): Promise<any[]>;
  abstract create(userObj: any): Promise<any>;
  abstract update(userObj: any): Promise<any>;
  abstract delete(id: string): Promise<any>;
}
