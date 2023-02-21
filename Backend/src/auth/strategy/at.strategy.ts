import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
type jwtPayload = {
    sub: number
    email: string
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy,'jwt') {
    constructor(private config:ConfigService) {
        super({
            jwtFromRequest: 
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET"),
        });

    }


    validate(payload: jwtPayload) {
        return payload
    }
}