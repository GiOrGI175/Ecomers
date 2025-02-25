import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { Products, productsSchema } from 'src/products/schema/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Products.name, schema: productsSchema },
    ]),
  ],

  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
