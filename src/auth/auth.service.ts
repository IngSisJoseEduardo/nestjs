import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}


    async singUp(authCredentialDto:AuthCredentialDto): Promise<void>{
        return this.userRepository.singUp(authCredentialDto);
    }

    async signIn(authCredentialDto:AuthCredentialDto): Promise<{ accesToken: string }>{
        const username = await this.userRepository.validateUserPassword(authCredentialDto);
        
        if(!username){
            throw new UnauthorizedException('Invalid credentials')
        }

        const paylod = { username };


        const accesToken = await this.jwtService.sign(paylod);
        this.logger.debug(`Generando el token de acceso para el usuario ${username}, con la sigueinte informacion ${JSON.stringify(paylod)}`);
        return { accesToken }
    }

}
