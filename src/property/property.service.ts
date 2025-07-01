// src/property/property.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './createProperty.dto';
import { updatePropertyDto } from './dto/updateProperty.dto';
import { PropertyQueryDto } from './dto/property-query.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
  ) {}

  private formatResponse(data: any, message?: string) {
    return {
      status: 'success',
      message: message || 'Operation successful',
      ...data,
    };
  }

  async findAll(query: PropertyQueryDto) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC',
      search,
      name,
      // minArea,
      // maxArea,
      // Add other filters here
    } = query;

    // Base query builder
    const queryBuilder = this.propertyRepo.createQueryBuilder('property');

    // Apply search (if provided)
    if (search) {
      queryBuilder.where(
        '(property.name LIKE :search OR property.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply individual filters
    if (name) {
      queryBuilder.andWhere('property.name LIKE :name', { name: `%${name}%` });
    }

    // if (minArea !== undefined && maxArea !== undefined) {
    //   queryBuilder.andWhere('property.area BETWEEN :minArea AND :maxArea', {
    //     minArea,
    //     maxArea,
    //   });
    // } else if (minArea !== undefined) {
    //   queryBuilder.andWhere('property.area >= :minArea', { minArea });
    // } else if (maxArea !== undefined) {
    //   queryBuilder.andWhere('property.area <= :maxArea', { maxArea });
    // }

    // Apply sorting
    queryBuilder.orderBy(`property.${sortBy}`, sortOrder);

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    return this.formatResponse(
      {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Properties retrieved successfully',
    );
  }

  async findOne(id: number) {
    const data = await this.propertyRepo.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return this.formatResponse(data, 'Property retrieved successfully');
  }

  async create(dto: CreatePropertyDto) {
    const data = await this.propertyRepo.save(dto);
    return this.formatResponse(data, 'Property created successfully');
  }

  async update(id: number, dto: updatePropertyDto) {
    const result = await this.propertyRepo.update({ id }, dto);

    if (result.affected === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    const data = await this.propertyRepo.findOne({ where: { id } });
    return this.formatResponse(data, 'Property updated successfully');
  }

  async delete(id: number) {
    const result = await this.propertyRepo.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return this.formatResponse(null, 'Property deleted successfully');
  }
}
