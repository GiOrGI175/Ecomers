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
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/users/role.decorator';

@Controller('products')
@UseGuards(isAuthGuard)
export class ProductsController {
  constructor(private readonly ProductsService: ProductsService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Req() requset, @Role() Role, @Body() createPostDto: CreatePostDto) {
    const userId = requset.userId;

    return this.ProductsService.create(userId, Role, createPostDto);
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
