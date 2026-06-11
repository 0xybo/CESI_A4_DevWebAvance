import type { PrismaClient } from '@generated/prisma';
import { randomAddress } from './french-data';

export async function seedAddresses(prisma: PrismaClient, count: number) {
    const ids: string[] = [];

    for (let i = 0; i < count; i++) {
        const a = randomAddress();
        const address = await prisma.address.create({
            data: {
                address: a.address,
                street: a.street,
                city: a.city,
                postal_code: a.postal_code,
            },
        });
        ids.push(address.id);
    }

    return ids;
}
