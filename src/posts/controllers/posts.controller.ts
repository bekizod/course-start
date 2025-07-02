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
  async findAll(): Promise<PostResponseDto[]> {
    return this.queryBus.execute(new GetAllPostsQuery());
  }

  @ApiOperation({ summary: 'Get a specific post' })
  @ApiResponse({
    status: 200,
    description: 'The post details',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostResponseDto> {
    return this.queryBus.execute(new GetPostQuery(parseInt(id)));
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
}
