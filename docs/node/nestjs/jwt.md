# jwt


```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {
    super({
      // 从请求头中提取 JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // JWT 策略的选项
      // 过期时间设置为 false，表示不自动处理过期
      ignoreExpiration: false,
      // JWT 签名密钥，从环境变量获取
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }
  
  async validate(payload: any) {
    const user ={}
    return user
  }
}

```



```ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RedisCacheService } from '@/DB/redis';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private redisCacheService: RedisCacheService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    // 1. 公共路由直接放行
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. 先执行 JWT 基础校验
    const result = (await super.canActivate(context)) as boolean;
    if (!result) return false;
    // 3. 关键：校验 Redis 中存储的有效 token（确保是当前登录的 token）
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const token = this.extractToken(request);
    if (!user._id || !token) {
      throw new UnauthorizedException({
        code: 401,
        message: '未授权访问',
        data: null,
      });
    }
    const validToken = await this.redisCacheService.get(`user:jwt:login_token${user._id.toString()}`);

    if (!validToken || validToken !== token) {
      throw new UnauthorizedException({
        code: 401,
        message: '令牌已失效，请重新登录',
        data: null,
      });
    }
    return true;
  }

  /**
   * 从请求头提取 Token
   */
  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.split(' ')[1];
  }



  /**
   * 重写 handleRequest 方法，自定义 JWT 验证失败后的返回值
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          code: 4010,
          message: '令牌已过期，请重新登录',
          data: null,
        });
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          code: 401,
          message: '无效的令牌',
          data: null,
        });
      }
      throw new UnauthorizedException({
        code: 401,
        message: '未授权访问',
        data: null,
      });
    }
    return user;
  }
}

```
