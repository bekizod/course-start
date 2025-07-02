export class UnlikePostCommand {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
  ) {}
}