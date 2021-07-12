import { Identifier } from "./Identifier";
import { v4 as uuid } from "uuid";

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id: string | number) {
    super(id);
  }

  static createUUID(): UniqueEntityID {
    return new UniqueEntityID(uuid());
  }
}
