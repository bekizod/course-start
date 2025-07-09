import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { BlogResponse } from './dto/blog-response.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseFormat } from '../common/utils/response.util';
import { BlogQueryParamsDto } from './dto/blog-query-params.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}
 
  async create(body: CreateBlogDto, author: User) {
    const blog = this.blogRepository.create({
      ...body,
      author
    });

    const savedBlog = await this.blogRepository.save(blog);
    const blogResponse = plainToInstance(BlogResponse, savedBlog, {
      excludeExtraneousValues: true
    });

    return ResponseFormat.success('Blog created successfully', { data: blogResponse });
  }

  async findAll(
  queryParams: BlogQueryParamsDto
): Promise<ResponseFormat<BlogResponse[]>> {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
    authorId
  } = queryParams;

  const queryBuilder = this.blogRepository
    .createQueryBuilder('blog')
    .leftJoinAndSelect('blog.author', 'author')
    .leftJoin('blog.comments', 'comments')
    .loadRelationCountAndMap('blog.totalComments', 'blog.comments')
    .take(limit)
    .skip((page - 1) * limit)
    .orderBy(`blog.${sortBy}`, sortOrder);

  if (authorId) {
    queryBuilder.andWhere('author.id = :authorId', { authorId });
  }

  if (search) {
    queryBuilder.andWhere(
      '(blog.title LIKE :search OR author.userName LIKE :search)',
      { search: `%${search}%` }
    );
  }

  const [blogs, total] = await queryBuilder.getManyAndCount();
  const blogsResponse = plainToInstance(BlogResponse, blogs, {
    excludeExtraneousValues: true
  });

  return ResponseFormat.paginated(
    'Blogs retrieved successfully',
    blogsResponse,
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  );
}
  async findOne(id: number): Promise<ResponseFormat<BlogResponse>> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['author']
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    const blogResponse = plainToInstance(BlogResponse, blog, {
      excludeExtraneousValues: true
    });

    return ResponseFormat.success('Blog retrieved successfully', { data: blogResponse });
  }

  async findMyBlogs(authorId: number): Promise<ResponseFormat<BlogResponse[]>> {
    const blogs = await this.blogRepository.find({
      where: { author: { id: authorId } },
      relations: ['author']
    });

    if (!blogs || blogs.length === 0) {
      throw new NotFoundException(`No blogs found for user ${authorId}`);
    }

    const blogsResponse = plainToInstance(BlogResponse, blogs, {
      excludeExtraneousValues: true
    });

    return ResponseFormat.success('User blogs retrieved successfully', { data: blogsResponse });
  }

  async update(
    id: number,
    updateBlogDto: UpdateBlogDto,
    currentUser: User
  ): Promise<ResponseFormat<BlogResponse>> {
    const blog = await this.blogRepository.findOne({
      where: { id, author: { id: currentUser.id } },
      relations: ['author']
    });

    if (!blog) {
      throw new NotFoundException(
        `Blog not found or you don't have permission to update it`
      );
    }

    Object.assign(blog, updateBlogDto);
    const updatedBlog = await this.blogRepository.save(blog);
    const blogResponse = plainToInstance(BlogResponse, updatedBlog, {
      excludeExtraneousValues: true
    });

    return ResponseFormat.success('Blog updated successfully', { data: blogResponse });
  }

  async remove(id: number, currentUser: User): Promise<ResponseFormat<void>> {
    const blog = await this.blogRepository.findOne({
      where: { id, author: { id: currentUser.id } }
    });

    if (!blog) {
      throw new NotFoundException(
        `Blog not found or you don't have permission to delete it`
      );
    }

    await this.blogRepository.remove(blog);
    return ResponseFormat.success('Blog deleted successfully');
  }

  findTest(): ResponseFormat<string> {
    return ResponseFormat.success('Test successful', { data: 'hi there this is test' });
  }
}