import { faker } from '@faker-js/faker';
import type { InvoiceStatus, PrismaClient } from '@generated/prisma';
import { nextInvoiceRef } from './helpers';

export async function seedInvoices(
    prisma: PrismaClient,
    count: number,
    customers: { id: string }[],
    hubs: { id: string }[],
    addressIds: string[],
    businessManagerUsers: { id: string }[],
) {
    const invoices: { id: string; due_date: Date }[] = [];
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    for (let i = 0; i < count; i++) {
        const dueDate = faker.date.between({ from: sixMonthsAgo, to: now });
        const ageDays = (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24);

        let isPaid: boolean;
        let status: InvoiceStatus;

        if (ageDays > 60) {
            isPaid = faker.datatype.boolean(0.85);
            status = faker.helpers.arrayElement(['invoice', 'invoice', 'invoice', 'purchase_order']);
        } else if (ageDays > 30) {
            isPaid = faker.datatype.boolean(0.6);
            status = faker.helpers.arrayElement(['invoice', 'invoice', 'purchase_order', 'quotation']);
        } else {
            isPaid = faker.datatype.boolean(0.2);
            status = faker.helpers.arrayElement(['quotation', 'purchase_order', 'purchase_order', 'invoice']);
        }

        const invoice = await prisma.invoice.create({
            data: {
                reference: nextInvoiceRef(),
                customer_id: faker.helpers.arrayElement(customers).id,
                hub_id: faker.helpers.arrayElement(hubs).id,
                pickup_address_id: faker.helpers.arrayElement(addressIds),
                delivery_address_id: faker.helpers.arrayElement(addressIds),
                business_manager_id: faker.helpers.arrayElement(businessManagerUsers).id,
                service_type: faker.helpers.arrayElement(['express', 'standard', 'freight']),
                priority: faker.helpers.arrayElement(['urgent', 'high', 'standard', 'low']),
                due_date: dueDate,
                payment_date: isPaid ? faker.date.between({ from: sixMonthsAgo, to: dueDate }) : null,
                amount: faker.number.float({ min: 50, max: 5000, fractionDigits: 2 }),
                status,
            },
        });
        invoices.push({ id: invoice.id, due_date: invoice.due_date });
    }

    invoices.sort((a, b) => a.due_date.getTime() - b.due_date.getTime());

    return invoices;
}

