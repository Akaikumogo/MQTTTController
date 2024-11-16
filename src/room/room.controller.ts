import { Controller, Body, Post } from '@nestjs/common';
// import { RoomService } from './room.service';
// import { Room } from './room.schema';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import mqtt from 'mqtt';

class UpdateRoomStatusDto {
  @ApiProperty({
    description: 'Status of the room',
    enum: ['empty', 'broned', 'selled'],
    example: 'empty',
  })
  @IsEnum(['empty', 'broned', 'selled'])
  status: 'empty' | 'broned' | 'selled';
  @ApiProperty()
  id: string;
}
class UploadToMqttDto {
  @ApiProperty()
  data: string;
  @ApiProperty()
  topic: string;
}
@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  private client: mqtt.MqttClient;
  onModuleInit() {
    this.client = mqtt.connect('mqtt://185.217.131.96:1883', {
      username: 'tr12345678',
      password: 'tr12345678',
    });
    console.log('MQTT ulanish...', this.client);

    this.client.on('connect', () => {
      console.log('MQTT ga ulandi');
    });

    this.client.on('error', (err) => {
      console.error('MQTT xatolik:', err);
    });
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit data' })
  @ApiResponse({
    status: 200,
    description: 'Data submitted successfully.',
  })
  async submitData(@Body() body: UploadToMqttDto) {
    const data = body.data;
    this.client.publish(body.topic, data, (error) => {
      if (error) {
        console.error("Ma'lumotni MQTT ga yuborishda xatolik:", error);
      } else {
        console.log("Ma'lumot MQTT orqali yuborildi:", data);
      }
    });
    return { message: "Ma'lumot MQTT orqali ESP32 ga yuborildi" };
  }
}
