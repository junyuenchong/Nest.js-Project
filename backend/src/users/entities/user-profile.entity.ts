import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_profiles' })
@ObjectType()
export class UserProfile {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bio?: string;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'userId' })
  @Field(() => User, { nullable: true })
  user: User;
} 