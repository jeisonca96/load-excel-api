import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { ObjectID } from 'bson';

@Injectable()
export class ObjectIdPipe implements PipeTransform<string, ObjectID> {
  transform(id: string) {
    if (!ObjectID.isValid(id)) {
      throw new NotFoundException('Request not found');
    }
    return new ObjectID(id);
  }
}
