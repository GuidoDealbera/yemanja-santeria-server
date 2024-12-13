import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Purchase } from './purchase.entity';
  import { User } from './user.entity';
  
  @Entity()
  export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;
  
    @Column('enum', { enum: ['pending', 'paid', 'shipped', 'cancelled'] })
    status: string;
  
    @Column('enum', { enum: ['cash', 'transfer', 'credit'] })
    paymentMethod: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => User, (user) => user.orders)
    user: User; // Relación con el usuario que realiza el pedido
  
    @OneToMany(() => Purchase, (purchase) => purchase.order)
    purchases: Purchase[];

    constructor(partial: Partial<Order>) {
      Object.assign(this, partial);
    }
  }
  