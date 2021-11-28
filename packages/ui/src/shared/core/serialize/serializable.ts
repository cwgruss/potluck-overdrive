export abstract class Serializable {
  static fromJSON<C extends Serializable>(this: new () => C, json: any): C {
    return new this().fromJSON(json);
  }

  abstract fromJSON(json: any): this;

  static fromString<C extends Serializable>(this: new () => C, str: string): C {
    return new this().fromString(str);
  }

  abstract fromString(str: string): this;

  abstract toJSON(): any;

  abstract toString(): string;
}
