import { ValueObject } from "../../util";

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

  fromJSON(json: any): this {
    throw new Error("Method not implemented.");
  }

  fromString(str: string): this {
    throw new Error("Method not implemented.");
  }

  toJSON() {
    return {
      value: this.value,
    };
  }

  toString(): string {
    throw new Error("Method not implemented.");
  }
}
