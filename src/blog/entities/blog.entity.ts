import { User } from "src/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}
