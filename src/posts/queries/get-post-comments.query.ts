export class GetPostCommentsQuery {
  constructor(
    public readonly postId: number,
    public readonly page: number = 1, // Default to page 1
    public readonly limit: number = 10, // Default to 10 items per page
  ) {}
}
