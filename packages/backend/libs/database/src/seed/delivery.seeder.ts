import { faker } from '@faker-js/faker';
import type { DeliveryStatus, PrismaClient } from '@generated/prisma';
import { nextDeliveryRef } from './helpers';

function pickStatusByAge(ageDays: number): DeliveryStatus {
    if (ageDays > 60) {
        return faker.helpers.arrayElement([
            'delivered',
            'delivered',
            'delivered',
            'delivered',
            'delivered',
            'delivered',
            'delivered',
            'delivered',
            'cancelled',
        ]);
    }
    if (ageDays > 30) {
        return faker.helpers.arrayElement(['delivered', 'delivered', 'delivered', 'delayed', 'cancelled', 'delivered']);
    }
    if (ageDays > 7) {
        return faker.helpers.arrayElement(['delivered', 'delivering', 'delayed', 'blocked', 'planned']);
    }
    return faker.helpers.arrayElement([
        'planned',
        'planned',
        'planned',
        'delivering',
        'delivering',
        'blocked',
        'delayed',
    ]);
}

export async function seedDeliveries(
    prisma: PrismaClient,
    count: number,
    invoices: { id: string; due_date: Date }[],
    drivers: { id: string }[],
) {
    const deliveries: { id: string; invoice_id: string }[] = [];
    const now = new Date();

    for (let i = 0; i < count && i < invoices.length; i++) {
        const invoice = invoices[i];
        const ageDays = (now.getTime() - invoice.due_date.getTime()) / (1000 * 60 * 60 * 24);
        const status = pickStatusByAge(ageDays);

        const hasPosition = status === 'delivering' || status === 'delayed';
        const scheduledAt = new Date(invoice.due_date);
        scheduledAt.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

        const delivery = await prisma.delivery.create({
            data: {
                reference: nextDeliveryRef(),
                invoices_id: invoice.id,
                driver_id: faker.helpers.arrayElement(drivers).id,
                status,
                scheduled_at: scheduledAt,
                notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : undefined,
                ...(hasPosition
                    ? {
                          position_history: JSON.stringify([
                              {
                                  lat: faker.location.latitude({ min: 43, max: 49 }),
                                  lng: faker.location.longitude({ min: -2, max: 7 }),
                                  ts: faker.date.recent().toISOString(),
                              },
                              {
                                  lat: faker.location.latitude({ min: 43, max: 49 }),
                                  lng: faker.location.longitude({ min: -2, max: 7 }),
                                  ts: faker.date.recent().toISOString(),
                              },
                          ]),
                      }
                    : {}),
            },
        });
        deliveries.push({ id: delivery.id, invoice_id: delivery.invoices_id });
    }

    return deliveries;
}

