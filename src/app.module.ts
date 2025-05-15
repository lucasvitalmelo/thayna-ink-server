import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { TagsModule } from './tags/tags.module';
import { TattooTypeModule } from './tattoo-type/tattoo-type.module';

@Module({
  imports: [PrismaModule, CustomerModule, TagsModule, TattooTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
