import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthLogIn, AuthSignUp, tokenModel } from './dto';
import *  as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Tokens } from './types';
import { use } from 'passport';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService,
        private jwt: JwtService,
        private config: ConfigService) { }

    async GetUsers(){
        const users = await this.prismaService.user.findMany({
            where:{
                id:{
                    not: 0
                }
            }
        })
        return users.map(user => {
            delete user.hash;
            delete user.hashRt;
            delete user.updatedAt;
            return user
        });
    }
    async deleteUser(id:number){
        const userId = Number(id)
        try{
            const result = await this.prismaService.user.delete({
                where: {
                    id: userId
                }
            })
            return true
        }catch(error){
            console.log(error)
            return false
        }
        
    }
    async signup(dto: AuthSignUp) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prismaService.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    hash,
                    email: dto.email,
                    hashRt: ""
                }
            });
            const payload = new tokenModel();
            payload.email = user.email;
            payload.firstName = user.firstName;
            payload.lastName = user.lastName;
            payload.userId = user.id;
            payload.role = user.role;
            const token = await this.signToken(payload);
            this.updateRtHash(user.id, token.refresh_token)
            return token
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {

                if (error.code == 'P2002') {
                    return new ForbiddenException('The account already exists');
                }
                throw error;
            }
            throw error;
        }



    }

    async signin(dto: AuthLogIn): Promise<Tokens> {
        const user = await this.prismaService.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new ForbiddenException('Account does not exist please create a new one.');
        const passwordMatch = await argon.verify(user.hash, dto.password);
        if (!passwordMatch) throw new ForbiddenException('Password doesnot match');
        const payload = new tokenModel();
        payload.email = user.email;
        payload.firstName = user.firstName;
        payload.lastName = user.lastName;
        payload.userId = user.id;
        payload.role = user.role;
        const token = await this.signToken(payload);
        this.updateRtHash(user.id, token.refresh_token);
        return token;
    }

    async addToRole(userId: number, roleName: string) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    id: Number(userId)
                }
            });

            if (!user) throw new ForbiddenException("User with this id doesnot exists");
            user.role = roleName;
            const userRole = await this.prismaService.user.update({
                where: {
                    id: user.id
                }, data: user
            })
            return user;
        } catch (error) {
            throw new ForbiddenException("Could not add the user to the role");
        }
    }
    async logout(userId: number) {

        await this.prismaService.user.updateMany({
            where: {
                id: userId,
                hashRt: {
                    not: null
                }
            },
            data: {
                hashRt: null
            }
        })
    }


    async refreshTokens(userId: number, refersh_token: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) throw new ForbiddenException('Access denied')
        const rtMatches = await argon.verify(user.hashRt, refersh_token);
        if (!rtMatches) throw new ForbiddenException("Access denied");
        const payload = new tokenModel();
        payload.email = user.email;
        payload.firstName = user.firstName;
        payload.lastName = user.lastName;
        payload.userId = user.id;
        payload.role = user.role;
        const token = await this.signToken(payload);
        this.updateRtHash(user.id, token.refresh_token);
        return token;
    }




    async signToken(tokenModel: tokenModel): Promise<Tokens> {
        const payload = {
            sub: tokenModel.userId,
            email: tokenModel.email,
            firstName: tokenModel.firstName,
            lastName: tokenModel.lastName,
            role: tokenModel.role
        }
        const key = this.config.get("JWT_SECRET")
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '10m',
            secret: key,
        });

        delete payload.firstName;
        delete payload.lastName;
        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: key,
        });
        return {
            access_token: token,
            refresh_token: refreshToken
        }
    }

    async updateRtHash(userId: number, rtToken: string) {
        const hash = await argon.hash(rtToken)
        await this.prismaService.user.update({
            where: {
                id: userId
            }, data: {
                hashRt: hash
            }
        });

    }


}
