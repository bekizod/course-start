export class CheckPostLikeQuery {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
  ) {}
}