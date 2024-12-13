import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({ name: "User", schema: "public" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", {
        name: "googleId",
        unique: true,
        nullable: true,
    })
    googleId: string;

    @Column("character varying", {
        name: "name",
        length: 60,
        nullable: true
    })
    name: string;

    @Column("character varying", {
        name: "email",
        length: 100,
        unique: true
    })
    email: string;

    @Column("character varying", {
        name: "password",
        length: 100,
        nullable: true,
    })
    password: string;

    @Column("character varying", {
        name: "phone",
        length: 20,
        nullable: true,
        unique: true,
    })
    phone: string;

    @Column("character varying", {
        name: "address",
        nullable: true
    })
    address: string;

    @Column("character varying", {
        name: "profilePhoto",
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
    })
    profilePhoto: string;

    @Column("character varying", {
        name: "id_photo",
        nullable: true
    })
    id_photo: string;

    @Column("boolean", {
        name: "isAdmin",
        default: false,
    })
    isAdmin: boolean;

    @Column("boolean", {
        name: "isActive",
        default: true,
    })
    isActive: boolean;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
