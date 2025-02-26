import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { isAuthGuard } from 'src/auth/auth.guard';

@Controller('cart')
@UseGuards(isAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':id')
  addToCart(@Req() request, @Param('id') productId: string) {
    const userId = request.userId;

    console.log(productId, 'productId controler');

    return this.cartService.addToCart(userId, productId);
  }

  @Patch('quantity/:Id')
  async updateQuantity(
    @Req() request,
    @Param('Id') productId: string,
    @Body('change') change: number,
  ) {
    const userId = request.userId;

    return this.cartService.updateQuantity(userId, productId, change);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }
  @Delete('remove/:Id')
  async removeProductFromCart(@Req() request, @Param('Id') productId: string) {
    try {
      const userId = request.userId;

      const updatedUser = await this.cartService.removeProductFromCart(
        userId,
        productId,
      );
      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
