import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async singUp(authCredentialDto: AuthCredentialDto): Promise<void>{
        const { username, password} = authCredentialDto;

        const user    = new User();
        user.username = username;
        user.salt     = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            if( error.code === '23505' ){
                console.error('Nombre de usuario ya existe');
                throw new ConflictException('Nombre de usuario ya existe');
            } else {
                throw new InternalServerErrorException();
            }
                        
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string>{
        return bcrypt.hash(password, salt );
    }
}