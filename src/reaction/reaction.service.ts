import { ConflictException, Injectable } from '@nestjs/common';
import { ReactionDto } from './dto/reaction.dto';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';

import { FileService } from 'src/file/file.service';
import { Post } from 'src/post/post.interface';
import { Reaction } from './reaction.inteface';

@Injectable()
export class ReactionService {

  constructor(
    @InjectKnex() readonly knex: Knex,
  ) {}

  // ADD REACTION

  async addReaction(id: number, reactionDto: ReactionDto): Promise<void> {

    const reaction = {
      userIp: reactionDto.userIp,
      postId: id,
      reactionType: reactionDto.reactionType,
    }

    await this.knex
      .table('reactions')
      .insert(reaction)
      .onConflict(['userIp', 'postId'])
      .merge();
  }

  // DELETE REACTION

  async deleteReaction(id: number, reactionDto: ReactionDto): Promise<void> {

    await this.knex
      .table<Reaction>('reactions')
      .where('userIp', reactionDto.userIp)
      .andWhere('postId', id)
      .del();
  }
}
