import { ICommand } from '@nestjs/cqrs';

export class DeleteUserCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly userId?: number,
  ) {}
} 