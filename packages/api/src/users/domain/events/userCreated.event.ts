import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';

export class UserCreatedEvent {
  constructor(public readonly userId: UniqueEntityID) {}
}
