import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Query, Req, Res, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AddProduct, EditProduct, EditPutProduct } from "./dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { ProductService } from "./products.service";
import { Observable, of } from "rxjs";

import { AdminGuard } from "src/auth/common/guards";

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductService) {

    }
    @Post('addProduct')
    @UseGuards(AdminGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: "./StaticFiles/Images",
            filename: (req, file, callback) => {
                const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${suffix}${ext}`;
                callback(null, filename);
            }
        })
    }))
    addProduct(@Body() productDto: AddProduct, @UploadedFile() image: Express.Multer.File) {
        productDto.price = Number(productDto.price);
        productDto.quantity = Number(productDto.quantity);
        productDto.image = image.filename;
        return this.productService.addProduct(productDto);
    }

    @Get("product-photo/:imagename")
    getPhoto(@Param("imagename") imagename: string, @Res() res): Observable<File> {
        return of(res.sendFile(join(process.cwd(), "StaticFiles/Images/", imagename)))
    }
    @UseGuards(AdminGuard)
    @Put('editProduct')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: "./StaticFiles/Images",
            filename: (req, file, callback) => {
                const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${suffix}${ext}`;
                callback(null, filename);
            }
        })
    }))
    editProduct(@Body() productDto: EditProduct, @UploadedFile() image: Express.Multer.File) {
        productDto.price = Number(productDto.price);
        productDto.quantity = Number(productDto.quantity);
        productDto.image = image.filename;
        return this.productService.editProduct(productDto);
    }
    @UseGuards(AdminGuard)
    @HttpCode(HttpStatus.OK)
    @Delete('deleteProduct/:productId')
    deleteProduct(@Param("productId") productId: number) {
        const result = this.productService.deleteProduct(productId);
        if (!result) throw new HttpException('Product deleted succesfully', HttpStatus.FORBIDDEN);
    }
    @Get("getProductById/:productId")
    getProductById(@Param("productId") productId: number) {
        return this.productService.getProductById(productId);
    }



    @Get("getProducts")
    getProductByPage() {
        return this.productService.getProduct();
    }

    @Get("getProductsbycategory")
    getProductBycategory(@Query("category") category: string) {
        return this.productService.getProductByCategory(category);
    }

    @Get("getProductByNameandCategory")
    getProductByNameandCategory(@Query("category") category: string, @Query("name") name: string) {
        return this.productService.getProductByNameandCategory(category, name);
    }
    @UseGuards(AdminGuard)
    @Patch('editProductItem')
    async editProductItem(@Body() productDto: EditPutProduct) {
        const product = await this.getProductById(productDto.id);
        if (!product) throw new BadRequestException(" product does not exist");
        productDto.price = productDto.price ? Number(productDto.price) : Number(product.price);
        productDto.quantity = productDto.quantity ? Number(productDto.quantity) : product.quantity;
        productDto.description = productDto.description ? productDto.description : product.description;
        productDto.brand = productDto.brand ? productDto.brand : product.brand;
        productDto.name = productDto.name ? productDto.name : product.name;
        productDto.size = productDto.size ? productDto.size : product.size;
        productDto.image = productDto.image ? productDto.image : product.Photopath;

        return this.productService.editProduct(productDto);
    }

}