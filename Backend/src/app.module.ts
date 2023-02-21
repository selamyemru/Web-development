import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { PhotosModule } from './photos/photos.module';
import { OrdersModule } from './orders/orders.module';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard } from './auth/common/guards';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    MulterModule.register({dest:"../StaticFiles/Images"}),
    ProductsModule, 
    PrismaModule, 
    AuthModule, 
    PhotosModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
