import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { LoadExcel, LoadExcelDocument } from '../schemas/load-excel.schema';
import { ExcelService } from '../../core-services/services/excel.service';
import { Events, LoadExcelStatus } from '../constants';
import { ProcessExcelEvent } from '../events/process-excel.event';

@Injectable()
export class LoadExcelFilesListener {
  private readonly logger = new Logger(LoadExcelFilesListener.name);

  constructor(
    @InjectModel(LoadExcel.name)
    private readonly loadExcelModel: Model<LoadExcelDocument>,
    private readonly excelService: ExcelService,
  ) {}

  updateLoadExcel(requestId: string, data: LoadExcel) {
    this.logger.log('Update load excel', { requestId });
    return this.loadExcelModel.findByIdAndUpdate(requestId, data);
  }

  @OnEvent(Events.ProcessExcelFileEvent, { async: true })
  async handleProcessExcelFile(request: ProcessExcelEvent) {
    const { requestId, fileBuffer } = request;
    let status = LoadExcelStatus.PROCESSING;

    this.logger.debug('Processing excel file', { requestId });
    await this.updateLoadExcel(requestId, { status });

    const { errors, data, processTime } = await this.excelService.readExcel(
      fileBuffer,
    );

    if (errors) {
      status = LoadExcelStatus.ERROR;
    } else {
      status = LoadExcelStatus.DONE;
    }

    await this.updateLoadExcel(requestId, {
      status,
      errors,
      data,
      processTime,
      countRows: data?.length,
    });

    this.logger.debug('Processed excel file', { requestId });
  }
}
