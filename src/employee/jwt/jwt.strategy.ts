import { Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from '../../../node_modules/passport-jwt';
import { EmployeeRepository } from '../employee.repository';
import { JwtPayLoad } from './jwt.payload';

export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('PassportStrategy');

  constructor(
    @InjectRepository(EmployeeRepository)
    private employeeRespository: EmployeeRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51',
    });
  }

  //already verify at this point, get the user to authorize tasks
  async validate(payload: JwtPayLoad) {
    const { username, isAdmin } = payload;
    const user = await this.employeeRespository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
