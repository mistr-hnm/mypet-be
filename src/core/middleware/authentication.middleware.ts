import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common"
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt"
import { Request, Response, NextFunction } from 'express' 
import { PermissionService } from "../../app/permission/permission.service"

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService, 
        private readonly permissionService: PermissionService,
    ) { }


    async use(req: Request, res: Response, next: NextFunction) {
        const { ip, method, originalUrl } = req

        const allowedURLS = [
            "/api/users/login",
            "/api/users/signup",
            "/api/users/google/login",
            "/api/users/google/callback",
            "/api/permissions",
        ];

        const cleanUrl = originalUrl.split('?')[0]; // Remove query parameters from the URL

        if (allowedURLS.includes(cleanUrl)) {
            next();
        } else {
            if (!req.headers['mypet-signature'] || req.headers['mypet-signature'] != process.env.API_KEY) {
                throw new UnauthorizedException("Signature invalid")
            }
            const authHeader = req.headers['authorization']
            if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
                throw new UnauthorizedException()
            }
            const token = authHeader.split(' ')[1]
            console.log("token",token);
            
            let decoded
            try{
               decoded = await this.jwtService.verifyAsync(token)
            }catch(error){
                if(error instanceof TokenExpiredError){
                    throw new UnauthorizedException('Authentication token expired')
                }else if(error instanceof JsonWebTokenError){
                    throw new UnauthorizedException('Invalid authentication token')
                }
                throw new UnauthorizedException('Failed to authenticate token')
            } 
                        
            const permission = await this.permissionService.findAll()
            if(!permission?.data){
                throw new ForbiddenException("Permission not allowed")
            }  
            const Permissions = permission?.data;
            const cleanUrl = originalUrl.split('?')[0];
            const module = cleanUrl.split("/")
            
            const moduleIndex = Permissions.findIndex((element : any) => element.module == "petadoptions");
            if (moduleIndex < 0) {
                throw new ForbiddenException("Permission not allowed")
            }
            req['user'] = decoded.sub
            next()

        }
    }
}