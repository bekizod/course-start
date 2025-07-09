import { Comment } from "src/comment/entities/comment.entity";
import { User } from "src/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Blog {
@PrimaryGeneratedColumn()
id:number;

@Column()
title:string;

@CreateDateColumn()
createdAt:Date;


@ManyToOne(()=>User, (user)=> user.blogs )
author:User

@OneToMany(() => Comment, (comment) => comment.blog)
comments: Comment[];
}
