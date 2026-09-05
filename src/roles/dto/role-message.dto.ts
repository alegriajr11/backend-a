import { RoleEntity } from '../entities/role.entity';

export class RoleMessageDto {
  id!: number;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(role: RoleEntity) {
    this.id = role.id;
    this.name = role.name;
    this.createdAt = role.createdAt;
    this.updatedAt = role.updatedAt;
  }
}
