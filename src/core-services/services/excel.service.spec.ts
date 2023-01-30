import { ExcelService } from './excel.service';
import * as XLSX from 'xlsx';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(() => {
    service = new ExcelService();
  });

  describe('readExcel', () => {
    it('should return an array of JSON objects', async () => {
      const sheet = XLSX.utils.aoa_to_sheet([
        ['name', 'age'],
        ['Esteban', 30],
        ['Maria', 25],
      ]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const data = await service.readExcel(buffer);

      expect(data).toEqual({
        data: [
          { name: 'Esteban', age: 30 },
          { name: 'Maria', age: 25 },
        ],
        processTime: expect.any(Number),
      });
    });

    it('should return an array of errors', async () => {
      const sheet = XLSX.utils.aoa_to_sheet([
        ['name', 'age'],
        ['Esteban', 30],
        ['Maria', 'any string'],
      ]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const data = await service.readExcel(buffer);

      expect(data).toEqual({
        errors: [
          {
            message: 'Property age must be a number',
            value: 'any string',
            row: 3,
            column: 'age',
          },
        ],
        processTime: expect.any(Number),
      });
    });
  });
});
