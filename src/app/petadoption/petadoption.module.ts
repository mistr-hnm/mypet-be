import { Module } from '@nestjs/common';
import { PetAdoptionController } from './petadoption.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetAdoption } from './schemas/petadoption.schema';
import { PetAdoptionService } from './petadoption.service';
import { Pet } from '../pet/schemas/pet.schema';
import { User } from '../users/schemas/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PetAdoption,
            Pet,
            User
        ]),
    ],
    controllers: [PetAdoptionController],
    providers: [
        PetAdoptionService
    ]
})
export class PetAdoptionModule { }
