import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async addToCart(userId: string, productId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('user not found');

    const existProduct = user.cart.findIndex(
      (el) => el.productId.toString() === productId,
    );

    if (existProduct !== -1) {
      user.cart[existProduct].quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      $push: {
        cart: {
          productId: productId,
          quantity: 1,
        },
      },
    });

    const updatedUser = await this.userModel
      .findById(userId)
      .populate('cart.productId');

    return updatedUser;

    // const existingProductIndex = user.cart.findIndex((item) => {
    //   return item.productId && item.productId.toString() === productId;
    // });

    // console.log(existingProductIndex);

    // if (existingProductIndex !== -1) {
    //   user.cart[existingProductIndex].quantity += 1;
    // }

    // await this.userModel.findByIdAndUpdate(user._id, {
    //   $push: { cart: productId },
    // });

    // const updateCart = await this.userModel.findById(userId).populate('cart');

    return 'wesit';
  }

  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
