import {
    FileValidator, 
  } from '@nestjs/common';
  
  export class ImageFileTypeValidator extends FileValidator {
    constructor(private readonly allowedTypes: RegExp) {
      super({});
    }
  
    isValid(file?: Express.Multer.File): boolean {
      return !!file && this.allowedTypes.test(file.mimetype);
    }
  
    buildErrorMessage(file: Express.Multer.File): string {
      return `Validation failed ss(current file type is ${file.mimetype}, expected type to match ${this.allowedTypes})`;
    }
  }
  