import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";

export enum Status {
    ACTIVE = "active",
    DELETED = "deleted",
}

@Entity()
export class BaseSchema {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String, enum: Status, default: Status.ACTIVE })
    status?: Status;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

}