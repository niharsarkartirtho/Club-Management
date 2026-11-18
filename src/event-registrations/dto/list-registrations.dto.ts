import { IsNotEmpty, IsString } from 'class-validator';


export class ListRegistrationsDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
