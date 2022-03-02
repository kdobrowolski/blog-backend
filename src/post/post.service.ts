import { ConflictException, Injectable } from "@nestjs/common";
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { PostDto } from './dto/post.dto';
import { Post } from "./post.interface";
import { Reaction } from "src/reaction/reaction.inteface";

@Injectable()
export class PostService {
  constructor(
    @InjectKnex() readonly knex: Knex
  ) {}

  // GET ALL POSTS

  async getAllPosts(): Promise<Record<string,any>> {
    const posts = await this.knex.table<Post>('posts');

    return { posts };
  }

  // FIND ONE POST

  async findOnePost(id: number): Promise<Record<string,any>> {
    const post = await this.knex
        .table<Post>('posts')
        .where('id', id);

    const reactions = await this.knex.table<Reaction>('reactions')
        .select(['reactionType', this.knex.raw('COUNT(reactionType) as count')])
        .where('postId', id)
        .groupBy('reactionType');
        
    return { post: {
      ...post,
      reactions
      } 
    };
  }

  // CREATE POST

  async createPost(postDto: PostDto): Promise<void> {

    const post = postDto;

    await this.knex.table<Post>('posts').insert(post);
  }

  // EDIT POST

  async editPost(id: number, postDto: PostDto): Promise<void> {
    const post = await this.knex
      .table<Post>('posts')
      .select()
      .where('id', id)
      .first();

    if (!post) {
      throw new ConflictException('Post doesnt exist!');
    }

    const postContent = {
      ...postDto,
      id
    }

    await this.knex.table<Post>('posts').where('id', id).update(postContent);

  }

  // DELETE POST

  async deletePost(id: number): Promise<void> {
    const post = await this.knex
      .table('posts')
      .select('mainImage')
      .where('id', id)
      .first();

    await this.knex.table<Post>('posts').where('id', id).del();
  }

}
