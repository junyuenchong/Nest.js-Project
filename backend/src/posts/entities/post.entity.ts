import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity({ name: 'posts' })
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  content: string;

  @ManyToOne(() => User, user => user.posts)
  @Field(() => User)
  author: User;

  @ManyToMany(() => Tag, tag => tag.posts, { cascade: true })
  @JoinTable({ name: 'post_tags' })
  @Field(() => [Tag])
  tags: Tag[];
} 