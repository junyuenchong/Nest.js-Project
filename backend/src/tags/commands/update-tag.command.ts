import { ICommand } from '@nestjs/cqrs';

export class UpdateTagCommand implements ICommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}
} 