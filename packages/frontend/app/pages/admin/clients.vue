<template>
    <AppLayout>
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">Clients</h1>
                    <p class="text-muted-foreground text-sm mt-1">Gestion du portefeuille clients</p>
                </div>
                <Button @click="createOpen = true"><Plus class="w-4 h-4 mr-2" />Nouveau client</Button>
            </div>

            <Card>
                <CardContent class="p-4">
                    <div class="relative max-w-sm">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input v-model="search" placeholder="Nom, email, hub..." class="pl-9" />
                    </div>
                </CardContent>
            </Card>

            <div v-if="loading" class="text-center py-12 text-muted-foreground">
                <p>Chargement...</p>
            </div>

            <div v-else-if="error" class="text-center py-12 text-muted-foreground">
                <p>Erreur : {{ error }}</p>
                <Button variant="outline" class="mt-4" @click="fetchClients">Réessayer</Button>
            </div>

            <Card v-else>
                <CardContent class="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Référence</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Hub</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead class="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="c in filtered" :key="c.id">
                                <TableCell class="font-mono text-xs text-muted-foreground">{{ c.reference }}</TableCell>
                                <TableCell class="font-medium">{{ c.customer_name }}</TableCell>
                                <TableCell><Badge variant="outline">{{ c.customer_type }}</Badge></TableCell>
                                <TableCell class="text-muted-foreground">{{ c.contact }}</TableCell>
                                <TableCell class="text-xs text-muted-foreground">{{ c.email }}</TableCell>
                                <TableCell>{{ c.hub_name }}</TableCell>
                                <TableCell>
                                    <Badge
                                        :class="
                                            c.status === 'active'
                                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
                                                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        "
                                    >
                                        {{ c.status === 'active' ? 'Actif' : 'Inactif' }}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div class="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" class="h-8 w-8" @click="editItem(c)">
                                            <Pencil class="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive hover:text-destructive" @click="deleteItem(c)">
                                            <Trash2 class="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div class="px-4 py-3 border-t text-xs text-muted-foreground">
                        {{ filtered.length }} client(s)
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>

    <AdminCreateModal
        v-model:open="createOpen"
        title="Nouveau client"
        api-endpoint="/customers"
        :fields="customerFields"
        @success="fetchClients"
    />

    <AdminEditModal
        v-model:open="editOpen"
        title="Modifier le client"
        api-endpoint="/customers"
        :fields="customerFields"
        :item="selectedItem"
        @success="fetchClients"
    />

    <AdminDeleteDialog
        v-model:open="deleteOpen"
        api-endpoint="/customers"
        :item="selectedItem"
        @success="fetchClients"
    />
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Plus, Search, Trash2 } from '@lucide/vue';
import type { ApiCustomer } from '@/composables/useApi';
import AdminCreateModal from '@/components/admin/AdminCreateModal.vue';
import AdminEditModal from '@/components/admin/AdminEditModal.vue';
import AdminDeleteDialog from '@/components/admin/AdminDeleteDialog.vue';
import type { FormField } from '@/components/admin/AdminFormFields.vue';

definePageMeta({ layout: false });
useHead({ title: 'Clients — Transvirex' });

const { get } = useApi();
const search = ref('');
const loading = ref(true);
const error = ref<string | null>(null);
const clients = ref<Array<{
    id: string;
    reference: string;
    customer_name: string;
    customer_type: string;
    contact: string;
    email: string;
    hub_name: string;
    status: string;
}>>([]);

const createOpen = ref(false);
const editOpen = ref(false);
const deleteOpen = ref(false);
const selectedItem = ref<Record<string, any> | null>(null);

const customerFields: FormField[] = [
    { name: 'customer_name', label: 'Nom', type: 'text', required: true },
    { name: 'customer_type', label: 'Type', type: 'select', options: [{ value: 'company', label: 'Entreprise' }, { value: 'individual', label: 'Particulier' }] },
    { name: 'contact_firstname', label: 'Prénom du contact', type: 'text' },
    { name: 'contact_lastname', label: 'Nom du contact', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone_number', label: 'Téléphone', type: 'text' },
    { name: 'hub_id', label: 'Hub', type: 'select', asyncOptions: { endpoint: '/hubs', labelKey: 'name', valueKey: 'id' } },
    { name: 'status', label: 'Statut', type: 'select', options: [{ value: 'active', label: 'Actif' }, { value: 'inactive', label: 'Inactif' }] },
];

function editItem(item: any) {
    selectedItem.value = item;
    editOpen.value = true;
}

function deleteItem(item: any) {
    selectedItem.value = item;
    deleteOpen.value = true;
}

async function fetchClients() {
    loading.value = true;
    error.value = null;
    try {
        const data = await get<ApiCustomer[]>('/customers');
        clients.value = data.map((c) => ({
            id: c.id,
            reference: c.reference,
            customer_name: c.customer_name ?? '—',
            customer_type: c.customer_type ?? '—',
            contact: [c.contact_firstname, c.contact_lastname].filter(Boolean).join(' ') || '—',
            email: c.email ?? '—',
            hub_name: c.hub?.name ?? '—',
            status: c.status,
        }));
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les clients';
    } finally {
        loading.value = false;
    }
}

const filtered = computed(() =>
    clients.value.filter(
        (c) => !search.value || Object.values(c).some((v) => String(v).toLowerCase().includes(search.value.toLowerCase())),
    ),
);

onMounted(fetchClients);
</script>
