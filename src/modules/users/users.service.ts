import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { FindByIdDto } from './dto/findById.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
const selectUserWithoutPassword: FindOptionsSelect<User> = {
  id: true,
  googleId: true,
  email: true,
  isActive: true,
  isAdmin: true,
  name: true,
  phone: true,
  orders: true,
  profilePhoto: true,
  address: true,
  password: false,
  id_photo: true,
};
@Injectable()
export class UsersService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  async registerUser(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    const { email, googleId, password } = createUserDto;
    let user = await this.findByEmail(email);
    if (user) {
      throw new HttpException(
        'El correo ya se encuentra registrado',
        HttpStatus.FORBIDDEN,
      );
    }
    const isAdmin: boolean = (await this.userRepository.count()) === 0;
    user = this.userRepository.create({
      ...createUserDto,
      isAdmin,
      password: googleId ? undefined : await hash(password, 10),
    });
    let savedUser = await this.userRepository.save(user);
    if (file) savedUser = await this.updateProfilePhoto(savedUser.id, file);

    delete savedUser.password;
    return savedUser;
  }

  async findAll(relations?: FindOptionsRelations<User>) {
    const users = await this.userRepository.find({
      relations: relations,
      select: selectUserWithoutPassword,
    });
    const allUsers = users.filter(user => !user.isAdmin)
    return allUsers;
  }

  async findById(id: FindByIdDto['id']) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      select: selectUserWithoutPassword,
      relations: ['products'],
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async inactiveUser(id: FindByIdDto['id']) {
    const user = await this.findById(id);
    if (!user)
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    user.isActive = false;
    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async updateUser(id: FindByIdDto['id'], updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user)
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    return await this.userRepository.save({ ...user, ...updateUserDto });
  }

  async updateProfilePhoto(id: FindByIdDto['id'], file: Express.Multer.File) {
    const user = await this.findById(id);
    if (!user)
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    if (user.id_photo) await this.cloudinaryService.deletePhoto(user.id_photo);
    const result = await this.cloudinaryService.uploadProfilePhoto(file);
    user.profilePhoto = result.url;
    user.id_photo = result.id;
    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }
}
