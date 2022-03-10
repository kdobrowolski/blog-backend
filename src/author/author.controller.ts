import { Body, Get, UseGuards } from '@nestjs/common';
import { Controller, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileService } from 'src/file/file.service';
import { AuthorDto } from './dto/author.dto';

@Controller('author')
export class AuthorController {

    constructor(
        private fileService: FileService
    ) {}

    @Get('')
    async getAboutMe(): Promise<Record<string,any>> {
        const content = await this.fileService.readFile('./json/aboutMe.json');
    
        return content;
    }

    @UseGuards(JwtAuthGuard)
    @Put('')
    async editAboutMe(@Body() body: AuthorDto): Promise<any> {
        return this.fileService.editFile('./json/aboutMe.json', body);
    }
}
