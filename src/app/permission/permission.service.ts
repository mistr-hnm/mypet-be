import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './schemas/permission.schema';
import {
  CreatePermissionDto,
  CreatePermissionResponseDto,
  UpdatePermissionDto,
  UpdatePermissionResponseDto,
  GetPermissionResponseDto,
  GetPermissionsResponseDto,
  DeletePermissionResponseDto,
  GetAllPermissionsDto,
} from './schemas/permission.dto'; 

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<CreatePermissionResponseDto> {
    const alreadyExist = await this.permissionRepository.findOne({
      where: { module: createPermissionDto.module },
      select: ['id'],
    });

    if (alreadyExist) {
      throw new BadRequestException(
        `Permission set for module "${createPermissionDto.module}" already exists.`,
      );
    }

    const newPermission = this.permissionRepository.create(createPermissionDto);
    const savedPermission = await this.permissionRepository.save(newPermission);

    return {
      status: true,
      message: 'Permission created successfully',
      data: {
        id: savedPermission.id,
        module: savedPermission.module,
        permission: savedPermission.permission,
        description: savedPermission.description,
      },
    };
  }

  async findAll(getAllPermissionsDto?: GetAllPermissionsDto): Promise<GetPermissionsResponseDto> {
    const { limit, offset } = getAllPermissionsDto || {};

    const [permissions, count] = await this.permissionRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    if (!permissions || permissions.length === 0) {
      throw new NotFoundException('No permissions found.');
    }

    const data = permissions.map((p) => ({
        id: p.id,
        module: p.module,
        permission: p.permission,
        description: p.description,
    }))

    return {
      status: true,
      message: 'Permissions fetched successfully',
      data: data,
    };
  }

  async findById(id: string): Promise<GetPermissionResponseDto> {
    const permission = await this.permissionRepository.findOne({ where: { id : parseInt(id) } });

    if (!permission) {
      throw new NotFoundException('No permissions found.');
    }

    return {
      status: true,
      message: 'Permission fetched successfully',
      data: {
        id: permission.id,
        module: permission.module,
        permission: permission.permission,
        description: permission.description,
      },
    };
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<UpdatePermissionResponseDto> {
    if (updatePermissionDto.module) {
      const existing = await this.permissionRepository.findOne({
        where: { module: updatePermissionDto.module },
      });

      if (existing && existing.id !== parseInt(id)) {
        throw new BadRequestException(`Permission for module "${updatePermissionDto.module}" already exists.`);
      }
    }

    const permission = await this.permissionRepository.findOne({ where: { id : parseInt(id) } });
    if (!permission) {
      throw new NotFoundException('Permission not found for update.');
    }

    const updatedPermission = await this.permissionRepository.save({
      ...permission,
      ...updatePermissionDto,
    });

    return {
      status: true,
      message: 'Permission updated successfully',
      data: {
        id: updatedPermission.id,
        module: updatedPermission.module,
        permission: updatedPermission.permission,
        description: updatedPermission.description,
      },
    };
  }

  async delete(id: string): Promise<DeletePermissionResponseDto> {
    const result = await this.permissionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Permission not found for deletion.');
    }

    return {
      status: true,
      message: 'Permission deleted successfully.',
    };
  }
}
