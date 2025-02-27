import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/users/schema/user.schema';
import { CartSchema } from './schema/cart.schema';
import { productsSchema } from 'src/products/schema/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'cart', schema: CartSchema },
      { name: 'Products', schema: productsSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
