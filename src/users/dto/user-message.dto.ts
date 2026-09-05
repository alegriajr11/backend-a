import { UserEntity } from '../entities/user.entity';

export class UserMessageDto {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: { id: number; name: string } | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.roleId = user.roleId;
    this.role = user.role
      ? {
          id: user.role.id,
          name: user.role.name,
        }
      : null;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
