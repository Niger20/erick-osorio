

// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto_temporal',
    });
  }

  async validate(payload: any) {
    // Lo que retornes aquí se inyecta en request.user
    if (!payload) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, email: payload.email, role: payload.role, tenantId: payload.tenantId };
  }
}