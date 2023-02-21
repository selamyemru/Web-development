import { Injectable, ExecutionContext } from '@nestjs/common';
import { CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {

    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        const role = request.user.role;
        if (role !== 'admin') {
            throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
        }

        return true;
    }
}