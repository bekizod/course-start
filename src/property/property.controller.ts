/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, Headers, Param, ParseBoolPipe, ParseIntPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreatePropertyDto } from './createProperty.dto';
import { IdParamDto } from './idParam.dto';
import { HeadersDto } from './dto/headers.dto';
import { PropertyService } from './property.service';


@Controller('property')
export class PropertyController {
    constructor(private propertyService: PropertyService) {}
    @Get()
    findAll() {
        return this.propertyService.findAll();
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
    update(@Param() param: IdParamDto, @Body() body: CreatePropertyDto, @Headers("host") header:HeadersDto) {
        return header;
    }
}