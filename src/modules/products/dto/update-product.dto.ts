import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ImageDto } from './image.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({ required: false, type: String, description: 'Nombre del producto' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;
  
    @ApiProperty({ required: false, type: Number, description: 'Precio del producto' })
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    price?: string;
  
    @ApiProperty({ required: false, type: Number, description: 'Stock disponible del producto' })
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    stock?: number;
  
    @ApiProperty({ required: false, type: String, description: 'Descripción del producto' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;
  
    @ApiProperty({
      required: false,
      type: [ImageDto],
      description: 'Lista de imágenes del producto',
      default: [],
    })
    @IsOptional()
    @IsArray()
    @IsNotEmpty({ each: true })
    images?: ImageDto[];
  }
