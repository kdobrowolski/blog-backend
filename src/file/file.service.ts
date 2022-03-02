import { Injectable } from '@nestjs/common';

const fs = require('fs');

@Injectable()
export class FileService {

    async readFile(filePath: string): Promise<Record<string,any>> {
        try {
          const file = fs.readFileSync(filePath);
          return JSON.parse(file);
        } catch (err) {
          console.log(err);
        }
    }

    async editFile(fileUrl: string, data: any): Promise<void> {
        try {
            return fs.writeFile(
              fileUrl,
              JSON.stringify(data),
              function (err) {
                if (err) {
                  throw err;
                }
              },
            );
          } catch (err) {
            throw err;
        }
    }

    generateId() {
      return Math.random().toString(36);
    }

    async uploadFile(file: any): Promise<void> {
      const filename = `${this.generateId()}-${file.originalname}`;

      fs.writeFile(`./public/${filename}`, file.buffer, function () {
        return filename;
      });
    }

    async getUploadedFiles(): Promise<Record<string,any>> {
      let filesArray = [];
      fs.readdirSync('./public').forEach(file => {
        filesArray.push(file);
      });

      return filesArray;
    }

    async deleteUploadedFile(filename: string): Promise<void> {
      return fs.unlinkSync('./public/' + filename);
    }
}
