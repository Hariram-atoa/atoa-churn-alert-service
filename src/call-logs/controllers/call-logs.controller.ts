import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CallLogsService } from '../services/call-logs.service';
import { GetCallLogsDto } from '../dto/get-call-logs.dto';
import { CallLogEntity } from '../../entities/call-log.entity/call-log.entity';

@Controller('call-logs')
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) {}

  @Post('search')
  async getCallLogsWithFilters(@Body() filters: GetCallLogsDto) {
    return this.callLogsService.getCallLogsWithFilters(filters);
  }

  @Get('alert/:alertId')
  async getCallLogsByAlertId(@Param('alertId', ParseUUIDPipe) alertId: string) {
    return this.callLogsService.getCallLogsByAlertId(alertId);
  }

  @Get(':id')
  async getCallLogById(@Param('id', ParseUUIDPipe) id: string) {
    return this.callLogsService.getCallLogById(id);
  }

  @Post()
  async createCallLog(@Body() callLogData: Partial<CallLogEntity>) {
    return this.callLogsService.createCallLog(callLogData);
  }

  @Put(':id')
  async updateCallLog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() callLogData: Partial<CallLogEntity>,
  ) {
    return this.callLogsService.updateCallLog(id, callLogData);
  }

  @Delete(':id')
  async deleteCallLog(@Param('id', ParseUUIDPipe) id: string) {
    return this.callLogsService.deleteCallLog(id);
  }
}
