import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<string, string> {
    const message = 'hello world from';
    return { msg: message };
  }
}
