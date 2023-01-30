import {
  UploadedFile,
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { LoadExcelFilesApiTags } from '../../constants';
import { LoadExcelFilesService } from '../services/load-excel-files.service';
import { ObjectIdPipe } from '../pipes/object-id.pipe';
import {
  UploadExcelFileApiDocs,
  GetExcelDataDocs,
} from '../apidocs/load-excel-files.decorator';

@ApiTags(LoadExcelFilesApiTags.LoadExcelFiles)
@Controller('load-excel-files')
export class LoadExcelFilesController {
  constructor(private readonly loadExcelFilesService: LoadExcelFilesService) {}

  @Post()
  @UploadExcelFileApiDocs()
  @UseInterceptors(FileInterceptor('file'))
  uploadExcelFile(@UploadedFile() file) {
    if (!file?.buffer) {
      throw new BadRequestException('File is required');
    }
    return this.loadExcelFilesService.uploadExcelFile(file.buffer);
  }

  @Get('/:requestId')
  @GetExcelDataDocs()
  getExcelData(@Param('requestId', ObjectIdPipe) requestId: string) {
    return this.loadExcelFilesService.getExcelData(requestId);
  }
}
