import {
  UploadedFile,
  Controller,
  Post,
  Version,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { LoadExcelFilesApiTags } from '../../constants';
import { LoadExcelFilesService } from '../services/load-excel-files.service';

@ApiTags(LoadExcelFilesApiTags.LoadExcelFiles)
@Controller('load-excel-files')
export class LoadExcelFilesController {
  constructor(private readonly loadExcelFilesService: LoadExcelFilesService) {}

  @Post('upload')
  @Version('1')
  @UseInterceptors(FileInterceptor('file'))
  uploadExcelFile(@UploadedFile() file) {
    return this.loadExcelFilesService.uploadExcelFile(file.buffer);
  }
}
