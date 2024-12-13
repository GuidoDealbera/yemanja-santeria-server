import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/product.entity';
import { FindOptionsRelations, Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @InjectRepository(Product)
  private readonly productRepository: Repository<Product>
  async create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(relations?: FindOptionsRelations<Product>) {
    const products = await this.productRepository.find({
      relations: relations,
    });
    return products;
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: {id},
      relations: ['users'],
    });
    if(!product){
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async findByName(name: string) {
    const product = await this.productRepository.findOne({
      where: {name},
    });
    if(!product){
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    };
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: {id}
    });
    if(!product){
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    };
    return await this.productRepository.save({...product, ...updateProductDto})
  }

  
}
