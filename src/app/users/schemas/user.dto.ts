import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, isEmpty, IsNumber } from 'class-validator';
import { GetPaginationDto } from '../../../lib/paginatation.util';

export class LoginUserDto {

    @ApiProperty({ example: "mistrhnm@gmail.com" })
    @IsEmail()
    @IsNotEmpty()
    readonly email!: string;

    @ApiProperty({ example: "Pass#123" })
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
export class LoginUserResponseDto {
    @ApiProperty({ example: true, description: 'The identification of operation' })
    status: boolean;

    @ApiProperty({ example: 'Loggedin successfully.', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        example: {
            user: 1,
            email: 'jhon@example.com',
            token: '3ds34dsr54dsds98ds9d8s9d9sdsds8d9asyd989s8yfasdasd897asd98as',
            createdAt: new Date().toString(),
            usertype : "USER",
            permission: [],

        },
        description: 'The response data object',
    })
    data: {
        user: number;
        email: string;
        token: string;
        usertype: string;
        createdAt?: string;
        permission?: any[]
    };
}

export class UserDto {
    @ApiProperty({ example: 123, description: "The unique identifier of the user" })
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;

    @ApiProperty({ example: "John Doe", description: "The name of the user" })
    @IsString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty({ example: "john.d@example.com", description: "The email of the user" })
    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @ApiProperty({ example: "john.d@example.com", description: "The email of the user" })
    @IsEmail()
    @IsOptional()
    readonly usertype?: string;

    @ApiProperty({ example: "Description about the user", description: "Additional description about the user" })
    @IsString()
    @IsOptional()
    readonly description?: string;
}

export class CreateUserDto {
    @ApiProperty({ example: "John Doe", description: "The name of the user" })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ example: "john@example.com", description: "The email of the user" })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ example: "Pass#123", description: "The password of the user" })
    @IsString()
    @IsOptional()
    readonly password?: string;

    @ApiProperty({ example: "A brief description about the user", description: "Additional description about the user", required: false })
    @IsString()
    @IsOptional()
    readonly description?: string;
}

export class CreateUserResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the user creation was successful' })
    status: boolean;

    @ApiProperty({ example: 'User created.', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: [ UserDto ],
        example: {
            id: 123,
            name: 'John Doe',
            email: 'john.doe@example.com',
            description: 'A new user created via the API' 
        },
        description: 'The created user data object',
    })
    data: {
        id: number;
        name: string;
        email: string;
        description?: string;
    }

}


export class UpdateUserDto {
    
    @ApiProperty({ example: "John Doe Updated", description: "The updated name of the user" })
    @IsString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty({ example: "john.updated@example.com", description: "The updated email of the user" })
    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @ApiProperty({ example: "UpdatedPass#123", description: "The updated password of the user" })
    @IsString()
    @IsOptional()
    readonly password?: string;

    @ApiProperty({ example: "Updated description about the user", description: "Additional description about the user" })
    @IsString()
    @IsOptional()
    readonly description?: string;
}

export class UpdateUserResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the user update was successful' })
    status: boolean;

    @ApiProperty({ example: 'User updated.', description: 'A message detailing the outcome' })
    message: string;

    @ApiProperty({
        type: [ UserDto ],
        example: {
            id: 123,
            name: 'John Doe Updated',
            email: 'john.doe.updated@example.com',
            description: 'User description updated',
        },
        description: 'The updated user data object'
    })
    data: {
        id: number;
        name?: string;
        email?: string;
        description?: string 
    }
}


export class GetUserByIdDto {
    @ApiProperty({ example: "12345", description: "The unique identifier of the user" })
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
}

export class GetUserResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'User fetched successfully', description: 'A message detailing the outcome (optional, present if success is false)' })
    message?: string;

    @ApiProperty({
        type: [ UserDto ],
        example: {
            id: 123,
            name: 'John Doe',
            email: 'john.doe@example.com',
            description: 'A brief description of the user',
        },
        description: 'The user data object',
    })
    data?: {
        id: number; // Assuming your BaseSchema adds an id
        name: string;
        email: string;
        description?: string;
    }

}


export class GetAllUsersDto {
    @ApiProperty({ example: 10, description: "The number of users to retrieve per page" })
    @IsOptional()
    readonly limit?: number;

    @ApiProperty({ example: 0, description: "The offset for pagination" })
    @IsOptional()
    readonly offset?: number;
}

export class GetUsersResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'User not found', description: 'A message detailing the outcome (optional, present if success is false)' })
    message: string;

    @ApiProperty({
        type: [ UserDto ],
        example: [
            {
                id: 123,
                name: 'John Doe',
                email: 'john.doe@example.com',
                description: 'A brief description of the user'
            },
            {
                id: 456,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                description: 'Another user description',
            },
        ],
        description: 'An array of user data objects',
    })
    data?: {
        id: number;
        name: string;
        email: string;
        description?: string;
    }[];

    @ApiProperty({
        type: [GetPaginationDto],
        example: {
                page: 1,
                limit: 10,
                total: 10,
                totalPages: 1, 
                hasNext: false,
                hasPrev: false,
        },
        description: 'An pagination details of list',
    })
    pagination?: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNext: boolean,
        hasPrev: boolean,
    };

}


export class DeleteUserDto {
    @ApiProperty({ example: 12345, description: "The unique identifier of the user to delete" })
    @IsString()
    @IsNotEmpty()
    readonly id: number;
}

export class DeleteUserResponseDto {
    @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
    status: boolean;

    @ApiProperty({ example: 'User deleted successfully', description: 'A message indicating the outcome of the deletion' })
    message: string;
}