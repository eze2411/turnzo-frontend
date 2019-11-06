import { Deserializable } from './Deserializable.model';

export class User implements Deserializable {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  role: string;
  email: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
