import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsDecimal({decimal_digits: '2'})
  @IsNotEmpty()
  price: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @Min(0)
  stock: number;
}
