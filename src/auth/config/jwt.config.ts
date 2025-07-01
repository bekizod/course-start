import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRE_IN,
    },
  }),
);