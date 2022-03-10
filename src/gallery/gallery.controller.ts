import { Body, Controller, Delete, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileDto } from 'src/file/dto/file.dto';
import { FileService } from 'src/file/file.service';

@Controller('gallery')
export class GalleryController {

    constructor(private fileService: FileService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUploadedFiles(): Promise<Record<string,any>> {
        const files = await this.fileService.getUploadedFiles();

        return { files }
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<void> {
        await this.fileService.uploadFile(file);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteUploadedFile(@Body() body: FileDto): Promise<void> {
        await this.fileService.deleteUploadedFile(body.filename);
    }
}
