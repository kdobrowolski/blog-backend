import { Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(): string {
    return this.postsService.test();
  }

  @Post()
  create() {
    return this.postsService.createPost();
  }
}
