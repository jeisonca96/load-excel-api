import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoadExcelFilesController } from './controllers/load-excel-files.controller';
import { LoadExcelFilesService } from './services/load-excel-files.service';
import { LoadExcelFilesListener } from './listeners/load-excel-files.listener';
import { CoreServicesModule } from '../core-services/core-services.module';
import { LoadExcel, LoadExcelSchema } from './schemas/load-excel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LoadExcel.name,
        schema: LoadExcelSchema,
      },
    ]),
    CoreServicesModule,
  ],
  controllers: [LoadExcelFilesController],
  providers: [LoadExcelFilesService, LoadExcelFilesListener],
})
export class LoadExcelFilesModule {}
