import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Put,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate as IsUUID } from 'uuid';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from 'src/database/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('register')
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.usersService.registerUser(createUserDto, file);
  }
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return await this.usersService.findAll({ orders: true });
  }
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!IsUUID(id)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }
    return await this.usersService.findById(id);
  }
  @ApiBearerAuth()
  @Put('inactivate/:id')
  async inactiveUser(@Param('id') id: string) {
    if (!IsUUID(id)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }
    return await this.usersService.inactiveUser(id);
  }

  @ApiBearerAuth()
  @Put('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!IsUUID(id)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }
    if (req.user.id !== id) {
      throw new UnauthorizedException('No autorizado');
    }
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put('profile-photo/:id')
  async updateProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    if (!IsUUID(id)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }
    return await this.usersService.updateProfilePhoto(id, file);
  }
}
