import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddOrderDto, EditOrderDto } from './dto';
import { AddProduct } from 'src/products/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private readonly prismaService: PrismaService) { }

    async addOrder(newOrder: AddOrderDto) {

        try {
            product : AddProduct
            const product = await this.prismaService.product.findFirst({
                where: {
                    id: Number(newOrder.productId)
                }
            })
            const user = await this.prismaService.user.findFirst({
                where: {
                    id: Number(newOrder.userId)
                }
            })
            if (!user) throw new ForbiddenException("User doesnot exist");
            if (!product) throw new ForbiddenException("Product doesnot exist");
            if (product.quantity < newOrder.quantity) throw new ForbiddenException("Quantity overflow");
            const price = Number(product.price);
            const totalPrice = price * Number(newOrder.quantity);
            const Order = await this.prismaService.order.create({
                
                data: {
                    City: newOrder.city,
                    Country: newOrder.country,
                    Postal: newOrder.postal,
                    Quantity: Number(newOrder.quantity),
                    TotalPrice: totalPrice,
                    userId: Number(newOrder.userId),
                    productId: Number(newOrder.productId),
                }
            });
            return Order;
        } catch (error) {
            throw new ForbiddenException(error.message);
        }

    }

    async editOrder(updatedOrder: EditOrderDto) {
        try {

            const product = await this.prismaService.product.findFirst({
                where: {
                    id: Number(updatedOrder.productId)
                }
            })
            const user = await this.prismaService.user.findFirst({
                where: {
                    id: Number(updatedOrder.userId)
                }
            })
            if (!user) throw new ForbiddenException("User doesnot exist");
            if (!product) throw new ForbiddenException("Product doesnot exist");
            if (product.quantity < updatedOrder.quantity) throw new ForbiddenException("Quantity overflow");
            updatedOrder.totalPrice = updatedOrder.quantity  * Number(product.price);

            const Order = await this.prismaService.order.update({
                where: {
                    id: Number(updatedOrder.id)
                }, data: {
                    City : updatedOrder.city,
                    Country : updatedOrder.country,
                    Postal : updatedOrder.postal,
                    Quantity : updatedOrder.quantity,
                    userId : Number(updatedOrder.userId),
                    productId : Number(updatedOrder.productId),
                    TotalPrice: updatedOrder.totalPrice
                }
            });
            return Order;
        } catch (error) {
            throw new ForbiddenException("Could not update the Order");
        }
    }

    async deleteOrder(OrderId: number) {
        try {
            const result = await this.prismaService.order.delete({
                where: {
                    id: Number(OrderId)
                }
            });
            return result;
        } catch (error) {
            throw new ForbiddenException(error);
        }

    }

    async getOrders() {
        try {
            const Orders = await this.prismaService.order.findMany({
                where: {
                    id: {
                        not: 0
                    }
                }
            })

            return Orders
        } catch (error) {
            throw new ForbiddenException("No Order to show");
        }
    }
    async getOrderById(OrderId: number) {

        try {
            const Order = await this.prismaService.order.findFirst({
                where: {
                    id: Number(OrderId)
                }
            })

            return Order;
        } catch (error) {

            throw new ForbiddenException("error");
        }
    }


    async addManyOrder(Orders: AddOrderDto[]) {

        try {
            const result = []
            
            product: AddProduct
            let newOrder ;
            let mappedOrder;
            for(let i = 0; i < Orders.length ; i++){
                newOrder = Orders[i]
                const product = await this.prismaService.product.findFirst({
                    where: {
                        id: Number(newOrder.productId)
                    }
                })
                const user = await this.prismaService.user.findFirst({
                    where: {
                        id: Number(newOrder.userId)
                    }
                })
                const price = Number(product.price);
                const totalPrice = price * Number(newOrder.quantity);
                mappedOrder = {
                    City: newOrder.city,
                    Country: newOrder.country,
                    Postal: newOrder.postal,
                    Quantity: Number(newOrder.quantity),
                    TotalPrice: totalPrice,
                    userId: Number(newOrder.userId),
                    productId: Number(newOrder.productId)
                }
                result.push(mappedOrder)
            }
            console.log(result)
            const Order = await this.prismaService.order.createMany({

                data: result
            });
            return Order;
        } catch (error) {
            throw new ForbiddenException(error.message);
        }

    }

}
