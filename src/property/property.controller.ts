/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, Headers, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, ValidationPipe, Delete } from '@nestjs/common';
import { CreatePropertyDto } from './createProperty.dto';
import { IdParamDto } from './idParam.dto';
import { HeadersDto } from './dto/headers.dto';
import { PropertyService } from './property.service';
import { updatePropertyDto } from './dto/updateProperty.dto';


@Controller('property')
export class PropertyController {
    constructor(private propertyService: PropertyService) {}
    @Get()
    findAll() {
        return this.propertyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id) {
        return this.propertyService.findOne(id)
    }
    @Post()
    @HttpCode(202) // Optional: Set the status code for the response
    
    create(@Body() body:CreatePropertyDto){
        return this.propertyService.create(body);
    }

    // @Get(":id") 
    @Get(":id/:slug")
    getById(@Param("id") id:string, @Param('slug') slug:string){
        return `This action returns a #${id} property with slug ${slug}`;
    }   

      @Get(":id")
      @HttpCode(200)
      getByIdva(@Param("id", ParseIntPipe) id, @Query('sort', ParseBoolPipe) sort
      ){
       console.log(typeof sort);
        return `This action returns a #${id} property`;
        }


    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: updatePropertyDto) {
        console.log('Received update request for property ID:', id, 'with body:', body);
        return this.propertyService.update(id, body);
    }
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id) {
        return this.propertyService.delete(id)
    }
} 