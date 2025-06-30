import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from './createProperty.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
  ) {}
  async findAll() {
    return [
      {
        id: 1,
        name: 'Property 1',
        description: 'Description of Property 1',
      },
      {
        id: 2,
        name: 'Property 2',
        description: 'Description of Property 2',
      },
    ];
  }

  async findOne() {}

  async create(dto: CreatePropertyDto) {
    return await this.propertyRepo.save(dto);
  }

  async update() {}

  async delete() {}
}
