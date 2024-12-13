import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no válido');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decode = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findByEmail(decode.email);
      if (!user || !user.isAdmin) {
        throw new UnauthorizedException('No autorizado');
      }

      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Token no válido o expirado');
    }
  }
}
