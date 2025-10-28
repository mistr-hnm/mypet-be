import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pet } from '../pet/schemas/pet.schema';
import { PetAdoption, AdoptionStatus } from './schemas/petadoption.schema';
import { User } from '../users/schemas/user.entity';
import { CreatePetAdoptionDto, CreatePetAdoptionResponseDto, UpdatePetAdoptionDto, UpdatePetAdoptionResponseDto } from './schemas/petadoption.dto';

@Injectable()
export class PetAdoptionService {
  constructor(

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(PetAdoption)
    private readonly petadoptionRepository: Repository<PetAdoption>,

  ) { }

  async UpdatePetAdoptionStatus(
    dto: CreatePetAdoptionDto, 
  ): Promise<CreatePetAdoptionResponseDto | UpdatePetAdoptionResponseDto> {
    const userId = parseInt(dto.userId);
    const petId = parseInt(dto.petId);

    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    const pet = await this.petRepository.findOne({ where: { id: petId } });
    if (!pet) throw new NotFoundException('Pet not found.');

   
    let adoption = await this.petadoptionRepository.findOne({
      where: {
        user: { id: userId },  
        pet: { id: petId },   
      }, 
      relations: ['user', 'pet'],
    });

    const newStatus = dto.petstatus || AdoptionStatus.PENDING;

    // update
    if (adoption) {
      
      adoption.petstatus = newStatus;
      adoption.remarks = dto.remarks || adoption.remarks;

      adoption = await this.petadoptionRepository.save(adoption);

      if (newStatus === AdoptionStatus.COMPLETED) {
        await this.petRepository.update(petId, {
          adopter: user,
          isAvailableForAdoption: false,
        });
      }

      if (newStatus !== AdoptionStatus.COMPLETED && pet.adopter?.id === userId) {
        await this.petRepository.update(petId, {
          isAvailableForAdoption: true,
        });
      }

      return {
        status: true,
        message: 'Adoption status updated successfully.',
      };

    } else {
      adoption = this.petadoptionRepository.create({
        user,
        pet,
        petstatus: newStatus,
        remarks: dto.remarks,
      });

      const savedAdoption = await this.petadoptionRepository.save(adoption);

      if (newStatus === AdoptionStatus.COMPLETED) {
        await this.petRepository.update(petId, {
          adopter: user,
          isAvailableForAdoption: false,
        });
      }

      return {
        status: true,
        message: 'New adoption application created successfully.',
      };
    }
  }

}
