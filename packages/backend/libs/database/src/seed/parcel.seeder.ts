import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@generated/prisma';
import { nextParcelRef } from './helpers';

export async function seedParcels(prisma: PrismaClient, invoices: { id: string }[]) {
    for (const invoice of invoices) {
        const parcelCount = faker.number.int({ min: 1, max: 5 });
        for (let i = 0; i < parcelCount; i++) {
            await prisma.parcel.create({
                data: {
                    reference: nextParcelRef(),
                    invoice_id: invoice.id,
                    weight: faker.number.float({ min: 0.5, max: 500, fractionDigits: 2 }),
                },
            });
        }
    }
}
