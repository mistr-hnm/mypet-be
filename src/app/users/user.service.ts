import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PermissionService } from '../permission/permission.service'; 
import {
  CreateUserDto,
  CreateUserResponseDto,
  DeleteUserResponseDto,
  GetUserResponseDto,
  GetUsersResponseDto,
  LoginUserDto,
  LoginUserResponseDto,
  UpdateUserDto,
  UpdateUserResponseDto,
} from './schemas/user.dto';
import { PaginationDto, PaginationUtil } from '../../lib/paginatation.util';
import { User } from './schemas/user.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly permissionService: PermissionService, 
    private readonly jwtService: JwtService,
  ) {}
  
  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto | null> {
    const user = await this.userRepo.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'password', 'email' ,'usertype'],
    });

    if (!user) {
      throw new NotFoundException('User not found. Please register first.');
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password incorrect.');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    let cachedPermissions : any = await this.permissionService.findAll();
    return {
      status: true,
      message: 'User logged in successfully.',
      data: {
        user: user.id,
        email: user.email,
        token,
        usertype : user.usertype,
        permission: cachedPermissions.data,
      },
    };
  }
 
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const existing = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists.');
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepo.create({
      ...createUserDto,
      password: hash,
    });

    await this.userRepo.save(newUser);

    return {
      status: true,
      message: 'User created successfully.',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        description: newUser.description,
      },
    };
  }
   
  async findAll(paginationDto: PaginationDto): Promise<GetUsersResponseDto> {
    const { page, limit } = paginationDto;
    const skip = PaginationUtil.getSkip(page, limit);

    const [users, total] = await this.userRepo.findAndCount({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    const data = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
    }));

    return PaginationUtil.paginate(
      true,
      'Users fetched successfully',
      data,
      total,
      page,
      limit,
    );
  }
 
  async findById(id: string): Promise<GetUserResponseDto> {
    const user = await this.userRepo.findOne({where : { id : parseInt(id) }});
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return {
      status: true,
      message: 'User fetched successfully.',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        description: user.description,
      },
    };
  }
 
  async update(id: string , updateUserDto: UpdateUserDto): Promise<UpdateUserResponseDto> {
    const existing = await this.userRepo.findOne({ where: { id: parseInt(id) } });
    if (!existing) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    await this.userRepo.update({ id: parseInt(id) }, updateUserDto);

    const updatedUser = await this.userRepo.findOne({ where: { id: parseInt(id) } });

    return {
      status: true,
      message: 'User updated successfully.',
      data: {
        id: updatedUser?.id || 0,
        name: updatedUser?.name,
        email: updatedUser?.email,
        description: updatedUser?.description,
      },
    };
  } 

  async delete(id: string): Promise<DeleteUserResponseDto> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return { status: true, message: 'User deleted successfully.' };
  }
  
}
