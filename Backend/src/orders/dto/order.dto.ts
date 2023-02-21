import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator"

export class AddOrderDto {

    quantity: number
    @IsNotEmpty()
    @IsString()
    country: string
    @IsNotEmpty()
    @IsString()
    city: string
    @IsNotEmpty()
    @IsString()
    postal: string
    @IsNotEmpty()
    productId: number
    @IsNotEmpty()

    userId: number

}


export class EditOrderDto {
    id:number
    quantity: number
    totalPrice : number
    @IsString()
    country: string
    @IsString()
    city: string
    @IsString()
    postal: string

    productId: number

    userId: number

}