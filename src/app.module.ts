import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppConfig } from './config/app.config';
import { HealthModule } from './health/health.module';
import { LoadExcelFilesModule } from './load-excel-files/load-excel-files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASES_MONGO_URL),
    EventEmitterModule.forRoot(),
    HealthModule,
    LoadExcelFilesModule,
  ],
  providers: [AppConfig],
})
export class AppModule {}
