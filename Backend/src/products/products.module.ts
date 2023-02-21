import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
    controllers:[ProductsController],
    providers: [ProductService],
    imports:[PrismaModule],
    exports: []
})
export class ProductsModule {}
