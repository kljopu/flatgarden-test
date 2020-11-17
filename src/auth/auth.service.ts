import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email)
        const isValidate = await user.user.checkPassword(password)
        if (!user) {
            return new NotFoundException('USER NOT FOUND')
        } else {
            if (!isValidate) {
                return {
                    ok: false,
                }
            }
        }
        return user
    }

    async login(user: any) {
        try {
            console.log(user);
            const payload = { username: user.name, sub: user.id }
            console.log(payload);
            return {
                ok: true,
                access_token: this.jwtService.sign(payload)
            }
        } catch (error) {
            console.log("error", error);
            throw new UnauthorizedException()
        }
    }
}
