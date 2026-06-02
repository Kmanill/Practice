import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Створити замовлення',
    description:
      'Створює нове замовлення. Перевіряє наявність stock, списує кількість, підраховує totalPrice в транзакції.',
  })
  @ApiResponse({ status: 201, description: 'Замовлення створено' })
  @ApiResponse({ status: 400, description: 'Недостатній stock або помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Продукт не знайдено' })
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.ordersService.create(dto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Мої замовлення (user) / Всі замовлення (admin)',
    description: 'User бачить тільки свої замовлення. Admin бачить усі. Підтримує пагінацію та фільтр за статусом.',
  })
  @ApiResponse({ status: 200, description: 'Список замовлень з пагінацією' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  findAll(
    @Query() query: OrderQueryDto,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.findAll(query, userId, role);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Отримати замовлення за ID',
    description: 'User може переглянути тільки своє замовлення (ownership check). Admin — будь-яке.',
  })
  @ApiResponse({ status: 200, description: 'Замовлення знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Це не ваше замовлення' })
  @ApiResponse({ status: 404, description: 'Замовлення не знайдено' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
    @CurrentUser('role') role: Role,
  ) {
    return this.ordersService.findOne(id, userId, role);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Змінити статус замовлення (admin)',
    description:
      'Дозволені переходи: pending→confirmed/cancelled, confirmed→shipped/cancelled, shipped→delivered.',
  })
  @ApiResponse({ status: 200, description: 'Статус оновлено' })
  @ApiResponse({ status: 400, description: 'Неможливий перехід статусу' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Недостатньо прав (потрібен admin)' })
  @ApiResponse({ status: 404, description: 'Замовлення не знайдено' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Видалити замовлення (admin)' })
  @ApiResponse({ status: 200, description: 'Замовлення видалено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Недостатньо прав (потрібен admin)' })
  @ApiResponse({ status: 404, description: 'Замовлення не знайдено' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
