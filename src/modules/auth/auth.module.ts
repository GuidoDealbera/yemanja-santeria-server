import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './Strategy/local.strategy';
import { GoogleStrategy } from './Strategy/google.strategy';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/user.entity';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, LocalStrategy, GoogleStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
