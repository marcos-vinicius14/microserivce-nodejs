import { pgTable, text, date } from "drizzle-orm/pg-core";

export const customers = pgTable('customers', {
    id: text('id').primaryKey(),
    username: text('username').notNull(),
    email: text('email').notNull().unique(),
    address: text('address').notNull(),
    state: text('state').notNull(),
    zipcode: text('zipcode').notNull(),
    country: text('country').notNull(),
    dateOfBirth: date('date_of_birth').notNull()
});