import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../domain/events/userCreated.event';

@EventsHandler(UserCreatedEvent)
export class AfterUserCreatedHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor() {}

  handle(command: UserCreatedEvent) {}
}
