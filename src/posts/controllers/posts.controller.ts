/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Query,
  Patch,
  BadRequestException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreatePostCommand } from '../commands/create-post.command';
import { UpdatePostCommand } from '../commands/update-post.command';
import { DeletePostCommand } from '../commands/delete-post.command';
import { GetPostQuery } from '../queries/get-post.query';
import { GetAllPostsQuery } from '../queries/get-all-posts.query';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostResponseDto } from '../dto/post-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { GetMyPostsQuery } from '../queries/get-my-posts.query';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'List of posts',
    type: [PostResponseDto],
  })
  @Get()
  @UseGuards(JwtAuthGuard) // Protect the endpoint
  async findAll(
    @Req() req, // Get the request object to access user info
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<PaginatedResponseDto<PostResponseDto[]>> {
    // Get the authenticated user's ID from the request
    const userId = req.user?.id;

    return this.queryBus.execute(
      new GetAllPostsQuery(Number(page), Number(limit), search, userId),
    );
  }

  @ApiOperation({ summary: 'Get a specific post' })
  @ApiResponse({
    status: 200,
    description: 'The post details',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Get(':id')
  @UseGuards(JwtAuthGuard) // Optional: Remove if you want public access
  async findOne(@Param('id') id: string, @Req() req): Promise<PostResponseDto> {
    const userId = req.user?.id; // Get userId if authenticated
    return this.queryBus.execute(new GetPostQuery(parseInt(id), userId));
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created',
    type: PostResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('createPost')
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ): Promise<PostResponseDto> {
    return this.commandBus.execute(
      new CreatePostCommand(createPostDto, req.user.id),
    );
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You can only update your own posts',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ): Promise<PostResponseDto> {
    return this.commandBus.execute(
      new UpdatePostCommand(parseInt(id), updatePostDto, req.user.id),
    );
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 204,
    description: 'The post has been successfully deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You can only delete your own posts',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req): Promise<void> {
    await this.commandBus.execute(
      new DeletePostCommand(parseInt(id), req.user.id),
    );
  }

  @ApiOperation({ summary: 'Get my posts' })
  @ApiResponse({
    status: 200,
    description: 'List of my posts',
    type: [PostResponseDto],
  })
  @ApiOperation({ summary: 'Get my posts with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of my posts',
    type: PaginatedResponseDto<PostResponseDto[]>,
  })
  @ApiOperation({ summary: 'Get my posts with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of my posts',
    type: PaginatedResponseDto<PostResponseDto[]>,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyPosts(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
  ): Promise<PaginatedResponseDto<PostResponseDto[]>> {
    // Ensure user ID exists and is valid
    if (!req.user?.id || isNaN(Number(req.user.id))) {
      throw new BadRequestException('Invalid user ID');
    }

    const userId = Number(req.user.id);

    // Log the query parameters
    console.log('Executing GetMyPostsQuery with:', {
      userId,
      page,
      limit,
      search,
    });

    return this.queryBus.execute(
      new GetMyPostsQuery(userId, page, limit, search),
    );
  }
}
