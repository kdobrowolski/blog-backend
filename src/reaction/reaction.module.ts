import { forwardRef, Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    forwardRef(() => FileModule),
  ],
  controllers: [ReactionController],
  providers: [ReactionService],
  exports: [],
})
export class ReactionModule {}
