import { ICommand } from '@nestjs/cqrs';

export class CreateTagCommand implements ICommand {
  constructor(public readonly name: string) {}
} 