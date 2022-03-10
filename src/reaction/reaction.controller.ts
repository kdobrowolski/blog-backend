import { Body, Controller, Param, Post, Delete, Request, Get, ParseIntPipe } from "@nestjs/common";
import { ReactionDto } from './dto/reaction.dto';
import { ReactionService } from './reaction.service';

@Controller('reaction')
export class ReactionController {

  constructor(private readonly reactionService: ReactionService) {
  }

  @Post(':id')
  add(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() reactionDto: ReactionDto): any {
    return this.reactionService.addReaction(id, reactionDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Body() reactionDto: ReactionDto): any {
    return this.reactionService.deleteReaction(id, reactionDto);
  }

  @Get(':id/:ip')
  getUserReaction(@Param('id', ParseIntPipe) id: number, @Param('ip') ip: string) {
    return this.reactionService.getUserReaction(id, ip);
  }
}
