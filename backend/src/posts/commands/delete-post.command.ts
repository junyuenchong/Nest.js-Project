import { ICommand } from '@nestjs/cqrs';

export class DeletePostCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly userId?: number,
  ) {}
} 