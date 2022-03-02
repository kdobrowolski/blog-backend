import { forwardRef, Module } from "@nestjs/common";
import { FileModule } from "src/file/file.module";
import { AuthModule } from "../auth/auth.module";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
  ],
  controllers: [
    PostController
  ],
  providers: [
    PostService
  ],
  exports: [],
})
export class PostModule {}
