import { Body, Get } from '@nestjs/common';
import { Controller, Put } from '@nestjs/common';
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

    @Put('')
    async editAboutMe(@Body() body: AuthorDto): Promise<any> {
        const data = {
            content: body.content
        }

        return this.fileService.editFile('./json/aboutMe.json', data);
    }
}
