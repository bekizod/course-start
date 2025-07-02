import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Post } from '../entities/post.entity';
import { User } from 'src/entities/user.entity';


@Injectable()
export class CommentTypeOrmRepository implements CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Add this method to the existing implementation
async findById(id: number): Promise<Comment | null> {
  return this.commentRepository.findOne({
    where: { id },
    relations: ['author'],
  });
}

  async create(commentDto: CreateCommentDto, authorId: number, postId: number): Promise<Comment> {
    const author = await this.userRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new Error('Author not found');
    }

    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new Error('Post not found');
    }

    const comment = this.commentRepository.create({
      ...commentDto,
      author,
      post,
    });

    return this.commentRepository.save(comment);
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
}