import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreatePostDto } from './dto/create-product.dto';
import { UpdatePostDto } from './dto/update-product.dto';
// import { HasUserId } from './guards/hasUserId.guard';
import { isAuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
@UseGuards(isAuthGuard)
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Post()
  create(@Req() requset, @Body() createPostDto: CreatePostDto) {
    const userId = requset.userId;

    return this.ProductsService.create(userId, createPostDto);
  }

  @Get()
  findAll() {
    return this.ProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ProductsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.ProductsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ProductsService.remove(+id);
  }
}
