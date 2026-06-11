<template>
    <AppLayout>
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">Véhicules</h1>
                    <p class="text-muted-foreground text-sm mt-1">Gestion de la flotte de véhicules</p>
                </div>
                <Button @click="createOpen = true"><Plus class="w-4 h-4 mr-2" />Nouveau véhicule</Button>
            </div>

            <div v-if="loading" class="text-center py-12 text-muted-foreground">
                <p>Chargement...</p>
            </div>

            <div v-else-if="error" class="text-center py-12 text-muted-foreground">
                <p>Erreur : {{ error }}</p>
                <Button variant="outline" class="mt-4" @click="fetchVehicles">Réessayer</Button>
            </div>

            <Card v-else>
                <CardContent class="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Référence</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Immatriculation</TableHead>
                                <TableHead>Hub</TableHead>
                                <TableHead>Chauffeur assigné</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead class="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="v in vehicles" :key="v.id">
                                <TableCell class="font-mono text-xs text-muted-foreground">{{ v.reference }}</TableCell>
                                <TableCell class="font-medium">{{ v.type }}</TableCell>
                                <TableCell class="font-mono text-sm">{{ v.plate }}</TableCell>
                                <TableCell>{{ v.hub }}</TableCell>
                                <TableCell class="text-muted-foreground">{{ v.driver || '—' }}</TableCell>
                                <TableCell>
                                    <Badge
                                        :class="
                                            v.status === 'En service'
                                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
                                                : v.status === 'En maintenance'
                                                  ? 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100'
                                                  : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        "
                                    >{{ v.status }}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" class="h-8 w-8" @click="editItem(v)">
                                            <Pencil class="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:text-destructive" @click="deleteItem(v)">
                                            <Trash2 class="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div class="px-4 py-3 border-t text-xs text-muted-foreground">
                        {{ vehicles.length }} véhicule(s)
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>

    <AdminCreateModal
        v-model:open="createOpen"
        title="Nouveau véhicule"
        api-endpoint="/vehicles"
        :fields="vehicleFields"
        @success="fetchVehicles"
    />

    <AdminEditModal
        v-model:open="editOpen"
        title="Modifier le véhicule"
        api-endpoint="/vehicles"
        :fields="vehicleFields"
        :item="selectedItem"
        @success="fetchVehicles"
    />

    <AdminDeleteDialog
        v-model:open="deleteOpen"
        api-endpoint="/vehicles"
        :item="selectedItem"
        @success="fetchVehicles"
    />
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Plus, Trash2 } from '@lucide/vue';
import type { ApiVehicle } from '@/composables/useApi';
import AdminCreateModal from '@/components/admin/AdminCreateModal.vue';
import AdminEditModal from '@/components/admin/AdminEditModal.vue';
import AdminDeleteDialog from '@/components/admin/AdminDeleteDialog.vue';
import type { FormField } from '@/components/admin/AdminFormFields.vue';

definePageMeta({ layout: false });
useHead({ title: 'Véhicules — Transvirex' });

const { get } = useApi();
const loading = ref(true);
const error = ref<string | null>(null);
const vehicles = ref<Array<{
    id: string;
    reference: string;
    type: string;
    plate: string;
    hub: string;
    driver: string | null;
    status: string;
}>>([]);

const createOpen = ref(false);
const editOpen = ref(false);
const deleteOpen = ref(false);
const selectedItem = ref<Record<string, any> | null>(null);

const vehicleFields: FormField[] = [
    { name: 'type', label: 'Type', type: 'text', required: true, placeholder: 'Camion, fourgon, etc.' },
    { name: 'license_plate', label: 'Immatriculation', type: 'text', required: true },
    { name: 'hub_id', label: 'Hub', type: 'select', asyncOptions: { endpoint: '/hubs', labelKey: 'name', valueKey: 'id' } },
];

function editItem(item: any) {
    selectedItem.value = item;
    editOpen.value = true;
}

function deleteItem(item: any) {
    selectedItem.value = item;
    deleteOpen.value = true;
}

function mapStatus(s: string | null): string {
    if (s === 'in_use' || s === 'active') return 'En service';
    if (s === 'maintenance') return 'En maintenance';
    return 'Disponible';
}

async function fetchVehicles() {
    loading.value = true;
    error.value = null;
    try {
        const data = await get<ApiVehicle[]>('/vehicles');
        vehicles.value = data.map((v) => ({
            id: v.id,
            reference: v.reference,
            type: v.type ?? '—',
            plate: v.license_plate ?? '—',
            hub: v.hub?.name ?? '—',
            driver: v.drivers?.[0]
                ? [v.drivers[0].user.firstname, v.drivers[0].user.lastname].filter(Boolean).join(' ')
                : null,
            status: mapStatus(v.status),
        }));
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les véhicules';
    } finally {
        loading.value = false;
    }
}

onMounted(fetchVehicles);
</script>
