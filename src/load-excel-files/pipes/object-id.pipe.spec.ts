import { ObjectID } from 'bson';
import { NotFoundException } from '@nestjs/common';
import { ObjectIdPipe } from './object-id.pipe';

describe('object id parser', () => {
  let pipe: ObjectIdPipe;

  beforeEach(() => {
    pipe = new ObjectIdPipe();
  });

  it('should parse valid id strings', () => {
    const objectId = new ObjectID();
    const id = objectId.toHexString();

    const parsed = pipe.transform(id);

    expect(parsed).toBeInstanceOf(ObjectID);
    expect(objectId.equals(parsed)).toBe(true);
  });

  it('should throw error for invalid id strings', () => {
    const id = 'random-string';

    const transformInvalidId = () => pipe.transform(id);

    expect(transformInvalidId).toThrow(NotFoundException);
  });
});
