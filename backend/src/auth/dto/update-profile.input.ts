import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';

@InputType()
export class UpdateProfileInput {
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
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Password must not be empty' })
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'Bio must not be empty' })
  @Length(0, 500, { message: 'Bio must be between 0 and 500 characters' })
  bio?: string;
} 