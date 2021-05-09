import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    home(): String {
        return "Welcome to my Movie API";
    }
}
