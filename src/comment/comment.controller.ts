import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { throws } from 'assert/strict';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comments.dto';

@Controller('comment')
export class CommentController {

    constructor(private readonly commentService: CommentService) {}

    @Post(':id')
    createComment(@Param('id', ParseIntPipe) id: number, @Body() commentDto: CommentDto): any {
        return this.commentService.createComment(commentDto, id);
    }

    @Delete(':id')
    deleteComment(@Param('id', ParseIntPipe) id: number): any {
        return this.commentService.deleteComment(id);
    }

    @Get(':id')
    getComments(@Param('id', ParseIntPipe) id: number): any {
        return this.commentService.getComments(id);
    }
}
