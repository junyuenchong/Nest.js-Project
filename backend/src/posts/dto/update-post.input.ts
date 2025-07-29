import { InputType, Field, Int } from '@nestjs/graphql';
import { Length, IsOptional, IsNotEmpty, IsArray, ArrayNotEmpty, IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  @IsInt({ message: 'Post ID must be an integer' })
  @IsPositive({ message: 'Post ID must be positive' })
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Title must not be null or empty' })
  @Length(5, 100, { message: 'Title must be between 5 and 100 characters' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Content must not be null or empty' })
  @Length(10, 5000, { message: 'Content must be between 10 and 5000 characters' })
  content?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'tagIds must be an array' })
  @ArrayNotEmpty({ message: 'tagIds must not be null or empty' })
  @IsNotEmpty({ each: true, message: 'Each tagId must not be null' })
  @IsInt({ each: true, message: 'Each tagId must be an integer' })
  tagIds?: number[];
} 