import * as Joi from '@hapi/joi';
import { mapExcelData, getSchema, validateErrorData } from './excel.helper';

describe('Your File Name', () => {
  describe('mapExcelData', () => {
    it('should return mapped data', () => {
      const data = [
        ['name', 'age'],
        ['Estaban', 30],
        ['Maria', 40],
      ];

      const result = mapExcelData(data);

      expect(result).toEqual([
        { name: 'Estaban', age: 30 },
        { name: 'Maria', age: 40 },
      ]);
    });
  });
  describe('getSchema', () => {
    it('should return a Joi schema for the given data', () => {
      const data = {
        name: 'Jeison',
        age: 26,
      };

      const schema = getSchema(data);

      expect(Joi.isSchema(schema)).toBe(true);
    });
  });

  describe('validateErrorData', () => {
    it('should return errors when data is invalid', () => {
      const data = [
        {
          column1: 1,
          column2: '2',
        },
        {
          column1: 'a',
          column2: 'b',
        },
      ];

      const result = validateErrorData(data);

      expect(result).toEqual([
        {
          message: 'Property column1 must be a number',
          value: 'a',
          row: 3,
          column: 'column1',
        },
      ]);
    });

    it('should return null when data is valid', () => {
      const data = [
        {
          column1: 1,
          column2: '2',
        },
        {
          column1: 3,
          column2: '4',
        },
      ];

      const result = validateErrorData(data);

      expect(result).toBeUndefined();
    });
  });
});
