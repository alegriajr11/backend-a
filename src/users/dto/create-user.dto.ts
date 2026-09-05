import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100)
  name: string = '';

  @IsEmail()
  @MaxLength(150)
  email: string = '';

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(255)
  password: string = '';

  @IsInt({ message: 'El rol es obligatorio' })
  @IsPositive({ message: 'El rol debe ser un id válido' })
  roleId: number = 0;
}
