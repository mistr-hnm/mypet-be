import { Entity, Column } from 'typeorm';
import { BaseSchema } from '../../../core/meta/base.schema';
 
@Entity()
export class File extends BaseSchema {
    
    @Column({ type: 'varchar', nullable: false })
    key: string;

    @Column({ type: 'varchar', nullable: true })
    filename: string;

    @Column({ type: 'varchar', nullable: false })
    url: string;
 

}