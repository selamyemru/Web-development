import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AddOrderDto, EditOrderDto } from './dto';
import { AdminGuard } from 'src/auth/common/guards';

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }
    @UseGuards(AdminGuard)
    @Get("getOrders")
    getOrders() {
        return this.orderService.getOrders()
    }

    @Post("addOrder")
    addOrder(@Body() order: AddOrderDto) {
        return this.orderService.addOrder(order);
    }
    @Post("addManyOrder")
    addManyOrder(@Body() order: AddOrderDto[]) {
        return this.orderService.addManyOrder(order);
    }

    @Delete('deleteOrder/:orderId')
    deleteOrder(@Param("orderId")orderId: number) {
        this.orderService.deleteOrder(orderId);
    }

    @Put('editorder')
    async editOrder(@Body() updatedOrder: EditOrderDto) {
        const prevOrder = await this.orderService.getOrderById(Number(updatedOrder.id));
        if(!prevOrder) throw new ForbiddenException("order doesnot exist");
        return this.orderService.editOrder(updatedOrder);
    }
}
