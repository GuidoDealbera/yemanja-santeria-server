import { Controller, Get, Post, Body, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindByIdDto } from './dto/findById.dto';
import { validate as IsUUID } from 'uuid';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll({purchases: true});
  }

  @Get(':id')
  findOne(@Param('id') id: FindByIdDto['id']) {
    if (!IsUUID(id)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }
    return this.productsService.findById(id);
  }
  
  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    if (!IsUUID(id)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }
    return this.productsService.update(id, updateProductDto);
  }
}
