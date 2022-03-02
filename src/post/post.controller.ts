import { Body, Controller, Get, Param, Post, Delete, Put, UseGuards, ParseIntPipe } from "@nestjs/common";
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts(): Promise<Record<string,any>> {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Record<string,any>> {
    return this.postService.findOnePost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() postDto: PostDto): Promise<any> {
    return this.postService.createPost(postDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): any {
    return this.postService.deletePost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() postDto: PostDto,
    ): any
  {
    return this.postService.editPost(id, postDto);
  }
}
