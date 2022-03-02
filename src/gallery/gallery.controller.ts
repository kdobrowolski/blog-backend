import { Body, Controller, Delete, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from 'src/file/dto/file.dto';
import { FileService } from 'src/file/file.service';

@Controller('gallery')
export class GalleryController {

    constructor(private fileService: FileService) {}

    @Get()
    async getUploadedFiles(): Promise<Record<string,any>> {
        const files = await this.fileService.getUploadedFiles();

        return { files }
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<void> {
        await this.fileService.uploadFile(file);
    }

    @Delete()
    async deleteUploadedFile(@Body() body: FileDto): Promise<void> {
        await this.fileService.deleteUploadedFile(body.filename);
    }
}
