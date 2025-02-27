import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { Products } from 'src/products/schema/products.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Products') private productsModel: Model<Products>,
  ) {}

  async addToCart(userId: string, productId: string) {
    if (!isValidObjectId(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    const product = await this.productsModel.findById(productId);
    if (!product) throw new BadRequestException('Product not found');

    const productPrice = product.price;

    const existProduct = user.cart.findIndex(
      (el) => el.productId.toString() === productId,
    );

    if (existProduct !== -1) {
      user.cart[existProduct].quantity += 1;
      user.cart[existProduct].totalPrice =
        user.cart[existProduct].quantity * productPrice;
    } else {
      user.cart.push({
        productId: new Types.ObjectId(productId),
        quantity: 1,
        totalPrice: productPrice,
      });
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

    const product = await this.productsModel.findById(productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const productPrice = product.price;
    const newTotalPrice = productPrice * newQuantity;

    user.cart[existProductIndex].quantity = newQuantity;
    user.cart[existProductIndex].totalPrice = newTotalPrice;

    await user.save();

    const updatedUser = await this.userModel
      .findById(userId)
      .populate('cart.productId');
    return updatedUser;
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
  async setOrders(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.cart.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const order = {
      products: user.cart.map((item) => ({
        productId: item.productId,
        totalPrice: item.totalPrice,
        quantity: item.quantity,
      })),
      orderDate: new Date(),
      status: 'pending',
    };

    user.orders.push(order);

    user.cart = [];

    await user.save();

    const updatedUser = await this.userModel
      .findById(userId)
      .populate('orders.products.productId');

    return updatedUser;
  }
}
