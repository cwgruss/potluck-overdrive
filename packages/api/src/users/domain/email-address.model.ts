import { ValueObject } from 'src/core/domain/ValueObject';
import { Result } from 'src/core/monads/result';

interface EmailAddressProps {
  emailAddress: string;
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  get value(): string {
    return this.props.emailAddress;
  }

  private constructor(props: EmailAddressProps) {
    super(props);
  }

  public static create(emailAddress: string): Result<EmailAddress, Error> {
    const email = new EmailAddress({ emailAddress });

    return Result.ok(email);
  }
}
