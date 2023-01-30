export enum LoadExcelStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error',
}

export enum Events {
  ProcessExcelFileEvent = 'excel.process',
}
