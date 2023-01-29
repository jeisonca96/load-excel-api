import { Injectable, Logger } from '@nestjs/common';
import { ExcelService } from '../../core-services/services/excel.service';

@Injectable()
export class LoadExcelFilesService {
  private readonly logger = new Logger(LoadExcelFilesService.name);

  constructor(private readonly excelService: ExcelService) {}

  async uploadExcelFile(fileBuffer: Buffer) {
    this.logger.debug('Uploading excel file');

    const data = await this.excelService.readExcel(fileBuffer);
    console.log(data);

    return { message: 'Excel file uploaded' };
  }
}
