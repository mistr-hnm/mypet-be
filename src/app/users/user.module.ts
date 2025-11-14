import { Module } from '@nestjs/common'; 
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schemas/user.entity'; 
import { PermissionModule } from '../permission/permission.module';
import { GoogleStratergy } from './strategies/google.strategy';

@Module({
    imports : [
        TypeOrmModule.forFeature([
            User
        ]), 
        PermissionModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        GoogleStratergy
    ]
})
export class UserModule {}
