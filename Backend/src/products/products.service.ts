import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddProduct, EditProduct } from "./dto";

@Injectable()
export class ProductService {
    constructor(private prismaService: PrismaService) { }

    async addProduct(newProduct: AddProduct) {
        newProduct.name = newProduct.name.toLowerCase() 
        try {
            const product = await this.prismaService.product.create({
                data: {
                    name: newProduct.name,
                    description: newProduct.description,
                    brand: newProduct.brand,
                    Photopath: newProduct.image,
                    price: newProduct.price,
                    quantity: newProduct.quantity,
                    size: newProduct.size,
                    
                }
            });
        } catch (error) {
            throw new ForbiddenException(error.message);
        }

    }

    async editProduct(updatedProduct: EditProduct) {
        try {
            const prevProduct = await this.prismaService.product.findFirst({
                where: {
                    id: Number(updatedProduct.id)
                }
            })

            if (!prevProduct) throw new ForbiddenException("The product with that id doesnot exist");
            prevProduct.brand = updatedProduct.brand && prevProduct.brand
            const product = await this.prismaService.product.update({
                where: {
                    id: Number(updatedProduct.id)
                }, data: {
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                    description: updatedProduct.description,
                    quantity: updatedProduct.quantity,
                    size: updatedProduct.size,
                    Photopath: updatedProduct.image
                }
            });
            return product;
        } catch (error) {
            throw new ForbiddenException("Could not update the product");
        }
    }

    async deleteProduct(productId: number) {
        try {
            const result = await this.prismaService.product.delete({
                where: {
                    id: Number(productId)
                }
            });
            return result;
        } catch (error) {
            return
        }

    }

    async getProduct() {
        try {
            const products = await this.prismaService.product.findMany({
                where: {
                    id: {
                        not: 0
                    }
                }
            })

            return products
        } catch (error) {
            throw new ForbiddenException("No product to show");
        }
    }

    async getProductByCategory(category: string) {
        try {
            const products = await this.prismaService.product.findMany({
                where: {
                    Category:{
                        equals: category
                    }
                }
            })

            return products
        } catch (error) {
            console.log(error)
            throw new ForbiddenException("No product to show");
        }
    }

    async getProductByNameandCategory(category: string, nname:string) {
        try {
            console.log(nname)
            const products = await this.prismaService.product.findMany({
                where: {
                    Category: {
                        equals: category
                    } , name:{
                        contains: nname
                    }
                }
            })

            return products
        } catch (error) {
            console.log(error)
            throw new ForbiddenException("No product to show");
        }
    }


    async getProductById(productId: number) {

        try {
            const product = await this.prismaService.product.findFirst({
                where: {
                    id: Number(productId)
                }
            })

            return product;
        } catch (error) {

            throw new ForbiddenException("error");
        }
    }


}