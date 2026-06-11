<template>
    <AppLayout>
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">Colis</h1>
                    <p class="text-muted-foreground text-sm mt-1">Suivi de tous les colis</p>
                </div>
                <Button @click="createOpen = true"><Plus class="w-4 h-4 mr-2" />Nouveau colis</Button>
            </div>

            <Card>
                <CardContent class="p-4">
                    <div class="relative max-w-sm">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input v-model="search" placeholder="Référence colis ou facture..." class="pl-9" />
                    </div>
                </CardContent>
            </Card>

            <div v-if="loading" class="text-center py-12 text-muted-foreground">
                <p>Chargement...</p>
            </div>

            <div v-else-if="error" class="text-center py-12 text-muted-foreground">
                <p>Erreur : {{ error }}</p>
                <Button variant="outline" class="mt-4" @click="fetchParcels">Réessayer</Button>
            </div>

            <Card v-else>
                <CardContent class="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Référence</TableHead>
                                <TableHead>Facture</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Poids (kg)</TableHead>
                                <TableHead>Livraison</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead class="w-20">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="c in filtered" :key="c.id">
                                <TableCell class="font-mono text-xs text-muted-foreground">{{ c.ref }}</TableCell>
                                <TableCell class="font-mono text-xs text-primary">{{ c.invoice_ref }}</TableCell>
                                <TableCell class="font-medium">{{ c.client }}</TableCell>
                                <TableCell>{{ c.weight }}</TableCell>
                                <TableCell class="font-mono text-xs text-muted-foreground">{{ c.delivery_ref }}</TableCell>
                                <TableCell><Badge :class="statusClass(c.status)">{{ c.status }}</Badge></TableCell>
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
                    <div class="px-4 py-3 border-t text-xs text-muted-foreground">{{ filtered.length }} colis</div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>

    <AdminEditModal
        v-model:open="editOpen"
        title="Modifier le colis"
        api-endpoint="/parcels"
        :fields="parcelFields"
        :item="selectedItem"
        @success="fetchParcels"
    />

    <Dialog v-model:open="deleteOpen">
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <TriangleAlert class="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce colis ? Cette action est irréversible.
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div v-if="selectedItem" class="text-sm text-muted-foreground border rounded-md p-3 bg-muted/50">
                <span class="font-medium">{{ selectedItem.ref }}</span>
            </div>

            <p v-if="deleteError" class="text-sm text-destructive">{{ deleteError }}</p>

            <DialogFooter>
                <Button variant="outline" @click="deleteOpen = false" :disabled="deleting">Annuler</Button>
                <Button variant="destructive" @click="confirmDelete" :disabled="deleting">
                    <Loader2 v-if="deleting" class="w-4 h-4 mr-2 animate-spin" />
                    Supprimer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <Dialog v-model:open="createOpen">
        <DialogContent class="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Nouveau colis</DialogTitle>
                <DialogDescription>Ajouter un colis à une facture existante</DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
                <div class="grid gap-2">
                    <Label>Facture <span class="text-destructive">*</span></Label>
                    <select
                        v-model="createForm.invoice_id"
                        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="" disabled>Sélectionner une facture...</option>
                        <option v-for="inv in invoices" :key="inv.id" :value="inv.id">
                            {{ inv.ref }} — {{ inv.client }}
                        </option>
                    </select>
                </div>
                <div class="grid gap-2">
                    <Label for="c-weight">Poids (kg) <span class="text-destructive">*</span></Label>
                    <Input id="c-weight" v-model="createForm.weight" type="number" placeholder="0.0" />
                </div>
                <div class="grid gap-2">
                    <Label for="c-ref">Référence (optionnelle)</Label>
                    <Input id="c-ref" v-model="createForm.reference" placeholder="Auto-générée si vide" />
                </div>
            </div>

            <p v-if="createError" class="text-sm text-destructive px-1">{{ createError }}</p>

            <DialogFooter>
                <Button variant="outline" @click="createOpen = false" :disabled="creating">Annuler</Button>
                <Button @click="submitCreate" :disabled="creating || !createForm.invoice_id">
                    <Loader2 v-if="creating" class="w-4 h-4 mr-2 animate-spin" />
                    Créer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Pencil, Plus, Search, Trash2, TriangleAlert } from '@lucide/vue';
import type { ApiInvoice, ApiParcel, PaginatedResponse } from '@/composables/useApi';
import AdminEditModal from '@/components/admin/AdminEditModal.vue';
import type { FormField } from '@/components/admin/AdminFormFields.vue';

definePageMeta({ layout: false });
useHead({ title: 'Colis — Transvirex' });

const { get, post, del } = useApi();
const search = ref('');
const loading = ref(true);
const error = ref<string | null>(null);
const parcels = ref<Array<{
    id: string;
    ref: string;
    invoice_ref: string;
    invoice_id: string;
    client: string;
    weight: string;
    delivery_ref: string;
    status: string;
}>>([]);

const createOpen = ref(false);
const editOpen = ref(false);
const deleteOpen = ref(false);
const selectedItem = ref<Record<string, any> | null>(null);

const createForm = ref({ invoice_id: '', weight: 0, reference: '' });
const creating = ref(false);
const createError = ref<string | null>(null);

const deleting = ref(false);
const deleteError = ref<string | null>(null);

const invoices = ref<Array<{ id: string; ref: string; client: string }>>([]);

const parcelFields: FormField[] = [
    { name: 'weight', label: 'Poids (kg)', type: 'number', required: true },
    { name: 'reference', label: 'Référence', type: 'text' },
];

const statusLabels: Record<string, string> = {
    delivered: 'Livré',
    planned: 'En attente',
    delivering: 'En cours',
    cancelled: 'Annulé',
    blocked: 'Bloqué',
    delayed: 'Retardé',
};

function editItem(item: any) {
    selectedItem.value = item;
    editOpen.value = true;
}

function deleteItem(item: any) {
    selectedItem.value = item;
    deleteOpen.value = true;
}

async function loadInvoices() {
    try {
        const res = await get<PaginatedResponse<ApiInvoice>>('/invoices?limit=200');
        invoices.value = res.data.map((i) => ({
            id: i.id,
            ref: i.reference,
            client: i.customer?.customer_name ?? '—',
        }));
    } catch {
        invoices.value = [];
    }
}

async function submitCreate() {
    if (!createForm.value.invoice_id) return;
    creating.value = true;
    createError.value = null;
    try {
        await post(`/invoices/${createForm.value.invoice_id}/parcels`, {
            weight: Number(createForm.value.weight),
            reference: createForm.value.reference || undefined,
        });
        createOpen.value = false;
        createForm.value = { invoice_id: '', weight: 0, reference: '' };
        await fetchParcels();
    } catch (e: any) {
        createError.value = e?.message ?? 'Erreur lors de la création';
    } finally {
        creating.value = false;
    }
}

async function confirmDelete() {
    if (!selectedItem.value?.id) return;
    deleting.value = true;
    deleteError.value = null;
    try {
        const item = selectedItem.value as any;
        await del(`/invoices/${item.invoice_id}/parcels/${item.id}`);
        deleteOpen.value = false;
        await fetchParcels();
    } catch (e: any) {
        deleteError.value = e?.message ?? 'Erreur lors de la suppression';
    } finally {
        deleting.value = false;
    }
}

async function fetchParcels() {
    loading.value = true;
    error.value = null;
    try {
        const res = await get<PaginatedResponse<ApiParcel>>('/parcels?limit=200');
        parcels.value = res.data.map((p) => {
            const delivery = p.invoice?.deliveries?.[0];
            return {
                id: p.id,
                ref: p.reference,
                invoice_ref: p.invoice?.reference ?? '—',
                invoice_id: p.invoice_id,
                client: p.invoice?.customer?.customer_name ?? '—',
                weight: String(p.weight),
                delivery_ref: delivery?.reference ?? '—',
                status: delivery ? (statusLabels[delivery.status ?? ''] ?? delivery.status ?? '—') : '—',
            };
        });
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les colis';
    } finally {
        loading.value = false;
    }
}

const filtered = computed(() =>
    parcels.value.filter(
        (c) => !search.value || Object.values(c).some((v) => String(v).toLowerCase().includes(search.value.toLowerCase())),
    ),
);

function statusClass(s: string) {
    return (
        {
            Livré: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
            'En cours': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
            'En attente': 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
            Retardé: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
        } as Record<string, string>
    )[s] ?? '';
}

onMounted(async () => {
    await loadInvoices();
    await fetchParcels();
});
</script>
