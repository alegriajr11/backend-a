import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 150 })
  email!: string;

  @Column({ length: 255, select: false })
  password!: string;

  @Column({ name: 'roleId' })
  roleId!: number;

  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: true, nullable: false })
  @JoinColumn({ name: 'roleId' })
  role!: RoleEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
