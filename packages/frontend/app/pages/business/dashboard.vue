<template>
    <AppLayout>
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p class="text-muted-foreground text-sm mt-1">Vue d'ensemble de la facturation</p>
            </div>

            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card v-for="i in 4" :key="i">
                    <CardHeader class="pb-2">
                        <div class="h-3 w-20 bg-muted/50 animate-pulse rounded" />
                        <div class="h-8 w-24 bg-muted/50 animate-pulse rounded mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div class="h-3 w-16 bg-muted/30 animate-pulse rounded" />
                    </CardContent>
                </Card>
            </div>

            <div v-else-if="error" class="text-center py-12 text-muted-foreground">
                <p>Erreur : {{ error }}</p>
                <Button variant="outline" class="mt-4" @click="fetchData">Réessayer</Button>
            </div>

            <template v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <Card v-for="kpi in kpis" :key="kpi.label">
                        <CardHeader class="pb-2">
                            <CardDescription>{{ kpi.label }}</CardDescription>
                            <CardTitle class="text-2xl">{{ kpi.value }}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p class="text-xs text-muted-foreground">{{ kpi.hint }}</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle class="text-base">Répartition des documents</CardTitle>
                        <CardDescription>Devis, bons de commande et factures</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <div v-for="row in statusBreakdown" :key="row.label" class="flex items-center gap-3">
                            <span class="w-36 text-sm text-muted-foreground">{{ row.label }}</span>
                            <div class="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div class="h-full rounded-full" :class="row.color" :style="{ width: row.pct + '%' }" />
                            </div>
                            <span class="w-10 text-right text-sm font-semibold">{{ row.count }}</span>
                        </div>
                    </CardContent>
                </Card>
            </template>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi, type ApiCustomer, type ApiInvoice, type PaginatedResponse } from '@/composables/useApi';

definePageMeta({ layout: false });
useHead({ title: 'Dashboard — Business Manager' });

const { get } = useApi();

const loading = ref(true);
const error = ref<string | null>(null);
const invoices = ref<ApiInvoice[]>([]);
const customerCount = ref(0);

function isOverdue(inv: ApiInvoice): boolean {
    return inv.status === 'invoice' && !inv.payment_date && new Date(inv.due_date) < new Date();
}

const kpis = computed(() => {
    const billed = invoices.value.filter((i) => i.status === 'invoice');
    const revenue = billed.reduce((sum, i) => sum + (i.amount ?? 0), 0);
    const quotes = invoices.value.filter((i) => i.status === 'quotation').length;
    const overdue = invoices.value.filter(isOverdue).length;
    return [
        { label: 'CA facturé', value: `€ ${revenue.toLocaleString('fr-FR')}`, hint: `${billed.length} facture(s)` },
        { label: 'Devis en cours', value: String(quotes), hint: 'À transformer en facture' },
        { label: 'Impayés en retard', value: String(overdue), hint: 'Échéance dépassée' },
        { label: 'Clients', value: String(customerCount.value), hint: 'Comptes clients' },
    ];
});

const statusBreakdown = computed(() => {
    const total = invoices.value.length || 1;
    const count = (s: string) => invoices.value.filter((i) => i.status === s).length;
    return [
        { label: 'Devis', count: count('quotation'), color: 'bg-yellow-400', pct: (count('quotation') / total) * 100 },
        { label: 'Bons de commande', count: count('purchase_order'), color: 'bg-blue-500', pct: (count('purchase_order') / total) * 100 },
        { label: 'Factures', count: count('invoice'), color: 'bg-green-500', pct: (count('invoice') / total) * 100 },
    ];
});

async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
        const [invRes, customers] = await Promise.all([
            get<PaginatedResponse<ApiInvoice>>('/invoices', { limit: 100 }),
            get<ApiCustomer[]>('/customers'),
        ]);
        invoices.value = invRes.data;
        customerCount.value = customers.length;
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les données';
    } finally {
        loading.value = false;
    }
}

onMounted(fetchData);
</script>
