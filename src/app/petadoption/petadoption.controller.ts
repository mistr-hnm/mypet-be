import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger'; // Added specific ApiResponse decorators
import { PetAdoptionService } from './petadoption.service';
import { signture } from '../../core/meta/global.header';
import { BadRequestResponseDto, InternalServerErrorResponseDto, UnauthorizedResponseDto } from '../../lib/global.response';
import { CreatePetResponseDto } from '../pet/schemas/pet.dto'; 
import { CreatePetAdoptionDto, UpdatePetAdoptionDto } from './schemas/petadoption.dto';

@Controller()
export class PetAdoptionController {
    constructor(
        private readonly PetAdoptionService: PetAdoptionService
    ) { }

    @ApiOperation({ summary: "Create a new Pet adoption request" })
    @ApiBody({
        description: "adoption data for creation.",
        type: CreatePetAdoptionDto
    })
    @ApiHeaders([signture])
    @ApiOkResponse({ description: "Pet adoption request submitted successfully", type: CreatePetResponseDto })
    @ApiBadRequestResponse({ description: "Bad Request", type: BadRequestResponseDto })
    @ApiInternalServerErrorResponse({ description: "Internal server error", type: InternalServerErrorResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized", type: UnauthorizedResponseDto })
    @Post()
    async create(@Body() createPetDto: CreatePetAdoptionDto) {
        return await this.PetAdoptionService.UpdatePetAdoptionStatus(createPetDto);
    }

    

}