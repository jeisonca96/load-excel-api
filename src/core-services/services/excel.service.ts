import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { mapExcelData, validateErrorData } from '../helpers/excel.helper';

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);

  async readExcel(file: Buffer): Promise<any> {
    this.logger.debug('Reading excel file');
    const start = new Date();

    const workbook = XLSX.read(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const dataJson = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const data = mapExcelData(dataJson);

    const errors = validateErrorData(data);

    const end = new Date();
    const processTime = end.getTime() - start.getTime();
    this.logger.debug('Excel file read', { processTime });

    if (errors) {
      return { errors, processTime };
    }

    return { data, processTime };
  }
}
