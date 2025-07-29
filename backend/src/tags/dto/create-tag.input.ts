import { InputType, Field } from '@nestjs/graphql';
import { Length, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTagInput {
  @Field()
  @IsNotEmpty({ message: 'Tag name must not be null or empty' })
  @Length(2, 50, { message: 'Tag name must be between 2 and 50 characters' })
  name: string;
} 