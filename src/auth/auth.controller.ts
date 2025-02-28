import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/sign-up.dto';
import { signInDto } from './dto/sign-in.dto';
import { isAuthGuard } from './guards/auth.guard';
import { User } from 'src/users/user.decorator';
import { GoogleGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: signUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async singInWidtGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req, @Res() res) {
    const token = await this.authService.signInWithGoogle(req.user);
    res.redirect(`${process.env.FRONT_URL}/sign-in?token=${token}`);
  }

  @Post('verify')
  verifyEmail(@Body() Body) {
    const { email, otpCode } = Body;

    return this.authService.verifyEmail(email, otpCode);
  }

  @Post('resend-verification-code')
  resendVerificationCode(@Body('email') email) {
    return this.authService.resendVerificationCode(email);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: signInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('current-user')
  @UseGuards(isAuthGuard)
  getCurrentUser(@User() userId) {
    return this.authService.getCurrentUser(userId);
  }
}
