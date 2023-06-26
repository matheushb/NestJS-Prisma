import { IsEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsEmpty()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString({ each: true })
  readonly tags: string[];
}
