import { Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './Guards/local-auth.guard';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Request, Response } from 'express';
import { User } from 'src/database/user.entity';
import { GoogleAuthGuard } from './Guards/google-auth.guard';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
const { FRONTEND_URL } = process.env;

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @ApiBody({
    type: AuthLoginDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request & { user: User }) {
    try {
      const user = req.user;
      const accessToken = await this.authService.generateToken(user);
      const { password, ...result } = user;
      return {
        accessToken,
        ...result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleLoginCallback(@Req() req: Request & { user: User }) {
    try {
      const user = req.user;
      let existingUser = await this.userService.findByEmail(user.email);
      if (!existingUser) {
        existingUser = await this.userService.registerUser({
          email: user.email,
          googleId: user.googleId,
          name: user.name,
          profilePhoto: user.profilePhoto,
        });
      }
      const accessToken = await this.authService.generateToken(existingUser);
      const { password, ...result } = existingUser;
      // TODO: Redirect to frontend
      // return res.redirect(`${FRONTEND_URL}/auth/google/callback?accessToken=${accessToken}`);
      return {
        accessToken,
        ...result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: Request) {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
