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

      expect(data).toEqual([
        { name: 'Esteban', age: 30 },
        { name: 'Maria', age: 25 },
      ]);
    });
  });
});
