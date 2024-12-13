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
  private readonly productRepository: Repository<Product>;
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const { name } = createProductDto;
    const product = await this.productRepository.findOne({
      where: { name },
    });
    if (product) {
      throw new HttpException('El producto ya existe', HttpStatus.BAD_REQUEST);
    }
    try {
      const newProduct = this.productRepository.create(createProductDto);
      const uploadedPhotos =
        await this.cloudinaryService.uploadProductPhotos(files);
      newProduct.images = uploadedPhotos;
      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(relations?: FindOptionsRelations<Product>, query?: string) {
    console.log(query);
    const products = await this.productRepository.find({
      relations: relations,
    });
    if(query){
      return products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    }
    return products;
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async findByName(name: string) {
    const product = await this.productRepository.findOne({
      where: { name },
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
    }

    if (files) {
      const uploadedPhotos = await this.cloudinaryService.uploadProductPhotos(files);
      product.images.push(...uploadedPhotos);
    }
    return await this.productRepository.save({
      ...product,
      ...updateProductDto,
    });
  }
}
