import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authServices: AuthService
    ){}

    @Post('signup')
    singUp(@Body(ValidationPipe) authCredentialDto:AuthCredentialDto): Promise<void> {
        console.log('Credenciales: \n', authCredentialDto);

        return this.authServices.singUp(authCredentialDto);
    }
}
