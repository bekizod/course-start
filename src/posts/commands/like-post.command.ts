export class LikePostCommand {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
  ) {}
}