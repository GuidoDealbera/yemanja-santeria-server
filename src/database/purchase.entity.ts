import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('character varying')
  status: string;

  @Column('enum', { enum: ['cash', 'transfer', 'other'] })
  paymentMethod: string;

  @ManyToOne(() => Product, (product) => product.purchases)
  product: Product;

  @ManyToOne(() => Order, (order) => order.purchases)
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<Purchase>) {
    Object.assign(this, partial);
  }
}
