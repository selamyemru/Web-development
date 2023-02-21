import { Body, Controller, Delete, Get, Header, Headers, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLogIn, AuthSignUp, RoleModel } from './dto';
import { AdminGuard, AtGuard, RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId } from './common/decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: AuthSignUp){
        return  this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthLogIn) {
        return this.authService.signin(dto);
    }

    @UseGuards(AtGuard)
    @Post('logout')
    logout(@GetCurrentUserId() userId: number){
        this.authService.logout(userId);
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    refresh(@GetCurrentUserId() userId: number, @Body('refresh_token') refresh_token:string) {
        console.log(refresh_token)
        console.log(userId)
        if(refresh_token){
            return this.authService.refreshTokens(userId, refresh_token);
        }
        return {refresh_token:""}
        

    }

    @UseGuards(AdminGuard)
    @Post('addtorole')
    addtorole(@Body() model: RoleModel) {
        
        return this.authService.addToRole(model.userId, model.roleName);
        

    }
    @UseGuards(AdminGuard)
    @Get('getUsers')
    getUsers() {
        return this.authService.GetUsers();
    }
    @UseGuards(AdminGuard)
    @Delete('deleteUser/:id')
    deleteUser(@Param("id") id: number){
        return this.authService.deleteUser(id);
    }

}
