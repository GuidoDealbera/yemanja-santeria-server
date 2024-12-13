import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import GlobalConfig from './database/global-config.entity';
import { ConfigModule } from '@nestjs/config';
import { DataBaseConfigModule } from './Config/DataBase/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { IsAdminMiddleware } from './middlewares/isAdmin.middleware';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { AuthMiddleware } from './middlewares/isLogged.middleware';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GlobalConfig]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DataBaseConfigModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    CloudinaryModule,
    PurchasesModule,
    OrdersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsAdminMiddleware).forRoutes(
      {
        path: 'products/create',
        method: RequestMethod.POST,
      },
      {
        path: 'products/:id',
        method: RequestMethod.PUT,
      },
      {
        path: 'users',
        method: RequestMethod.GET,
      },
      {
        path: 'users/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'users/inactive/:id',
        method: RequestMethod.PUT,
      },
    );
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'users/update/:id',
      method: RequestMethod.PUT,
    });
  }
}
