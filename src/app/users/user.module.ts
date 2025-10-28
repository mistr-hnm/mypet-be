import { Module } from '@nestjs/common'; 
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schemas/user.entity'; 
import { PermissionModule } from '../permission/permission.module';

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
    ]
})
export class UserModule {}
