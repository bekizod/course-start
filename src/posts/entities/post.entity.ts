import { User } from 'src/entities/user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts,{
    cascade: true, 
    onDelete: 'CASCADE' 
  })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post,{
    onDelete: 'CASCADE' 
  })
  comments: Comment[];

  @OneToMany(() => Like, like => like.post, { cascade: true, onDelete: 'CASCADE' })
  likes: Like[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}