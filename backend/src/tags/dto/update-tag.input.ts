import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, Length, IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateTagInput {
  @Field(() => Int)
  @IsInt({ message: 'Tag ID must be an integer' })
  @IsPositive({ message: 'Tag ID must be positive' })
  id: number;

  @Field()
  @IsString({ message: 'Tag name must be a string' })
  @IsNotEmpty({ message: 'Tag name must not be empty' })
  @Length(2, 50, { message: 'Tag name must be between 2 and 50 characters' })
  name: string;
} 