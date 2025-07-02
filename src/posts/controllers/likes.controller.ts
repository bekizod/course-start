/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CheckPostLikeQuery } from '../queries/check-post-like.query';
import { LikeResponseDto } from '../dto/like-response.dto';
import { LikePostCommand } from '../commands/like-post.command';
import { UnlikePostCommand } from '../commands/unlike-post.command';


@ApiTags('Likes')
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Check if the current user liked a post' })
  @ApiResponse({ status: 200, description: 'Like status', type: Boolean })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkLike(
    @Param('postId') postId: string,
    @Req() req,
  ): Promise<boolean> {
    return this.queryBus.execute(
      new CheckPostLikeQuery(parseInt(postId), req.user.id),
    );
  }

  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 201, description: 'The post has been liked', type: LikeResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async likePost(
    @Param('postId') postId: string,
    @Req() req,
  ): Promise<LikeResponseDto> {
    return this.commandBus.execute(
      new LikePostCommand(parseInt(postId), req.user.id),
    );
  }

  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({ status: 204, description: 'The post has been unliked' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async unlikePost(
    @Param('postId') postId: string,
    @Req() req,
  ): Promise<void> {
    await this.commandBus.execute(
      new UnlikePostCommand(parseInt(postId), req.user.id),
    );
  }
}