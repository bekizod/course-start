import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentResponseDto } from '../dto/comment-response.dto';
import { CreateCommentCommand } from '../commands/create-comment.command';
import { GetPostCommentsQuery } from '../queries/get-post-comments.query';
import { DeleteCommentCommand } from '../commands/delete-comment.command';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({
    status: 200,
    description: 'List of comments',
    type: [CommentResponseDto],
  })
  @Get()
  async getComments(
    @Param('postId') postId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponseDto<CommentResponseDto[]>> {
    return this.queryBus.execute(
      new GetPostCommentsQuery(parseInt(postId), Number(page), Number(limit)),
    );
  }

  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully added',
    type: CommentResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ): Promise<CommentResponseDto> {
    return this.commandBus.execute(
      new CreateCommentCommand(parseInt(postId), createCommentDto, req.user.id),
    );
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 204,
    description: 'The comment has been successfully deleted',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: string, @Req() req): Promise<void> {
    // Note: You might want to add authorization to check if the user is the author of the comment
    // This is a simplified version
    await this.commandBus.execute(
      new DeleteCommentCommand(parseInt(id), req.user.id),
    );
  }
}
