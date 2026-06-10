import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { CreateInvoiceDto } from './dto/create-invoice.dto';
import type { UpdateInvoiceDto } from './dto/update-invoice.dto';

const invoiceInclude = {
    customer: true,
    hub: true,
    business_manager: {
        select: {
            id: true,
            reference: true,
            firstname: true,
            lastname: true,
            email: true,
        },
    },
} as const;

/** Service handling billing-related business logic. */
@Injectable()
export class BillingService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find an invoice by its ID
     * @param id - The ID of the invoice
     * @returns The invoice
     * @throws NotFoundException if the invoice is not found
     */
    async findById(id: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: invoiceInclude,
        });

        if (!invoice) {
            throw new NotFoundException(`Invoice ${id} not found`);
        }

        return invoice;
    }

    /**
     * Find all invoices with pagination
     * @param page - The page number (1-based)
     * @param limit - The number of invoices per page
     */
    async findAll(page: number, limit: number) {
        const [data, total] = await Promise.all([
            this.prisma.invoice.findMany({
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.invoice.count(),
        ]);

        return {
            data,
            page,
            limit,
            total,
        };
    }

    /** Create a new invoice */
    async create(dto: CreateInvoiceDto) {
        return this.prisma.invoice.create({
            data: {
                customer_id: dto.customer_id,
                hub_id: dto.hub_id,
                pickup_address_id: dto.pickup_address_id,
                delivery_address_id: dto.delivery_address_id,
                business_manager_id: dto.business_manager_id,
                reference: dto.reference,
                priority: dto.priority,
                due_date: new Date(dto.due_date),
                service_type: dto.service_type,
                payment_date: dto.payment_date
                    ? new Date(dto.payment_date)
                    : null,
                amount: dto.amount ?? 0,
                status: dto.status,
            },
            include: invoiceInclude,
        });
    }

    /** Update an invoice */
    async update(id: string, dto: UpdateInvoiceDto) {
        const existing = await this.prisma.invoice.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Invoice ${id} not found`);
        }

        const updateData: Record<string, unknown> = {};
        if (dto.customer_id !== undefined) updateData.customer_id = dto.customer_id;
        if (dto.hub_id !== undefined) updateData.hub_id = dto.hub_id;
        if (dto.pickup_address_id !== undefined) {
            updateData.pickup_address_id = dto.pickup_address_id;
        }
        if (dto.delivery_address_id !== undefined) {
            updateData.delivery_address_id = dto.delivery_address_id;
        }
        if (dto.business_manager_id !== undefined) {
            updateData.business_manager_id = dto.business_manager_id;
        }
        if (dto.reference !== undefined) updateData.reference = dto.reference;
        if (dto.priority !== undefined) updateData.priority = dto.priority;
        if (dto.due_date !== undefined) updateData.due_date = new Date(dto.due_date);
        if (dto.service_type !== undefined) updateData.service_type = dto.service_type;
        if (dto.payment_date !== undefined) {
            updateData.payment_date = dto.payment_date
                ? new Date(dto.payment_date)
                : null;
        }
        if (dto.amount !== undefined) updateData.amount = dto.amount;
        if (dto.status !== undefined) updateData.status = dto.status;

        return this.prisma.invoice.update({
            where: { id },
            data: updateData,
            include: invoiceInclude,
        });
    }

    /** Delete an invoice */
    async remove(id: string) {
        const existing = await this.prisma.invoice.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Invoice ${id} not found`);
        }

        const deliveries = await this.prisma.delivery.findMany({
            where: { invoices_id: id },
            select: { id: true },
        });
        const deliveryIds = deliveries.map((d) => d.id);
        if (deliveryIds.length > 0) {
            await this.prisma.deliveryEvent.deleteMany({
                where: { delivery_id: { in: deliveryIds } },
            });
            await this.prisma.delivery.deleteMany({ where: { invoices_id: id } });
        }
        await this.prisma.parcel.deleteMany({ where: { invoice_id: id } });
        await this.prisma.invoice.delete({ where: { id } });
        return { success: true, id };
    }
}
