import { Injectable } from '@nestjs/common';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { CommentDto } from './dto/comments.dto';
import { Comment } from './comment.inteface';

@Injectable()
export class CommentService {

    constructor(@InjectKnex() readonly knex: Knex) {}

    // CREATE COMMENT

    async createComment(commentDto: CommentDto, id: number): Promise<void> {
        const comment = {
            fullname: commentDto.fullname,
            content: commentDto.content,
            postId: id,
            date: new Date(),
        }

        await this.knex
            .table<Comment>('comments').insert(comment);
    }

    // DELETE COMMENT

    async deleteComment(id: number): Promise<void> {
        await this.knex.table<Comment>('comments').where('id', id).del();
    }

    // GET COMMENT

    async getComments(id: number): Promise<Record<string,any>> {
        const comments = await this.knex.table<Comment>('comments').where('post_id', id);
    
        return {
            comments, 
        }
    }
}
