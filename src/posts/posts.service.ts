import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getAllPosts(): string {
    return 'work';
  }

  createPost() {

  }
}
