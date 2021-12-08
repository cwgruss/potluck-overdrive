import { Result } from 'src/core/monads/result';
import { ValueObject } from '../ValueObject';

interface LabelProp {
  label: string;
}

export class Label extends ValueObject<LabelProp> {
  get value(): string {
    return this.props.label;
  }

  get keyValue(): string {
    return this._labelKey;
  }
  protected _labelKey: string;

  private constructor(props: LabelProp) {
    super(props);
    this._labelKey = this._createKeyFromLabel(props.label);
  }

  public static create(props: LabelProp): Result<Label, Error> {
    if (!props.label) {
      return Result.fail(new Error('A label value must be provided.'));
    }
    let label = props.label.trim();
    return Result.ok(new Label({ label }));
  }

  private _createKeyFromLabel(label: string): string {
    // 1. Remove starting and trailing whitespace
    let trimmedInput = label.trim();

    // 2. Replace all spaces with underscores
    trimmedInput = trimmedInput.replace(/\s/g, '_');
    // 3. Remove characters special to JSON
    trimmedInput = trimmedInput.replace(/[\b\f\n\r\t\"\\:]/, '');
    // 4. Force to uppercase
    return trimmedInput.toUpperCase();
  }
}
