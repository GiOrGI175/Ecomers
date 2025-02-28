import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      callbackURL: configService.get('GOOGLE_CLIENT_CALLBACK'),
      scope: ['profile', 'email'],
    });
  }

  async validate(accesToken, refreshToken, profile, done) {
    console.log(profile);
    const data = {
      firstName: profile.given_name,
      lastName: profile.family_name,
      avatar: profile.picture,
    };

    done(null, data);
  }
}
