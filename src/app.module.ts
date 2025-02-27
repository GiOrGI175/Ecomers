import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env,
        },
      },
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
