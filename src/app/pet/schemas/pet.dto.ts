import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    Min,
    IsDateString, 
    IsEnum,
    isString,
} from 'class-validator';
import { GetPaginationDto, PaginationDto } from '../../../lib/paginatation.util';

export enum PetGender {
    MALE = 'Male',
    FEMALE = 'Female',
    UNKNOWN = 'Unknown'
}

export enum adoptionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED'
}

export enum PetSpecies {
    DOG = 'Dog',
    CAT = 'Cat',
    BIRD = 'Bird',
    REPTILE = 'Reptile',
    OTHER = 'Other',
}

export class PetDto {
    
    @ApiProperty({ example: "1", description: "The id of the Pet" })
    @IsNumber()
    readonly id?: number;


    @ApiProperty({ example: "Fido", description: "The full name (name) of the Pet" })
    @IsString()
    @IsNotEmpty()
    readonly fullname: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(PetSpecies)
    readonly species: PetSpecies;

    @ApiProperty({ example: "Golden Retriever", description: "The breed of the Pet" })
    @IsString()
    @IsOptional()
    readonly breed?: string;

    @ApiProperty({ example: PetGender.MALE, description: "The gender of the Pet", enum: PetGender })
    @IsString()
    @IsOptional()
    @IsEnum(PetGender)
    readonly gender?: PetGender;

    @ApiProperty({ example: 5, description: "The age of the Pet in years" })
    @IsNumber()
    @IsOptional()
    @Min(0)
    readonly ageYears?: number;

    @ApiProperty({ example: "Loves long walks and chasing squirrels.", description: "A brief description of the Pet", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: 1, description: "ID of the Pet's profile picture" })
    @IsNumber()
    @IsOptional()
    readonly picture?: number;


    
}

export class CreatePetDto {
    @ApiProperty({ example: "Fido", description: "The full name (name) of the Pet" })
    @IsString()
    @IsNotEmpty()
    readonly fullname: string;

    @ApiProperty({ example: PetSpecies.DOG, description: "The species of the Pet", enum: PetSpecies })
    @IsString()
    @IsNotEmpty()
    @IsEnum(PetSpecies)
    readonly species: PetSpecies;

    @ApiProperty({ example: "Golden Retriever", description: "The breed of the Pet" })
    @IsString()
    @IsOptional()
    readonly breed?: string;

    @ApiProperty({ example: PetGender.MALE, description: "The gender of the Pet", enum: PetGender })
    @IsString()
    @IsOptional()
    @IsEnum(PetGender)
    readonly gender?: PetGender;

    @ApiProperty({ example: 5, description: "The age of the Pet in years" })
    @IsNumber()
    @IsOptional()
    @Min(0)
    readonly ageYears?: number;

    @ApiProperty({ example: "Loves long walks and chasing squirrels.", description: "A brief description of the Pet", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: 1, description: "ID of the Pet's profile picture" })
    @IsNumber()
    @IsOptional()
    readonly picture?: number;
}

export class UpdatePetDto {
    @ApiPropertyOptional({ example: "Fido Smith", description: "The updated full name of the Pet" })
    @IsString()
    @IsOptional()
    readonly fullname?: string;

    @ApiPropertyOptional({ example: "2020-05-21T00:00:00.000Z", description: "The updated date of birth (ISO 8601 format)" })
    @IsDateString()
    @IsOptional()
    readonly dateofbirth?: string;

    @ApiPropertyOptional({ example: PetSpecies.DOG , description: "The updated species of the Pet", enum: PetSpecies })
    @IsString()
    @IsOptional()
    @IsEnum(PetSpecies)
    readonly species?: PetSpecies;

    @ApiPropertyOptional({ example: "Siamese", description: "The updated breed of the Pet" })
    @IsString()
    @IsOptional()
    readonly breed?: string;

    @ApiPropertyOptional({ example: PetGender.MALE, description: "The updated gender of the Pet", enum: PetGender })
    @IsString()
    @IsOptional()
    @IsEnum(PetGender)
    readonly gender?: PetGender;

    @ApiPropertyOptional({ example: 6, description: "The updated age of the Pet in years" })
    @IsNumber()
    @IsOptional()
    @Min(0)
    readonly ageYears?: number;

    @ApiPropertyOptional({ example: "Now prefers quiet spaces and sunbathing.", description: "Additional description about the Pet", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiPropertyOptional({ example: 2, description: "Updated ID of the Pet's profile picture" })
    @IsNumber()
    @IsOptional()
    readonly picture?: number;
}

export class CreatePetResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the Pet creation was successful' })
    status: boolean;

    @ApiProperty({ example: 'Pet added successfully', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: PetDto,
        description: 'The created Pet data object',
    })
    data?: PetDto;
}

export class UpdatePetResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the Pet update was successful' })
    status: boolean;

    @ApiProperty({ example: 'Pet not found', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: PetDto,
        description: 'The updated Pet data object',
    })
    data?: PetDto;
}

export class GetPetByIdDto {
    @ApiProperty({ example: 123, description: "The unique identifier of the Pet" })
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
}

export class GetPetResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'Pet not found', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: PetDto,
        description: 'The Pet data object',
    })
    data?: PetDto;
}

export class GetAllPetsDto {
    @ApiProperty({ example: 10, description: "The number of Pets to retrieve per page" })
    @IsOptional()
    @IsNumber()
    @Min(1)
    readonly limit?: number;

    @ApiProperty({ example: 0, description: "The offset for pagination" })
    @IsOptional()
    @IsNumber()
    @Min(0)
    readonly offset?: number;
}

export class GetPetDto {
    
    @ApiProperty({ example: "1", description: "The id of the Pet" })
    @IsNumber()
    readonly id?: number;


    @ApiProperty({ example: "Fido", description: "The full name (name) of the Pet" })
    @IsString()
    @IsNotEmpty()
    readonly fullname: string;

    @ApiProperty({ example: PetSpecies.DOG, description: "The species of the Pet", enum: PetSpecies })
    @IsString()
    @IsNotEmpty()
    @IsEnum(PetSpecies)
    readonly species: PetSpecies;

    @ApiProperty({ example: "Golden Retriever", description: "The breed of the Pet" })
    @IsString()
    @IsOptional()
    readonly breed?: string;

    @ApiProperty({ example: PetGender.MALE, description: "The gender of the Pet", enum: PetGender })
    @IsString()
    @IsOptional()
    @IsEnum(PetGender)
    readonly gender?: PetGender;

    @ApiProperty({ example: 5, description: "The age of the Pet in years" })
    @IsNumber()
    @IsOptional()
    @Min(0)
    readonly ageYears?: number;

    @ApiProperty({ example: "Loves long walks and chasing squirrels.", description: "A brief description of the Pet", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;

    @ApiProperty({ example: 1, description: "ID of the Pet's profile picture" })
    @IsString()
    @IsOptional()
    readonly picture?: string;
    
    @ApiProperty({ example: adoptionStatus.PENDING, description: "The gender of the Pet", enum: adoptionStatus })
    @IsString()
    @IsOptional()
    @IsEnum(adoptionStatus)
    readonly adoptionStatus?: adoptionStatus;
    


    
}

export class GetPetsResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'No Pets found', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: [GetPetDto],
        description: 'An array of Pet data objects',
    })
    data?: GetPetDto[];

    @ApiProperty({
        type: GetPaginationDto,
        description: 'Pagination details',
    })
    pagination?: GetPaginationDto;
}

export class DeletePetDto {
    @ApiProperty({ example: 123, description: "The unique identifier of the Pet to delete" })
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
}

export class DeletePetResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'Pet deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}

export enum PetSortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum PetSortField {
    CREATED_AT = 'createdAt',
    NAME = 'name', 
}

export class SearchPetsDto extends PaginationDto {
    @ApiPropertyOptional({
        description: "Search term for name or id",
        example: "gereman",
    })
    @IsOptional()
    @IsString()
    searchTerm?: string;

    @ApiPropertyOptional({
        description: "Sort field",
        enum: PetSortField,
        default: PetSortField.CREATED_AT,
    })
    @IsOptional()
    @IsEnum(PetSortField)
    sortBy?: PetSortField = PetSortField.CREATED_AT;

    @ApiPropertyOptional({
        description: "Sort order",
        enum: PetSortOrder,
        default: PetSortOrder.DESC,
    })
    @IsOptional()
    @IsEnum(PetSortOrder)
    sortOrder?: PetSortOrder = PetSortOrder.DESC;
}
