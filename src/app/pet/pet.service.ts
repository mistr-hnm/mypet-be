import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { 
  CreatePetResponseDto,
  UpdatePetDto,
  UpdatePetResponseDto,
  GetPetResponseDto,
  GetPetsResponseDto,
  DeletePetResponseDto,
  SearchPetsDto,
  PetSortField,
  PetSortOrder,
  CreatePetDto, 
} from './schemas/pet.dto';
import { Pet } from './schemas/pet.schema'; 
// import { FileService } from '../file/file.service';
import { PaginationUtil } from '../../lib/paginatation.util';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private readonly PetRepository: Repository<Pet>,
 

    // private readonly fileService: FileService,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<CreatePetResponseDto> {

    const { picture, ...PetData } = createPetDto;

    const newPet = this.PetRepository.create({
      ...PetData,
      picture: picture ? { id: picture } : undefined,
    });

    const savedPet = await this.PetRepository.save(newPet);

    return {
      status: true,
      message: 'Pet created successfully',
      data: { ...newPet, picture: newPet.picture?.id },
    };
  }

  async findAll(searchDto: SearchPetsDto): Promise<GetPetsResponseDto> {
    const {
      page,
      limit,
      searchTerm,
      sortBy = PetSortField.CREATED_AT,
      sortOrder = PetSortOrder.DESC,
    } = searchDto;

    const skip = PaginationUtil.getSkip(page, limit);

    // Build query
    const query = this.PetRepository
      .createQueryBuilder('Pet')
      .leftJoinAndSelect('Pet.picture','picture')
      .leftJoinAndSelect('Pet.adopter', 'adopter');
      
    // Search
    if (searchTerm) {
      query.where( '(Pet.fullname ILIKE :term OR Pet.description ILIKE :term' + { term: `%${searchTerm}%` });
    }

    // Sorting
    const order: 'ASC' | 'DESC' = sortOrder === PetSortOrder.ASC ? 'ASC' : 'DESC';
    query.orderBy(`Pet.${sortBy}`, order);

    // Pagination
    query.skip(skip).take(limit);

    const [Pets, total] = await query.getManyAndCount();

    if (!Pets || Pets.length === 0) {
      return PaginationUtil.paginate(true, 'Pets fetched successfully', [], total, page, limit);
    }
    
    const data = Pets.map((Pet) => {  
      let picture = Pet.picture;
      let adopter = Pet.adopter;
      return {
        id: Pet.id,
        fullname: Pet.fullname,
        description: Pet.description,
        species: Pet.species,
        picture: picture.url,
        adopter: adopter ? {  
            id: Pet.adopter.id,
            fullname: Pet.adopter?.name,
            email: Pet.adopter.email,
          } : null,
        isAvailableForAdoption: Pet.isAvailableForAdoption,
        createdAt: Pet.createdAt?.toDateString() ?? 'N/A',
      };
    });

    return PaginationUtil.paginate(true, 'Pets fetched successfully', data, total, page, limit);
  }

  async findById(id: string): Promise<GetPetResponseDto> {
    const Pet = await this.PetRepository.findOne({
      where: { id : parseInt(id) },
      relations: ['picture'],
    });

    if (!Pet) {
      throw new NotFoundException('Pet not found.');
    }

    return {
      status: true,
      message: 'Pet fetched successfully',
      data: {
        id: Pet.id,
        fullname: Pet.fullname,
        description: Pet.description,
        species: Pet.species,
        picture: Pet.picture.id,
      }
    };
  }

  async update(id: string, updatePetDto: UpdatePetDto): Promise<UpdatePetResponseDto> {
    
    
    const Pet = await this.PetRepository.findOne({ where: { id: parseInt(id) } });
    if (!Pet) {
      throw new NotFoundException('Pet not found for update.');
    }

    const updatedPet = await this.PetRepository.save({
      ...Pet,
      ...updatePetDto,
      picture: typeof updatePetDto.picture === 'number' ? { id: updatePetDto.picture } : updatePetDto.picture,
    });

    return {
      status: true,
      message: 'Pet updated successfully',
      data: { 
        ...updatedPet, 
        picture : updatedPet.picture.id,
      },
    };
  }

  async delete(id: string): Promise<DeletePetResponseDto> {
    const result = await this.PetRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Pet not found.');
    }

    return {
      status: true,
      message: 'Pet deleted successfully.',
    };
  }
}
