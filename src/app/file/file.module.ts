import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './schemas/file.entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
    imports : [
        TypeOrmModule.forFeature([
            File
        ])
    ],
    controllers: [
        FileController
    ],
    providers: [
        FileService,
    ]
})
export class FileModule {}
