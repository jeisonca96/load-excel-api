import {
  UploadedFile,
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { LoadExcelFilesApiTags } from '../../constants';
import { LoadExcelFilesService } from '../services/load-excel-files.service';
import { ObjectIdPipe } from '../pipes/object-id.pipe';

@ApiTags(LoadExcelFilesApiTags.LoadExcelFiles)
@Controller('load-excel-files')
export class LoadExcelFilesController {
  constructor(private readonly loadExcelFilesService: LoadExcelFilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadExcelFile(@UploadedFile() file) {
    return this.loadExcelFilesService.uploadExcelFile(file.buffer);
  }

  @Get('/:requestId')
  getExcelData(@Param('requestId', ObjectIdPipe) requestId: string) {
    return this.loadExcelFilesService.getExcelData(requestId);
  }
}
