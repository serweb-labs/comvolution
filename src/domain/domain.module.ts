import { Module } from '@nestjs/common';
import { DomainEventsService } from './events/domain-events.service';

@Module({
  providers: [DomainEventsService],
  exports: [DomainEventsService],
})
export class DomainModule {}
