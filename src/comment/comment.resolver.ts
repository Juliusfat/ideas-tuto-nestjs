import { Resolver, Args, Query, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.guard';

@Resolver('Comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  async comment(@Args('id') id: number) {
    return await this.commentService.show(id);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async createComment(
    @Args('idea') ideaId: number,
    @Args('comment') comment: string,
    @Context('user') user,
  ) {
    const { id: userId } = user;
    const data = { comment };
    return await this.commentService.create(ideaId, userId, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async deleteComment(@Args('id') id: number, @Context('user') user) {
    const { id: userId } = user;
    return await this.commentService.destroy(id, userId);
  }
}