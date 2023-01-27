import { Module } from '@nestjs/common';
import { ExcelService } from './services/excel.service';

@Module({
  exports: [ExcelService],
})
export class CoreServicesModule {}
