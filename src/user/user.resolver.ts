import { Resolver, Query, Args, ResolveProperty, Parent, Mutation, Context } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CommentService } from "src/comment/comment.service";
import { UserDto } from "./user.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/shared/auth.guard";

@Resolver('User')
export class UserResolver{

    constructor( private userService: UserService, private commentService: CommentService) {}

    @Query()
    users(@Args('page') page: number){
        return this.userService.showAll(page);
    }

    @Query()
    async user(@Args('username') username: string) {
      return await this.userService.read(username);
    }
  
    @Query()
    @UseGuards(new AuthGuard())
    async whoami(@Context('user') user) {
      const { username } = user;
      return await this.userService.read(username);
    }

    @Mutation()
    async login(
      @Args('username') username: string,
      @Args('password') password: string,
    ) {
      const user: UserDto = { username, password };
      return await this.userService.login(user);
    }
  
    @Mutation()
    async register(
      @Args('username') username: string,
      @Args('password') password: string,
    ) {
      const user: UserDto = { username, password };
      return await this.userService.register(user);
    }

    @ResolveProperty()
    comments(@Parent() user) {
        const {id} = user;
        return this.commentService.showByUser(id);
    }
}