import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private authServices: AuthService
    ){}

    @Post('/signup')
    singUp(@Body(ValidationPipe) authCredentialDto:AuthCredentialDto): Promise<void> {
        console.log('Credenciales: \n', authCredentialDto);

        return this.authServices.singUp(authCredentialDto);
    }


    @Post('/sigin')
    sigIn(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<{ accesToken: string }>{
        return this.authServices.signIn(authCredentialDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() req){
        console.log(req);
    }
}
