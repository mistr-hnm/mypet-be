import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';  
import { File } from '../../file/schemas/file.entity';
import { BaseSchema } from '../../../core/meta/base.schema';
import { User } from 'src/app/users/schemas/user.entity';

export enum PetGender {
    MALE = 'Male',
    FEMALE = 'Female',
    UNKNOWN = 'Unknown',
}

export enum PetSpecies {
    DOG = 'Dog',
    CAT = 'Cat',
    BIRD = 'Bird',
    REPTILE = 'Reptile',
    OTHER = 'Other',
}

export enum adoptionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
}

@Entity()
export class Pet extends BaseSchema {
    
    @Column({ type: 'varchar', nullable: false })
    fullname: string;

    @Column({ type: 'enum', enum: PetSpecies, nullable: false })
    species: PetSpecies;

    @Column({ type: 'varchar', nullable: true })
    breed: string; // 'Golden Retriever', 'Siamese'

    @Column({ type: 'int', nullable: true })
    ageYears: number; 

    @Column({ type: 'enum', enum: PetGender, nullable: true })
    gender: PetGender;

    @ManyToOne(() => File, {
        eager: true,
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'pictureId' })
    picture: File;

    // final Adopter ---
    @ManyToOne(() => User, {
        nullable: true, 
        onDelete: 'SET NULL', 
    })
    @JoinColumn({ name: 'adopterId' })
    adopter: User;

    @Column({ type: 'boolean', default: true })
    isAvailableForAdoption: boolean;

    @Column({ type: 'enum', enum: adoptionStatus, nullable: false, default : adoptionStatus.PENDING })
    adoptionStatus: adoptionStatus;

    @Column({ type: 'varchar', nullable: true })
    description: string;

}