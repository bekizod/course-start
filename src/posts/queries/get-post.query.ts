export class GetPostQuery {
  constructor(
    public readonly id: number,
    public readonly userId?: number, // Added optional userId parameter
  ) {}
}