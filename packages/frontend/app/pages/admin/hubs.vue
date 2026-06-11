<template>
    <AppLayout>
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">Hubs</h1>
                    <p class="text-muted-foreground text-sm mt-1">Centres de distribution</p>
                </div>
                <Button @click="createOpen = true"><Plus class="w-4 h-4 mr-2" />Nouveau hub</Button>
            </div>

            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <Card v-for="i in 6" :key="i">
                    <CardHeader class="pb-3">
                        <div class="w-10 h-10 rounded-lg bg-muted/50 animate-pulse" />
                        <div class="h-4 w-32 bg-muted/50 animate-pulse rounded mt-3" />
                        <div class="h-3 w-24 bg-muted/30 animate-pulse rounded mt-1" />
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div v-for="j in 4" :key="j" class="h-3 bg-muted/30 animate-pulse rounded" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div v-else-if="error" class="text-center py-12 text-muted-foreground">
                <p>Erreur : {{ error }}</p>
                <Button variant="outline" class="mt-4" @click="fetchHubs">Réessayer</Button>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <Card v-for="hub in hubs" :key="hub.id" class="relative">
                    <CardHeader class="pb-3">
                        <div class="flex items-start justify-between">
                            <div
                                class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
                            >
                                <Building2 class="w-5 h-5 text-primary" />
                            </div>
                            <div class="flex items-center gap-1">
                                <Button variant="ghost" size="icon" class="h-7 w-7" @click="editItem(hub)">
                                    <Pencil class="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" class="h-7 w-7 text-destructive hover:text-destructive" @click="deleteItem(hub)">
                                    <Trash2 class="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                        <CardTitle class="text-sm mt-3">{{ hub.name }}</CardTitle>
                        <CardDescription class="font-mono text-xs">{{ hub.reference }}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-1.5 text-xs">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Adresse</span>
                                <span>{{ hub.address }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Capacité/jour</span>
                                <span class="font-semibold">{{ hub.capacity }} colis</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Chauffeurs</span>
                                <span>{{ hub.drivers }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Téléphone</span>
                                <span>{{ hub.phone }}</span>
                            </div>
                        </div>
                    </CardContent>
                    <Badge
                        :class="
                            hub.badgeClass
                        "
                        class="absolute top-3 right-12"
                    >
                        {{ hub.status === 'active' ? 'Actif' : 'Inactif' }}
                    </Badge>
                </Card>
            </div>
        </div>
    </AppLayout>

    <AdminCreateModal
        v-model:open="createOpen"
        title="Nouveau hub"
        api-endpoint="/hubs"
        :fields="hubFields"
        @success="fetchHubs"
    />

    <AdminEditModal
        v-model:open="editOpen"
        title="Modifier le hub"
        api-endpoint="/hubs"
        :fields="hubFields"
        :item="selectedItem"
        @success="fetchHubs"
    />

    <AdminDeleteDialog
        v-model:open="deleteOpen"
        api-endpoint="/hubs"
        :item="selectedItem"
        @success="fetchHubs"
    />
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Pencil, Plus, Trash2 } from '@lucide/vue';
import type { ApiHub } from '@/composables/useApi';
import AdminCreateModal from '@/components/admin/AdminCreateModal.vue';
import AdminEditModal from '@/components/admin/AdminEditModal.vue';
import AdminDeleteDialog from '@/components/admin/AdminDeleteDialog.vue';
import type { FormField } from '@/components/admin/AdminFormFields.vue';

definePageMeta({ layout: false });
useHead({ title: 'Hubs — Transvirex' });

const { get } = useApi();
const loading = ref(true);
const error = ref<string | null>(null);
const hubs = ref<Array<{
    id: string;
    reference: string;
    name: string;
    address: string;
    capacity: number;
    drivers: number;
    phone: string;
    status: string;
    badgeClass: string;
}>>([]);

const createOpen = ref(false);
const editOpen = ref(false);
const deleteOpen = ref(false);
const selectedItem = ref<Record<string, any> | null>(null);

const hubFields: FormField[] = [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'phone_number', label: 'Téléphone', type: 'text' },
    { name: 'capacity_parcels_day', label: 'Capacité (colis/jour)', type: 'number' },
    { name: 'status', label: 'Statut', type: 'select', options: [
        { value: 'active', label: 'Actif' },
        { value: 'inactive', label: 'Inactif' },
        { value: 'unavailable', label: 'Indisponible' },
    ]},
];

function editItem(item: any) {
    selectedItem.value = item;
    editOpen.value = true;
}

function deleteItem(item: any) {
    selectedItem.value = item;
    deleteOpen.value = true;
}

async function fetchHubs() {
    loading.value = true;
    error.value = null;
    try {
        const data = await get<ApiHub[]>('/hubs');
        hubs.value = data.map((h) => ({
            id: h.id,
            reference: h.reference,
            name: h.name ?? '',
            address: [h.address?.address, h.address?.postal_code, h.address?.city].filter(Boolean).join(', ') || '—',
            capacity: h.capacity_parcels_day ?? 0,
            drivers: h._count.users,
            phone: h.phone_number ?? '—',
            status: h.status ?? 'inactive',
            badgeClass: h.status === 'active'
                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100',
        }));
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les hubs';
    } finally {
        loading.value = false;
    }
}

onMounted(fetchHubs);
</script>
