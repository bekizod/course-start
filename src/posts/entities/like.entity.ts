/* eslint-disable prettier/prettier */

import { User } from 'src/entities/user.entity';
import { Post } from './post.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['user', 'post'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Post, post => post.likes, { onDelete: 'CASCADE' })
  post: Post;
}