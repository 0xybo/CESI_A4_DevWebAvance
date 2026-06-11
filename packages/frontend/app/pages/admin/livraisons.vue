<template>
    <AppLayout>
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">Livraisons</h1>
                    <p class="text-muted-foreground text-sm mt-1">Gestion de toutes les livraisons</p>
                </div>
                <Button @click="createOpen = true"><Plus class="w-4 h-4 mr-2" />Nouvelle livraison</Button>
            </div>

            <Card>
                <CardContent class="p-4 flex flex-wrap items-center gap-3">
                    <div class="relative flex-1 min-w-48 max-w-sm">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input v-model="search" placeholder="Référence, client..." class="pl-9" />
                    </div>
                    <select
                        v-model="filterStatus"
                        class="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="">Tous les statuts</option>
                        <option v-for="s in statuses" :key="s" :value="s">
                            {{ s }}
                        </option>
                    </select>
                </CardContent>
            </Card>

            <div v-if="loading" class="text-center py-12 text-muted-foreground">
                <p>Chargement...</p>
            </div>

            <div v-else-if="error" class="text-center py-12 text-muted-foreground">
                <p>Erreur : {{ error }}</p>
                <Button variant="outline" class="mt-4" @click="fetchDeliveries">Réessayer</Button>
            </div>

            <Card v-else>
                <CardContent class="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Référence</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Chauffeur</TableHead>
                                <TableHead>Priorité</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead class="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="d in filtered" :key="d.id">
                                <TableCell class="font-mono text-xs text-muted-foreground">{{ d.ref }}</TableCell>
                                <TableCell class="font-medium">{{ d.client }}</TableCell>
                                <TableCell>{{ d.destination }}</TableCell>
                                <TableCell class="text-muted-foreground">{{ d.driver }}</TableCell>
                                <TableCell><Badge :class="priorityClass(d.priority)">{{ d.priority }}</Badge></TableCell>
                                <TableCell><Badge :class="statusClass(d.status)">{{ d.status }}</Badge></TableCell>
                                <TableCell class="text-muted-foreground text-xs">{{ d.date }}</TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" class="h-8 w-8" @click="editItem(d)">
                                            <Pencil class="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:text-destructive" @click="deleteItem(d)">
                                            <Trash2 class="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div class="px-4 py-3 border-t text-xs text-muted-foreground">
                        {{ filtered.length }} livraison(s)
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>

    <AdminCreateModal
        v-model:open="createOpen"
        title="Nouvelle livraison"
        api-endpoint="/deliveries"
        :fields="deliveryFields"
        @success="fetchDeliveries"
    />

    <AdminEditModal
        v-model:open="editOpen"
        title="Modifier la livraison"
        api-endpoint="/deliveries"
        :fields="deliveryEditFields"
        :item="selectedItem"
        @success="fetchDeliveries"
    />

    <AdminDeleteDialog
        v-model:open="deleteOpen"
        api-endpoint="/deliveries"
        :item="selectedItem"
        @success="fetchDeliveries"
    />
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Plus, Search, Trash2 } from '@lucide/vue';
import type { ApiDelivery, PaginatedResponse } from '@/composables/useApi';
import { useRealtime } from '@/composables/useRealtime';
import AdminCreateModal from '@/components/admin/AdminCreateModal.vue';
import AdminEditModal from '@/components/admin/AdminEditModal.vue';
import AdminDeleteDialog from '@/components/admin/AdminDeleteDialog.vue';
import type { FormField } from '@/components/admin/AdminFormFields.vue';

definePageMeta({ layout: false });
useHead({ title: 'Livraisons — Transvirex' });

const { get } = useApi();
const search = ref('');
const filterStatus = ref('');
const loading = ref(true);
const error = ref<string | null>(null);
const deliveries = ref<Array<{
    id: string;
    ref: string;
    client: string;
    destination: string;
    driver: string;
    priority: string;
    status: string;
    date: string;
}>>([]);

const createOpen = ref(false);
const editOpen = ref(false);
const deleteOpen = ref(false);
const selectedItem = ref<Record<string, any> | null>(null);

const deliveryFields: FormField[] = [
    { name: 'invoices_id', label: 'Facture', type: 'select', required: true, asyncOptions: { endpoint: '/invoices?limit=200', labelKey: 'reference', valueKey: 'id' } },
    { name: 'driver_id', label: 'Chauffeur', type: 'select', asyncOptions: { endpoint: '/users?role=driver&limit=100', labelKey: 'firstname', valueKey: 'id' } },
    { name: 'scheduled_at', label: 'Planifiée le', type: 'datetime' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
];

const deliveryEditFields: FormField[] = [
    { name: 'driver_id', label: 'Chauffeur', type: 'select', asyncOptions: { endpoint: '/users?role=driver&limit=100', labelKey: 'firstname', valueKey: 'id' } },
    { name: 'scheduled_at', label: 'Planifiée le', type: 'datetime' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
];

const statusLabels: Record<string, string> = {
    delivered: 'Livré',
    planned: 'En attente',
    delivering: 'En cours',
    cancelled: 'Annulé',
    blocked: 'Bloqué',
    delayed: 'Retardé',
};

const statuses = Object.values(statusLabels);

function editItem(item: any) {
    selectedItem.value = item;
    editOpen.value = true;
}

function deleteItem(item: any) {
    selectedItem.value = item;
    deleteOpen.value = true;
}

async function fetchDeliveries() {
    loading.value = true;
    error.value = null;
    try {
        const res = await get<PaginatedResponse<ApiDelivery>>('/deliveries?limit=100');
        deliveries.value = res.data.map((d) => ({
            id: d.id,
            ref: d.reference,
            client: d.invoice?.customer?.customer_name ?? '—',
            destination: d.invoice?.delivery_address
                ? [d.invoice.delivery_address.address, d.invoice.delivery_address.postal_code, d.invoice.delivery_address.city]
                      .filter(Boolean)
                      .join(', ')
                : '—',
            driver: d.driver
                ? [d.driver.user.firstname, d.driver.user.lastname].filter(Boolean).join(' ')
                : '—',
            priority: d.invoice?.priority ?? 'standard',
            status: statusLabels[d.status] ?? d.status,
            date: d.invoice?.due_date ? new Date(d.invoice.due_date).toLocaleDateString('fr-FR') : '—',
        }));
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les livraisons';
    } finally {
        loading.value = false;
    }
}

const filtered = computed(() =>
    deliveries.value.filter(
        (d) =>
            (filterStatus.value === '' || d.status === filterStatus.value) &&
            (search.value === '' || Object.values(d).some((v) => String(v).toLowerCase().includes(search.value.toLowerCase()))),
    ),
);

function statusClass(s: string) {
    return (
        {
            Livré: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
            'En cours': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
            'En attente': 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
            Retardé: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
            Bloqué: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100',
            Annulé: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100',
        } as Record<string, string>
    )[s] ?? '';
}

function priorityClass(p: string) {
    return (
        {
            urgent: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
            Urgent: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
            high: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100',
            High: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100',
            standard: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
            Standard: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
            low: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100',
            Low: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100',
        } as Record<string, string>
    )[p] ?? '';
}

onMounted(async () => {
    await fetchDeliveries();

    const realtime = useRealtime();
    realtime.on('delivery:status', () => fetchDeliveries());
    realtime.on('delivery:assigned', () => fetchDeliveries());
    realtime.connect();
});
</script>
