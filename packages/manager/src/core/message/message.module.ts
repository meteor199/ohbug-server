import { Module } from '@nestjs/common';

import { EventModule } from '@/core/event/event.module';
import { MessageController } from './message.controller';

@Module({
  imports: [EventModule],
  controllers: [MessageController],
})
export class MessageModule {}