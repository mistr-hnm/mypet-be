import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber, 
    IsEnum, 
} from 'class-validator'; 
import { AdoptionStatus } from '../schemas/petadoption.schema';


export class CreatePetAdoptionDto {
    @ApiProperty({ example: 123, description: "The unique identifier of the user" })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 123, description: "The unique identifier of the user" })
    @IsNumber()
    @IsNotEmpty()
    petId: number;

    @ApiProperty({ example: AdoptionStatus.PENDING, description: "The species of the Pet", enum: AdoptionStatus })
    @IsEnum(AdoptionStatus)
    @IsNotEmpty()
    petstatus: AdoptionStatus;

    @IsString()
    @IsOptional()
    remarks?: string;
}


export class UpdatePetAdoptionDto extends PartialType(CreatePetAdoptionDto) { }

export class CreatePetAdoptionResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the Pet creation was successful' })
    status: boolean;

    @ApiProperty({ example: 'Pet added successfully', description: 'A message detailing the outcome' })
    message: string;

}

export class UpdatePetAdoptionResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the Pet update was successful' })
    status: boolean;

    @ApiProperty({ example: 'Pet not found', description: 'A message detailing the outcome' })
    message: string;
}
