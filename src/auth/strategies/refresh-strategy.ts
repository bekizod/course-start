/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthJwtPayload } from '../type/auth-jwtPayload';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy,'refresh-jwt') {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,

  ) {
    if (!refreshJwtConfiguration.secret) {
      throw new Error('JWT secret is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtConfiguration.secret,
      ignoreExpiration:false,
      passReqToCallback:true
    });
  }

  validate(req:Request,payload: AuthJwtPayload) {
  const authHeader = req.get('authorization');
  if (!authHeader) throw new Error('Authorization header missing');
  const refreshToken = authHeader.replace('Bearer', '').trim();
  const userId = payload.sub
   
   return this.authService.validateRefreshToken(userId,refreshToken)
  }
}
