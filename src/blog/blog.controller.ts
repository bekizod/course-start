import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, UnauthorizedException, BadRequestException, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { updatePropertyDto } from 'src/property/dto/updateProperty.dto';
import { BlogQueryParamsDto } from './dto/blog-query-params.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogsService: BlogService) {}
 @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body() body:CreateBlogDto, @Req() req) {
    return this.blogsService.create(body,req.user.id)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
  @Query() queryParams: BlogQueryParamsDto
) {
  return this.blogsService.findAll(queryParams);
}

  @Get(':id')
  async getBlog(@Param('id') id: string) {
    const blogId = Number(id);
    if (isNaN(blogId)) {
      throw new BadRequestException('Invalid blog ID');
    }
    return this.blogsService.findOne(blogId);
  }

  @Get('my/myBlogs')
@UseGuards(JwtAuthGuard)
async findMyBlogs(@Req() req) {
  // Make sure req.user exists and has an id property

  return this.blogsService.findMyBlogs(req.user.id);
}



@Patch(':id')
@UseGuards(JwtAuthGuard)
async update(
  @Param('id') id: string,
  @Body() updateBlogDto: UpdateBlogDto,
  @Request() req
) {
  return this.blogsService.update(+id, updateBlogDto, req.user.id);
}


@Delete(':id')
@UseGuards(JwtAuthGuard)
delete(@Param('id') id:string, @Req() req){
  return this.blogsService.remove(+id,req.user.id)
}

}
