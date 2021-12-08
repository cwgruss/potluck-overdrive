import { Identifer } from './Identifier';
import uuid from 'uuid/v4';

type IdentiferType = string | number;

export class UniqueEntityID extends Identifer<IdentiferType> {
  constructor(id?: IdentiferType) {
    super(id ? id : uuid());
  }
}
