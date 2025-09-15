import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class StoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; address: string; latitude: number; longitude: number; street: string; ward: string; city: string;}) {
    return this.prisma.store.create({
      data,
    });
  }

  async findNearby(latitude: number, longitude: number, radius: number) {
    return this.prisma.$queryRawUnsafe<any[]>(`
        SELECT
            s.store_id AS "id",
            s.store_name AS "name",
            s.address AS "address",
            s.latitude AS "latitude",
            s.longitude AS "longitude",
            (
                6371 * 2 * asin(
                    sqrt(
                        pow(sin(radians((${latitude} - s.latitude) / 2)), 2) +
                        cos(radians(${latitude})) * cos(radians(s.latitude)) *
                        pow(sin(radians((${longitude} - s.longitude) / 2)), 2)
                    )
                )
            ) AS "distance"
        FROM "stores" s
        WHERE (
            6371 * 2 * asin(
                sqrt(
                    pow(sin(radians((${latitude} - s.latitude) / 2)), 2) +
                    cos(radians(${latitude})) * cos(radians(s.latitude)) *
                    pow(sin(radians((${longitude} - s.longitude) / 2)), 2)
                )
            )
        ) < ${radius}
        ORDER BY "distance" ASC;
    `);
    }

    async findByCity(city: string) {
        return this.prisma.store.findMany({
            where: { city: { equals: city, mode: 'insensitive' } },
        });
    }

    async findAll() {
        return this.prisma.store.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
}
