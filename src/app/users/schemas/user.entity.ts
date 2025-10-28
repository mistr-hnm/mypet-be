import { Entity, Column } from 'typeorm';
import { BaseSchema } from '../../../core/meta/base.schema';

export enum USERTYPE {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

@Entity()
export class User extends BaseSchema {

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;
    
    @Column({ type: 'enum', enum: USERTYPE, nullable: false, default : USERTYPE.USER })
    usertype: USERTYPE;
 
}
