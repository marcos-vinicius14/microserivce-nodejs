import { pgTable, pgEnum, text, integer, timestamp } from "drizzle-orm/pg-core";



export const invoices = pgTable('invoices', {
    id: text().notNull(),
    orderId: text().notNull(),
    createdAt: timestamp().defaultNow()
})