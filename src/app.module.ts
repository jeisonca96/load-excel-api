import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { LoadExcelFilesModule } from './load-excel-files/load-excel-files.module';

@Module({
  imports: [HealthModule, LoadExcelFilesModule],
  providers: [],
})
export class AppModule {}
