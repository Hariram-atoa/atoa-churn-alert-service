import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AlertsService } from '../services/alerts.service';
import { CreateAlertDto } from '../dto/create-alert.dto';
import { UpdateAlertStatusDto } from '../dto/update-alert-status.dto';
import { UpdateAlertAssignmentDto } from '../dto/update-alert-assignment.dto';
import { SearchAlertsDto } from '../dto/search-alerts.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }

  @Put(':id/status')
  async updateAlertStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlertStatusDto: UpdateAlertStatusDto,
  ) {
    return this.alertsService.updateAlertStatus(id, updateAlertStatusDto);
  }

  @Put(':id/assignment')
  async updateAlertAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlertAssignmentDto: UpdateAlertAssignmentDto,
  ) {
    return this.alertsService.updateAlertAssignment(
      id,
      updateAlertAssignmentDto,
    );
  }

  @Post('search')
  async searchAlerts(@Body() searchAlertsDto: SearchAlertsDto) {
    return this.alertsService.searchAlerts(searchAlertsDto);
  }

  @Get(':id')
  async getAlertById(@Param('id', ParseUUIDPipe) id: string) {
    return this.alertsService.getAlertById(id);
  }

  @Delete(':id')
  async deleteAlert(@Param('id', ParseUUIDPipe) id: string) {
    return this.alertsService.deleteAlert(id);
  }
}
