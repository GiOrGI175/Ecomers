import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-product.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
