import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { signUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/sign-in.dto';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private JwtService: JwtService,
    private emailSender: EmailSenderService,
  ) {}

  async signUp({ email, firstName, lastName, password }: signUpDto) {
    const existsUser = await this.userModel.findOne({ email });
    if (existsUser) throw new BadRequestException('user already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeValidationData = new Date();
    otpCodeValidationData.setTime(
      otpCodeValidationData.getTime() + 3 * 60 * 1000,
    );

    await this.userModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      otpCode,
      otpCodeValidationData,
    });

    await this.emailSender.sendEmailText(email, 'verification code', otpCode);

    return 'check Email';
  }

  async verifyEmail(email, otpCode) {
    console.log(email);

    const existUser = await this.userModel.findOne({ email });
    if (!existUser) throw new BadRequestException('user not found');

    if (existUser.isVerifed)
      throw new BadRequestException('user Already verifed');

    if (existUser.otpCodeValidationData < new Date())
      throw new BadRequestException('otp code is outdated');

    if (otpCode !== existUser.otpCode)
      throw new BadRequestException('wrong otp code');

    await this.userModel.findByIdAndUpdate(existUser._id, {
      $set: { isVerifed: true, otpCode: '', otpCodeValidationData: '' },
    });

    const payLoad = {
      userId: existUser._id,
      role: existUser.role,
    };

    const accesToken = await this.JwtService.sign(payLoad, { expiresIn: '1h' });

    return {
      message: 'user verifed succesfully',
      accesToken,
    };
  }

  async resendVerificationCode(email) {
    const existUser = await this.userModel.findOne({ email });
    if (!existUser) throw new BadRequestException('user not found');

    if (existUser.isVerifed)
      throw new BadRequestException('user Already verifed');

    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeValidationData = new Date();
    otpCodeValidationData.setTime(
      otpCodeValidationData.getTime() + 3 * 60 * 1000,
    );

    await this.userModel.findByIdAndUpdate(existUser._id, {
      $set: { otpCode, otpCodeValidationData },
    });

    await this.emailSender.sendEmailText(email, 'Verification code', otpCode);

    return 'check Email';
  }

  async signIn({ email, password }: signInDto) {
    const existUser = await this.userModel.findOne({ email });
    if (!existUser)
      throw new BadRequestException('email or password is invalid');

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual)
      throw new BadRequestException('email or password is invalid');

    if (!existUser.isVerifed) throw new BadRequestException('Verify User');

    const payLoad = {
      userId: existUser._id,
      role: existUser.role,
    };

    const accesToken = await this.JwtService.sign(payLoad, { expiresIn: '1h' });

    return { accesToken };
  }

  async getCurrentUser(userId) {
    const user = await this.userModel.findById(userId).select('-password');
    return user;
  }
}
