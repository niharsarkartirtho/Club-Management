import { Controller } from '@nestjs/common';
import { MembershipsService } from './memberships.service.js';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}
}
