import { Module } from '@nestjs/common';  
import { PetsController } from './pet.controller'; 
import { FileModule } from '../file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './schemas/pet.schema';
import { PetService } from './pet.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ 
            Pet
        ]),
        FileModule
    ],
    controllers: [PetsController],
    providers: [
        PetService
    ]
})
export class PetModule { }
