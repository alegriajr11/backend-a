import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleMessageDto } from './dto/role-message.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleMessageDto> {
    const existingRole = await this.rolesRepository.findOneBy({
      name: createRoleDto.name,
    });

    if (existingRole) {
      throw new ConflictException('El rol ya existe');
    }

    const role = this.rolesRepository.create(createRoleDto);
    const savedRole = await this.rolesRepository.save(role);

    return new RoleMessageDto(savedRole);
  }

  async findAll(): Promise<RoleMessageDto[]> {
    const roles = await this.rolesRepository.find();

    return roles.map((role) => new RoleMessageDto(role));
  }

  async findOne(id: number): Promise<RoleMessageDto> {
    return new RoleMessageDto(await this.findEntity(id));
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleMessageDto> {
    const role = await this.findEntity(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.rolesRepository.findOneBy({
        name: updateRoleDto.name,
      });

      if (existingRole) {
        throw new ConflictException('El rol ya existe');
      }
    }

    Object.assign(role, updateRoleDto);
    const updatedRole = await this.rolesRepository.save(role);

    return new RoleMessageDto(updatedRole);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rolesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
  }

  private async findEntity(id: number): Promise<RoleEntity> {
    const role = await this.rolesRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }

    return role;
  }
}
