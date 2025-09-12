-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "service_id" TEXT;

-- CreateTable
CREATE TABLE "public"."services" (
    "service_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- AddForeignKey
ALTER TABLE "public"."services" ADD CONSTRAINT "services_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("service_id") ON DELETE SET NULL ON UPDATE CASCADE;
