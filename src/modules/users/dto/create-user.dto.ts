import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(2, 60)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'La contraseña no es obligatoria para usuarios autenticados con Google',
  })
  @IsString()
  @Length(8, 100, {
    message: "La contraseña debe tener al menos 8 caracteres",
  })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'El ID de Google, requerido para usuarios autenticados con Google',
  })
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del usuario, debe ser único si se proporciona',
  })
  @IsString()
  @Matches(/^\+?[0-9]{10,20}$/, {
    message: "El número de teléfono debe ser válido (puede incluir un '+' inicial)",
  })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Foto de perfil del usuario',
  })
  @IsString()
  @IsOptional()
  profilePhoto?: string;
}