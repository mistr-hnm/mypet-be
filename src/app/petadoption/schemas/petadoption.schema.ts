import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseSchema } from '../../../core/meta/base.schema';
import { User } from '../../users/schemas/user.entity';
import { Pet } from '../../pet/schemas/pet.schema';

export enum AdoptionStatus {
  PENDING = 'PENDING',
  REQUEST = 'REQUEST',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class PetAdoption extends BaseSchema {

  @ManyToOne(() => User, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Pet, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'petId' })
  pet: Pet;

  @Column({
    type: 'enum',
    enum: AdoptionStatus,
    default: AdoptionStatus.PENDING,
  })
  petstatus: AdoptionStatus;

  @Column({ type: 'text', nullable: true })
  remarks?: string;
}
