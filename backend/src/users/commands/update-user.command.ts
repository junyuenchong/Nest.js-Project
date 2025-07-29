import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly username?: string,
    public readonly password?: string,
    public readonly bio?: string,
    public readonly userId?: number,
  ) {}
} 