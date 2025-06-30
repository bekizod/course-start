import { IsInt, IsNumber, IsString, Length } from 'class-validator';
export class CreatePropertyDto {
  @IsString()
  @Length(3,7,{message: 'Name must be between 3 and 7 characters long'})
  name: string;
  @IsString()
  description: string;

  @IsInt()
  area: number;
}
