import { Identifer } from './Identifier';
import { v4 as uuidv4 } from 'uuid';

type IdentiferType = string | number;

export class UniqueEntityID extends Identifer<IdentiferType> {
  constructor(id?: IdentiferType) {
    super(id ? id : uuidv4());
  }
}
