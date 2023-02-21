import { Decimal } from "@prisma/client/runtime/library";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { type } from "os";

export class AddProduct {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    quantity: number

    @IsNotEmpty()
    @IsString()
    brand: string

    @IsNotEmpty()
    @IsString()
    size: string

    @IsNotEmpty()
    @IsString()
    category: string

    image: any

}


export class EditProduct {
    @IsNotEmpty()
    id: number
    @IsString()
    name: string

    @IsString()
    description: string

    price: number

    quantity: number

    @IsString()
    brand: string

    @IsString()
    size: string

    @IsString()
    category: string

    image: any

}

export type EditPutProduct = {

    id: number
    name: string

    description: string

    price: number

    quantity: number

    brand: string

    size: string

    image: any

    category: string

}