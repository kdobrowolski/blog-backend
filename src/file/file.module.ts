import { forwardRef, Global, Module } from '@nestjs/common';
import { GalleryModule } from 'src/gallery/gallery.module';
import { PostModule } from 'src/post/post.module';
import { ReactionModule } from 'src/reaction/reaction.module';
import { FileService } from './file.service';

@Global()
@Module({
    imports: [
        forwardRef(() => ReactionModule),
        forwardRef(() => PostModule),
        forwardRef(() => GalleryModule),
    ],
    providers: [FileService],
    exports: [FileService]
})
export class FileModule {
}
