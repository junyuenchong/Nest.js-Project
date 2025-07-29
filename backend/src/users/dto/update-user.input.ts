import { InputType, Field, Int } from '@nestjs/graphql';
import { Length, IsOptional, Matches, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  @IsInt({ message: 'User ID must be an integer' })
  @IsPositive({ message: 'User ID must be positive' })
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Username must not be empty' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Username can only contain letters, numbers, underscores, and hyphens',
  })
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Password must not be empty' })
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;
} 