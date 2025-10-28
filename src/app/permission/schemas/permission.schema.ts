
import { Column, Entity } from 'typeorm';
import { BaseSchema } from '../../../core/meta/base.schema';

@Entity()
export class Permission extends BaseSchema {

    @Column({ type: 'varchar', nullable: false })
    module: string;

    @Column({ type: 'varchar', nullable: false })
    permission: Array<string>;

    @Column()
    description: string; 

}