import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) { }

  create(createOrderDto: CreateOrderDto) {
    return this.prismaService.order.create({
      data: {
        ...createOrderDto,
        price: createOrderDto.price * 100 // convert to cents
      }
    });
  }

  async findAll() {
    const data = await this.prismaService.order.findMany({
      where: { NOT: { status: 'CONCLUDED' } },
      select: {
        price: true,
        scheduledDate: true,
        tattooType: true,
        payments: true,
        customer: { select: { name: true, } },
        tags: true
      },
    });

    const formatPriceAndPayments = data.map(
      order => (
        {
          ...order, price: order.price * 100, // formart price
          payments: order.payments.map(
            payment => (
              { ...payment, amount: payment.amount * 100 }
            ))
        }))

    return formatPriceAndPayments
  }

  findOne(id: number) {
    return this.prismaService.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            name: true,
            age: true,
            email: true,
            phone: true,
          }
        },
        payments: {
          select: {
            description: true, amount: true, id: true
          }
        }
      }
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prismaService.order.update({
      where: { id },
      data: {
        ...updateOrderDto,

        price: updateOrderDto.price && updateOrderDto.price * 100
      }
    });
  }

  remove(id: number) {
    return this.prismaService.order.delete({ where: { id } });
  }
}
