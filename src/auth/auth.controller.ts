import { Body, Controller, Post } from '@nestjs/common';
import {LoginDto} from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) {}


    @Post('login')
    async login(
        @Body() loginDto: LoginDto
    ) {
        const token = await this.authService.validateUser(loginDto);

        if (!token) throw new Error('Invalid credentials');

        return { access_token: token };
    }

}
