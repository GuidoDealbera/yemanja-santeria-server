import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDecimal, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { ImageDto } from './image.dto';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  description: string;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ type: [ImageDto], description: 'Lista de imágenes del producto' })
  @IsArray()
  @IsNotEmpty()
  images: ImageDto[];
}
