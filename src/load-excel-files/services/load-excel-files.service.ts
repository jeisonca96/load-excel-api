import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { LoadExcel, LoadExcelDocument } from '../schemas/load-excel.schema';
import { ProcessExcelEvent } from '../events/process-excel.event';
import { Events, LoadExcelStatus } from '../constants';
import { ExcelDataDto } from '../dtos/excel-data.dto';

@Injectable()
export class LoadExcelFilesService {
  private readonly logger = new Logger(LoadExcelFilesService.name);

  constructor(
    @InjectModel(LoadExcel.name)
    private readonly loadExcelModel: Model<LoadExcelDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async uploadExcelFile(fileBuffer: Buffer) {
    this.logger.debug('Uploading excel file');

    const createdLoadExcel = await this.loadExcelModel.create({
      status: LoadExcelStatus.PENDING,
    });
    const requestId = createdLoadExcel._id;

    await this.eventEmitter.emit(
      Events.ProcessExcelFileEvent,
      new ProcessExcelEvent(requestId, fileBuffer),
    );

    return { requestId };
  }

  async findLoadExcel(requestId: string): Promise<LoadExcelDocument> {
    const loadedExcel = await this.loadExcelModel.findById(requestId);

    if (!loadedExcel) {
      throw new NotFoundException('Load excel not found');
    }
    return loadedExcel;
  }

  async getExcelData(requestId: string): Promise<ExcelDataDto> {
    this.logger.log('Get excel data for', requestId);

    const loadedExcel = await this.findLoadExcel(requestId);

    return {
      requestId,
      status: loadedExcel.status,
      errors: loadedExcel.errors,
      countRows: loadedExcel.countRows,
      data: loadedExcel.data,
      processTime: `${loadedExcel.processTime}ms`,
    };
  }
}
