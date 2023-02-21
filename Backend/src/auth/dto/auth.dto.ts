import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class AuthSignUp{
    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsString()
    @IsNotEmpty()
    password: string

}

export class AuthLogIn {
    @IsEmail()
    @IsString()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

}

export class tokenModel{
    @IsNumber()
    @IsNotEmpty()
    userId: number
    @IsString()
    @IsNotEmpty()
    email: string
    @IsString()
    @IsNotEmpty()
    firstName: string
    @IsString()
    @IsNotEmpty()
    lastName: string
    @IsNotEmpty()
    @IsString()
    role: string


}

export class RoleModel{
    @IsString()
    @IsNotEmpty()
    roleName: string

    userId:number
}