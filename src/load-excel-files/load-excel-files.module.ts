import { Module } from '@nestjs/common';
import { LoadExcelFilesController } from './controllers/load-excel-files.controller';
import { LoadExcelFilesService } from './services/load-excel-files.service';
import { CoreServicesModule } from '../core-services/core-services.module';

@Module({
  imports: [CoreServicesModule],
  controllers: [LoadExcelFilesController],
  providers: [LoadExcelFilesService],
})
export class LoadExcelFilesModule {}
