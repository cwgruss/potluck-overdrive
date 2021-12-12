import { ValueObject } from '../ValueObject';

interface IndexProp {
  index: number;
}

export class Index extends ValueObject<IndexProp> {
  get value(): number {
    return this.props.index;
  }

  private constructor(props: IndexProp) {
    super(props);
  }

  public static create(props: IndexProp): Index {
    return new Index(props);
  }

  toHashCode(): string {
    const idx = this.props.index.toString();
    return `${idx}`;
  }

  toString(): string {
    return this.props.index.toString();
  }
}
