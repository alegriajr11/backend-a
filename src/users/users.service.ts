import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMessageDto } from './dto/user-message.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserMessageDto> {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const role = await this.findRoleById(createUserDto.roleId);
    const user = this.usersRepository.create({
      ...createUserDto,
      role,
    });

    const savedUser = await this.usersRepository.save(user);
    return new UserMessageDto(savedUser);
  }

  async findAll(): Promise<UserMessageDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => new UserMessageDto(user));
  }

  async findOne(id: number): Promise<UserMessageDto> {
    return new UserMessageDto(await this.findEntity(id));
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserMessageDto> {
    const user = await this.findEntity(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
    }

    if (updateUserDto.roleId) {
      user.role = await this.findRoleById(updateUserDto.roleId);
      user.roleId = updateUserDto.roleId;
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(user);
    return new UserMessageDto(savedUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
  }

  private async findRoleById(id: number): Promise<RoleEntity> {
    const role = await this.rolesRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }

    return role;
  }

  private async findEntity(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }
}
