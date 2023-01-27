import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);

  async readExcel(file: Buffer): Promise<any> {
    const workbook = XLSX.read(file);
    const sheetName = workbook.SheetNames[0];
    this.logger.log('Reading excel file', { sheetName });

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
  }
}
