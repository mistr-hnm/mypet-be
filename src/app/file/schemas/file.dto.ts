import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

 export class FileDto {
    @ApiProperty({ example: 'dsd5sds8dsds87d45sd9874wewed', description: "The ID of the file" })
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    readonly id?: number;

    @ApiProperty({ example: "test key", description: "The key of the file" })
    @IsString()
    @IsNotEmpty()
    readonly key: string;

    @ApiProperty({ example: "file", description: "The file" })
    @IsString()
    @IsNotEmpty()
    readonly filename: string;

    @ApiProperty({ example: "https://aws.bucketname.com/filename.jpg", description: "The url of s3 bucket" })
    @IsString()
    @IsNotEmpty()
    readonly url: string;

}
 
export class CreateFileResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the file creation was successful' })
    status: boolean;

    @ApiProperty({
        type : [FileDto],
        example: {
            id: 123,
            key: "we4324esds",
            filename: 'Image.jpg',
            url: 'https://aws.bucketname.com/filename.jpg', 
        },
        description: 'The created file data object',
    })
    data?: {
        id: number;
        key: string;
        filename: string; 
        url : string 
    };
    @ApiProperty({ example: 'file uploaded successfully', description: 'A message detailing the outcome' })
    message: string;
}

export class GetFileResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'File fetched successfully', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: [FileDto],
        example: {
            id: 123,
            key: "we4324esds",
            filename: 'Image.jpg',
            url: 'https://aws.bucketname.com/filename.jpg', 
        },
        description: 'The file data object (optional, present if success is true)',
    })
    data?: {
        id: number;
        key: string;
        filename: string; 
        url : string 
    };
}
   
  
export class DeleteFileResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'File deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}