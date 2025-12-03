import { Controller, Get, Req, Res, All } from '@nestjs/common';

@Controller()
export class AppController {
  @All('*')
  handle(@Req() req, @Res() res) {
    if (res.locals.response) {
      return res.json(res.locals.response);
    }
    res.send('Gateway activo');
  }
}
