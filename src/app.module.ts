import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './room/room.module';

@Module({
  imports: [RoomModule],
})
export class AppModule {}
