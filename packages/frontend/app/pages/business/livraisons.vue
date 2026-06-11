<template>
    <AppLayout>
        <div class="space-y-4">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">Livraisons</h1>
                <p class="text-muted-foreground text-sm mt-1">Suivi des livraisons facturées ou non</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent class="p-4">
                        <p class="text-xs text-muted-foreground">Total</p>
                        <p class="text-2xl font-bold">{{ rows.length }}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent class="p-4">
                        <p class="text-xs text-muted-foreground">Facturées</p>
                        <p class="text-2xl font-bold text-green-600">{{ billedCount }}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent class="p-4">
                        <p class="text-xs text-muted-foreground">Non facturées</p>
                        <p class="text-2xl font-bold text-orange-600">{{ rows.length - billedCount }}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent class="p-4 flex flex-wrap gap-3">
                    <div class="relative flex-1 min-w-48 max-w-sm">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input v-model="search" placeholder="Référence, client..." class="pl-9" />
                    </div>
                    <select
                        v-model="filter"
                        class="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="">Toutes</option>
                        <option value="billed">Facturées</option>
                        <option value="unbilled">Non facturées</option>
                    </select>
                </CardContent>
            </Card>

            <div v-if="loading" class="text-center py-12 text-muted-foreground"><p>Chargement...</p></div>

            <div v-else-if="error" class="text-center py-12 text-muted-foreground">
                <p>Erreur : {{ error }}</p>
                <Button variant="outline" class="mt-4" @click="fetchData">Réessayer</Button>
            </div>

            <Card v-else>
                <CardContent class="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Livraison</TableHead>
                                <TableHead>Facture</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Statut livraison</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Facturation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="d in filtered" :key="d.id">
                                <TableCell class="font-mono text-xs text-muted-foreground">{{ d.ref }}</TableCell>
                                <TableCell class="font-mono text-xs text-muted-foreground">{{ d.invoiceRef }}</TableCell>
                                <TableCell class="font-medium">{{ d.client }}</TableCell>
                                <TableCell class="text-muted-foreground text-sm">{{ d.deliveryStatus }}</TableCell>
                                <TableCell class="font-semibold">{{ d.amount }}</TableCell>
                                <TableCell>
                                    <Badge :class="d.billed ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'">
                                        {{ d.billed ? 'Facturée' : 'Non facturée' }}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="filtered.length === 0">
                                <TableCell colspan="6" class="text-center text-muted-foreground py-6">
                                    Aucune livraison
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div class="px-4 py-3 border-t text-xs text-muted-foreground">{{ filtered.length }} livraison(s)</div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from '@lucide/vue';
import { useApi, type ApiDelivery, type PaginatedResponse } from '@/composables/useApi';

definePageMeta({ layout: false });
useHead({ title: 'Livraisons — Business Manager' });

const { get } = useApi();

interface Row {
    id: string;
    ref: string;
    invoiceRef: string;
    client: string;
    deliveryStatus: string;
    amount: string;
    billed: boolean;
}

const loading = ref(true);
const error = ref<string | null>(null);
const search = ref('');
const filter = ref('');
const rows = ref<Row[]>([]);

const deliveryStatusLabels: Record<string, string> = {
    delivered: 'Livrée',
    planned: 'Planifiée',
    delivering: 'En cours',
    cancelled: 'Annulée',
    blocked: 'Bloquée',
    delayed: 'Retardée',
};

const billedCount = computed(() => rows.value.filter((r) => r.billed).length);

const filtered = computed(() =>
    rows.value.filter(
        (d) =>
            (filter.value === '' ||
                (filter.value === 'billed' && d.billed) ||
                (filter.value === 'unbilled' && !d.billed)) &&
            (!search.value ||
                [d.ref, d.invoiceRef, d.client].some((v) => v.toLowerCase().includes(search.value.toLowerCase()))),
    ),
);

function mapDelivery(d: ApiDelivery): Row {
    const inv = d.invoice;
    return {
        id: d.id,
        ref: d.reference,
        invoiceRef: inv?.reference ?? '—',
        client: inv?.customer?.customer_name ?? '—',
        deliveryStatus: deliveryStatusLabels[d.status] ?? d.status ?? '—',
        amount: `€ ${(inv?.amount ?? 0).toLocaleString('fr-FR')}`,
        // A delivery is "billed" once its invoice has reached the final 'invoice' status.
        billed: inv?.status === 'invoice',
    };
}

async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
        const res = await get<PaginatedResponse<ApiDelivery>>('/deliveries', { limit: 100 });
        rows.value = res.data.map(mapDelivery);
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les livraisons';
    } finally {
        loading.value = false;
    }
}

onMounted(fetchData);
</script>
