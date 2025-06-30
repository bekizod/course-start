// src/property/property.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './createProperty.dto';
import { updatePropertyDto } from './dto/updateProperty.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
  ) {}

  private formatResponse(data: any, message?: string) {
    return {
      status: 'success',
      message: message || 'Operation successful',
      data,
    };
  }

  async findAll() {
    const data = await this.propertyRepo.find();
    return this.formatResponse(data, 'Properties retrieved successfully');
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