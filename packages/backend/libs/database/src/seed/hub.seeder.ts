import type { PrismaClient } from '@generated/prisma';
import { nextHubRef } from './helpers';
import { generateFrenchPhone, FRENCH_HUBS } from './french-data';

export async function seedHubs(prisma: PrismaClient, count: number, addressIds: string[]) {
    const hubs: { id: string; address_id: string | null }[] = [];

    for (let i = 0; i < count && i < FRENCH_HUBS.length; i++) {
        const def = FRENCH_HUBS[i];
        const hub = await prisma.hub.create({
            data: {
                reference: nextHubRef(),
                name: def.name,
                phone_number: generateFrenchPhone(),
                capacity_parcels_day: def.capacity,
                status: 'active',
                address_id: addressIds[i] ?? null,
            },
        });
        hubs.push({ id: hub.id, address_id: hub.address_id });
    }

    return hubs;
}
