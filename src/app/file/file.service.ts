import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './schemas/file.entity';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import {
  CreateFileResponseDto,
  DeleteFileResponseDto,
  FileDto,
  GetFileResponseDto,
} from './schemas/file.dto';

@Injectable()
export class FileService {
  private readonly s3Client: S3Client;
  private readonly s3BucketName: string;
  private readonly s3Region: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(File)
    private readonly fileRepo: Repository<File>,
  ) {
    this.s3BucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
    this.s3Region = this.configService.getOrThrow<string>('S3_REGION');

    this.s3Client = new S3Client({
      region: this.s3Region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'S3_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    isPublic = false,
  ): Promise<CreateFileResponseDto> {
    try {
      const filename = file.originalname
        .replace(/[^a-z0-9.-]/gi, '_')
        .toLowerCase();
      const fileKey = `${Date.now()}-${filename}`;

      const uploadParams: any = {
        Bucket: this.s3BucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? 'public-read' : 'private',
      };

      const uploader = new Upload({
        client: this.s3Client,
        params: uploadParams,
      });
      await uploader.done();

      const fileUrl = `https://${this.s3BucketName}.s3.${this.s3Region}.amazonaws.com/${fileKey}`;

      const newFile = this.fileRepo.create({
        filename,
        key: fileKey,
        url: fileUrl,
      });
      const savedFile = await this.fileRepo.save(newFile);

      if (!savedFile.id) {
        throw new BadRequestException(`File upload failed.`);
      }

      return {
        status: true,
        message: 'File uploaded successfully',
        data: {
          key: fileKey,
          url: fileUrl,
          filename,
          id: savedFile.id,
        },
      };
    } catch (error) {
      console.error('S3 Upload error:', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  async getPresignedUrl(
    key: string,
    expiresInSeconds = 3600,
  ): Promise<GetFileResponseDto> {
    try {
      const file = await this.fileRepo.findOne({ where: { key } });

      if (!file) {
        throw new NotFoundException(`File not found.`);
      }

      const command = new GetObjectCommand({
        Bucket: this.s3BucketName,
        Key: key,
      });

      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });

      return {
        status: true,
        message: 'File fetched successfully',
        data: {
          key,
          url: presignedUrl,
          filename: file.filename,
          id: file.id,
        },
      };
    } catch (error) {
      console.error('Presigned URL error:', error);
      throw new InternalServerErrorException('Failed to generate secure file URL');
    }
  }

  async deleteFile(key: string): Promise<DeleteFileResponseDto> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.s3BucketName,
        Key: key,
      });
      await this.s3Client.send(command);

      await this.fileRepo.delete({ key });

      return {
        status: true,
        message: 'File deleted successfully.',
      };
    } catch (error) {
      console.error('Delete error:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async findById(id: string): Promise<FileDto | null> {
    return this.fileRepo.findOne({ where: { id : parseInt(id) } });
  }

  async findByKey(key: string): Promise<FileDto | null> {
    return this.fileRepo.findOne({ where: { key } });
  }

  async getObjectBuffer(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.s3BucketName,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    const stream = response.Body as Readable;

    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
