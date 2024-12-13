import { registerAs } from "@nestjs/config";
import { Order } from "src/database/order.entity";
import { Product } from "src/database/product.entity";
import { Purchase } from "src/database/purchase.entity";
import { User } from "src/database/user.entity";
const { DB_TYPE, DB_HOST, DB_SCHEMA, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

export default registerAs('database',  () => ({
    type: DB_TYPE,
    host: DB_HOST,
    schema: DB_SCHEMA,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [User, Product, Purchase, Order],
    synchronize: true,
    logging: false,
    dropSchema: false
}))