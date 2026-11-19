
import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service.js';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/jwt-auth/roles.guard.js';
import { Roles } from '../auth/jwt-auth/roles.decorator.js';

@ApiTags('Analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('events/:id/stats')
    @UseGuards(JwtAuthGuard)
    eventStats(@Param('id', ParseIntPipe) id: number) {
        return this.analyticsService.eventStats(id);
    }

    @Get('admin/overview')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    adminOverview() {
        return this.analyticsService.adminOverview();
    }
}
