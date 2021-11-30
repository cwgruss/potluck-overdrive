import { ValueObject } from "../../util";

interface RoleProps {
  role: string;
}

export class UserRole extends ValueObject<RoleProps> {
  get role(): string {
    return this.props.role;
  }

  constructor(props: RoleProps) {
    super(props);
  }

  fromJSON(json: any): this {
    throw new Error("Method not implemented.");
  }
  fromString(str: string): this {
    throw new Error("Method not implemented.");
  }
  toJSON() {
    throw new Error("Method not implemented.");
  }
  toString(): string {
    throw new Error("Method not implemented.");
  }
}
