import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}
