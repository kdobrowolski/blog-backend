import { forwardRef, Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { GalleryController } from './gallery.controller';

@Module({
  imports: [
    forwardRef(() => FileModule),
  ],
  controllers: [GalleryController]
})
export class GalleryModule {}
