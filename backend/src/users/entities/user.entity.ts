import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
  } from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity({name:'users'})
@ObjectType()
export class User {
 
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

 @Column({ unique: true })
 @Field({ nullable: true })
  username: string;

  @Column({ unique: true })
  @Field({ nullable: true })
  email: string;

  @Column()
  @Field({ nullable: true })
  password?: string;

  @OneToMany(() => Post, post => post.author)
  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @OneToOne(() => UserProfile, profile => profile.user)
  @Field(() => UserProfile, { nullable: true })
  profile?: UserProfile;

  // Computed field to get bio from profile
  @Field(() => String, { nullable: true })
  get bio(): string | undefined {
    return this.profile?.bio;
  }
} 