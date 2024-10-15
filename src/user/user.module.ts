import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, TypeOrmModule]
})
export class UserModule { }
