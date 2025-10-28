import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiParam, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger'; // Added specific ApiResponse decorators
import { PetService } from './pet.service'; 
import {
    CreatePetDto,
    CreatePetResponseDto,
    UpdatePetDto,
    UpdatePetResponseDto, 
    GetPetResponseDto, 
    GetPetsResponseDto, 
    DeletePetResponseDto,
    SearchPetsDto
} from './schemas/pet.dto'; 
import { signture } from '../../core/meta/global.header'; 
import { BadRequestResponseDto, InternalServerErrorResponseDto, NotFoundResponseDto, UnauthorizedResponseDto } from '../../lib/global.response';

@Controller()
export class PetsController {
    constructor(
        private readonly PetService: PetService
    ) {}

    @ApiOperation({ summary: "Create a new Pet" })
    @ApiBody({
        description: "Pet data for creation.",
        type: CreatePetDto  
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Pet created successfully", type: CreatePetResponseDto })
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @Post()
    async create(@Body() createPetDto: CreatePetDto) {
        return await this.PetService.create(createPetDto);
    }

    @ApiOperation({ summary: "Get all Pets" })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Pets fetched successfully", type: GetPetsResponseDto })
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @Get()
    async findAll(@Query() searchPetsDto : SearchPetsDto) {
        return await this.PetService.findAll(searchPetsDto);
    }

    @ApiOperation({ summary: "Get Pet by ID" })
    @ApiParam({ name: 'id', description: "ID of the Pet to retrieve.", type: String, format: 'uuid' })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Pet fetched successfully", type: GetPetResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @ApiNotFoundResponse({ description: "Pet not found." , type : NotFoundResponseDto })
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.PetService.findById(id);
    }

    @ApiOperation({ summary: "Update Pet by ID" })
    @ApiParam({ name: 'id', description: "ID of the Pet to update.", type: String, format: 'uuid' }) 
    @ApiBody({
        description: "Partial Pet data for update.",
        type: UpdatePetDto
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Pet updated successfully", type: UpdatePetResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @ApiNotFoundResponse({ description: "Pet not found." , type : NotFoundResponseDto }) 
    @Put(':id')
    async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
        return await this.PetService.update(id, updatePetDto);
    }

    @ApiOperation({ summary: "Delete Pet by ID" })
    @ApiParam({ name: 'id', description: "ID of the Pet to delete.", type: String, format: 'uuid' })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Pet deleted successfully", type: DeletePetResponseDto }) 
    @ApiBadRequestResponse({ description: "Bad Request" , type : BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error" , type : InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type : UnauthorizedResponseDto  })
    @ApiNotFoundResponse({ description: "Pet not found." , type : NotFoundResponseDto })
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.PetService.delete(id);
    }
}