import { Controller } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}
}
