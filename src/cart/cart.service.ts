import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async addToCart(userId: string, productId: string) {
    if (!isValidObjectId(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const existProduct = user.cart.findIndex(
      (el) => el.productId.toString() === productId,
    );

    console.log(productId, 'productId service');

    if (existProduct !== -1) {
      user.cart[existProduct].quantity += 1;
    } else {
      user.cart.push({ productId: new Types.ObjectId(productId), quantity: 1 });
    }

    await user.save();

    const updatedUser = await this.userModel
      .findById(userId)
      .populate('cart.productId');
    return updatedUser;
  }

  async updateQuantity(userId: string, productId: string, change: number) {
    if (!isValidObjectId(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existProductIndex = user.cart.findIndex(
      (el) => el.productId.toString() === productId,
    );

    if (existProductIndex === -1) {
      throw new BadRequestException('Product not found in cart');
    }

    const currentQuantity = user.cart[existProductIndex].quantity;
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      throw new BadRequestException('Quantity cannot be less than 1');
    }

    user.cart[existProductIndex].quantity = newQuantity;

    await user.save();

    return user;
  }

  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async removeProductFromCart(userId: string, productId: string) {
    if (!isValidObjectId(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existProductIndex = user.cart.findIndex(
      (el) => el.productId.toString() === productId,
    );

    if (existProductIndex === -1) {
      throw new BadRequestException('Product not found in cart');
    }

    user.cart.splice(existProductIndex, 1);

    await user.save();

    return user;
  }
}
