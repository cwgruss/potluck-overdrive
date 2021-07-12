import { ValueObject } from "../util";

interface EmailAddressProps {
  value: string | null;
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  get value(): string | null {
    return this.props.value;
  }

  private constructor(props: EmailAddressProps) {
    super(props);
  }

  public static create(emailAddress: string | null) {
    return new EmailAddress({ value: emailAddress });
  }
}
