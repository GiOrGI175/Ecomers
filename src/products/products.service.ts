import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-product.dto';
import { UpdatePostDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './schema/products.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private productsModel: Model<Products>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(userId, role: string, createPostDto: CreatePostDto) {
    console.log(role);

    if (role !== 'admin') throw new UnauthorizedException('permition dined');

    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('user not found');

    const newProducts = await this.productsModel.create({
      ...createPostDto,
      user: user._id,
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      $push: { Products: newProducts._id },
    });

    return newProducts;
  }

  findAll() {
    return this.productsModel.find().populate({
      path: 'user',
      select: '-Products -createdAt -__v -password -role -cart',
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
