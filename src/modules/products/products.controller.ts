import { Controller, Get, Post, Body, Param, Put, HttpException, HttpStatus, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { validate as IsUUID } from 'uuid';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files'))
  @Post('create')
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.productsService.create(createProductDto, files);
  }

  @ApiQuery({name: 'name', required: false})
  @Get()
  async findAll(@Query('name') query?: string) {
    return await this.productsService.findAll({purchases: true}, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!IsUUID(id)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }
    return await this.productsService.findById(id);
  }
  
  @ApiBearerAuth()
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() files?: Express.Multer.File[]) {
    if (!IsUUID(id)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }
    return await this.productsService.update(id, updateProductDto, files);
  }
}
