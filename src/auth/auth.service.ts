import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private  prismaService: PrismaService,
        private  jwtService: JwtService
    ) {}

    async validateUser(user: LoginDto){
        const foundUser = await this.prismaService.user.findUnique({
            where: { email: user.email },
        });

        if (!foundUser) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);

    if (!isPasswordValid) {
        return this.jwtService.sign({ 
            id: foundUser.id,
            email: foundUser.email,
            role: foundUser.role
         });
    } else {
        throw new UnauthorizedException('Invalid password');
    }
    }
}
