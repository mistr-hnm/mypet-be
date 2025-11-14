import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/app/users/user.service';
import { CreateUserDto } from 'src/app/users/schemas/user.dto';

@Injectable()
export class GoogleStratergy extends PassportStrategy(Strategy) {

    constructor(
        private userService: UserService,
    ) {
        super({
            clientID: process.env.CLIENT_ID || '',
            clientSecret: process.env.CLIENT_SECRET || '',
            callbackURL: process.env.REDIRECT_URI,
            scope: ["email", "profile"]
        })
    }

    authorizationParams(): { [key: string]: string;} {
        return ({
            access_type: 'offline',
            prompt: 'consent'
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        // console.log("accessToken", accessToken);
        // console.log("refreshToken", refreshToken);
        // console.log({ profile });

        const createUser: CreateUserDto = {
            email: profile.emails[0].value,
            name: profile.emails[0].firstName + profile.emails[0].lastName,
            password: "",
            description: ""
        }
        const user = await this.userService.validateGoogle(createUser)

        done(null, user.data);
    }

}