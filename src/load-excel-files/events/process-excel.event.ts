export class ProcessExcelEvent {
  requestId: string;
  fileBuffer: Buffer;

  constructor(requestId: string, fileBuffer: Buffer) {
    this.requestId = requestId;
    this.fileBuffer = fileBuffer;
  }
}
