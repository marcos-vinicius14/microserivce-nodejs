CREATE TABLE "invoices" (
	"id" text NOT NULL,
	"order_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
