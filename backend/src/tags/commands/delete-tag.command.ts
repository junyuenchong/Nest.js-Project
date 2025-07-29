import { ICommand } from '@nestjs/cqrs';
 
export class DeleteTagCommand implements ICommand {
  constructor(
    public readonly id: number,
  ) {}
} 