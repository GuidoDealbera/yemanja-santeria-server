import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Purchase } from './purchase.entity';

@Entity({ name: 'products', schema: 'public' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying', length: 50, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ type: 'integer' })
  stock: number;

  @Column('jsonb', { nullable: false })
  images: {
    url: string;
    id: string;
  }[];

  @OneToMany(() => Purchase, (purchase) => purchase.product)
  purchases: Purchase[];

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
