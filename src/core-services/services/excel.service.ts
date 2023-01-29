import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { mapExcelData, validateErrorData } from '../helpers/excel.helper';

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);

  async readExcel(file: Buffer): Promise<any> {
    const workbook = XLSX.read(file);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const output = mapExcelData(data);

    const errors = validateErrorData(output);
    if (errors) {
      return errors;
    }

    return output;
  }
}
