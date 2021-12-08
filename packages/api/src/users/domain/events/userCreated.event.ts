import { UniqueEntityID } from 'src/core/domain/UniqueEntityID';

export class UserCreatedEvent {
  constructor(public readonly userId: UniqueEntityID) {}
}
