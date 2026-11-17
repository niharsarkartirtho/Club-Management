import { Controller } from '@nestjs/common';
import { ClubsService } from './clubs.service.js';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}
}
