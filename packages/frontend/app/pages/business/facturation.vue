<template>
    <AppLayout>
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">Facturation</h1>
                    <p class="text-muted-foreground text-sm mt-1">Devis, bons de commande et factures</p>
                </div>
                <Button @click="openCreate"><Plus class="w-4 h-4 mr-2" />Créer un devis</Button>
            </div>

            <Card>
                <CardContent class="p-4 flex flex-wrap gap-3">
                    <div class="relative flex-1 min-w-48 max-w-sm">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input v-model="search" placeholder="Référence, client..." class="pl-9" />
                    </div>
                    <select
                        v-model="filterStatus"
                        class="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="quotation">Devis</option>
                        <option value="purchase_order">Bon de commande</option>
                        <option value="invoice">Facture</option>
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
                                <TableHead>Référence</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Échéance</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead class="w-40 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="f in filtered" :key="f.id">
                                <TableCell class="font-mono text-xs text-muted-foreground">{{ f.ref }}</TableCell>
                                <TableCell class="font-medium">{{ f.client }}</TableCell>
                                <TableCell>{{ f.service }}</TableCell>
                                <TableCell class="font-semibold">{{ f.amount }}</TableCell>
                                <TableCell class="text-muted-foreground text-xs">{{ f.due }}</TableCell>
                                <TableCell><Badge :class="statusClass(f.status)">{{ statusLabel(f.status) }}</Badge></TableCell>
                                <TableCell>
                                    <div class="flex items-center justify-end gap-1">
                                        <Button
                                            v-if="nextStatus(f.status)"
                                            variant="outline"
                                            size="sm"
                                            class="h-7 text-xs"
                                            :disabled="transitioning === f.id"
                                            @click="advance(f)"
                                            :title="`Passer en ${statusLabel(nextStatus(f.status)!)}`"
                                        >
                                            <Loader2 v-if="transitioning === f.id" class="w-3.5 h-3.5 mr-1 animate-spin" />
                                            → {{ statusLabel(nextStatus(f.status)!) }}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="h-7 w-7 text-muted-foreground hover:text-primary"
                                            :disabled="exporting === f.id"
                                            @click="download(f)"
                                            title="Télécharger le PDF"
                                        >
                                            <Loader2 v-if="exporting === f.id" class="w-3.5 h-3.5 animate-spin" />
                                            <FileDown v-else class="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="filtered.length === 0">
                                <TableCell colspan="7" class="text-center text-muted-foreground py-6">
                                    Aucun document
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div class="px-4 py-3 border-t text-xs text-muted-foreground">{{ filtered.length }} document(s)</div>
                </CardContent>
            </Card>
        </div>

        <Dialog :open="showCreate" @update:open="showCreate = false">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Créer un devis</DialogTitle>
                    <DialogDescription>Nouveau devis (statut initial : Devis). Le montant est calculé à partir des colis.</DialogDescription>
                </DialogHeader>
                <div class="space-y-4 py-4">
                    <div class="space-y-2">
                        <Label>Client</Label>
                        <select v-model="form.customer_id" class="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                            <option value="" disabled>Sélectionner un client</option>
                            <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.customer_name ?? c.reference }}</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <Label>Hub</Label>
                        <select v-model="form.hub_id" class="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                            <option value="" disabled>Sélectionner un hub</option>
                            <option v-for="h in hubs" :key="h.id" :value="h.id">{{ h.name ?? h.reference }}</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <Label>Type de service</Label>
                        <select v-model="form.service_type" class="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                            <option value="standard">Standard</option>
                            <option value="express">Express</option>
                            <option value="freight">Fret</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <Label>Priorité</Label>
                        <select v-model="form.priority" class="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                            <option value="low">Basse</option>
                            <option value="standard">Standard</option>
                            <option value="high">Haute</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <Label>Date d'échéance</Label>
                        <Input v-model="form.due_date" type="date" />
                    </div>
                    <p v-if="formError" class="text-xs text-destructive">{{ formError }}</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showCreate = false">Annuler</Button>
                    <Button :disabled="creating" @click="submitCreate">
                        <Loader2 v-if="creating" class="w-4 h-4 mr-2 animate-spin" />
                        Créer le devis
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown, Loader2, Plus, Search } from '@lucide/vue';
import { exportBonCommandePdf, exportFacturePdf } from '@/composables/usePdfExport';
import { useApi, type ApiCustomer, type ApiInvoice, type PaginatedResponse } from '@/composables/useApi';
import { useAuth } from '@/composables/useAuth';

definePageMeta({ layout: false });
useHead({ title: 'Facturation — Business Manager' });

const { get, post, patch } = useApi();
const { user } = useAuth();

interface Row {
    id: string;
    ref: string;
    client: string;
    service: string;
    serviceRaw: string;
    amount: string;
    priority: string;
    due: string;
    status: string;
}

const loading = ref(true);
const error = ref<string | null>(null);
const search = ref('');
const filterStatus = ref('');
interface HubOption {
    id: string;
    name: string | null;
    reference: string;
    address_id: string | null;
}

const rows = ref<Row[]>([]);
const customers = ref<ApiCustomer[]>([]);
const hubs = ref<HubOption[]>([]);
const exporting = ref<string | null>(null);
const transitioning = ref<string | null>(null);

const showCreate = ref(false);
const creating = ref(false);
const formError = ref<string | null>(null);
const form = ref({ customer_id: '', hub_id: '', service_type: 'standard', priority: 'standard', due_date: '' });

const serviceLabels: Record<string, string> = { express: 'Express', standard: 'Standard', freight: 'Fret' };
const statusLabels: Record<string, string> = { quotation: 'Devis', purchase_order: 'Bon de commande', invoice: 'Facture' };

function statusLabel(s: string) {
    return statusLabels[s] ?? s;
}

/** Next status in the quotation → purchase_order → invoice workflow, or null if final. */
function nextStatus(s: string): string | null {
    if (s === 'quotation') return 'purchase_order';
    if (s === 'purchase_order') return 'invoice';
    return null;
}

const filtered = computed(() =>
    rows.value.filter(
        (f) =>
            (filterStatus.value === '' || f.status === filterStatus.value) &&
            (!search.value ||
                [f.ref, f.client, f.service].some((v) => v.toLowerCase().includes(search.value.toLowerCase()))),
    ),
);

function mapInvoice(inv: ApiInvoice): Row {
    return {
        id: inv.id,
        ref: inv.reference,
        client: inv.customer?.customer_name ?? '—',
        service: serviceLabels[inv.service_type ?? ''] ?? inv.service_type ?? '—',
        serviceRaw: inv.service_type ?? 'standard',
        amount: `€ ${(inv.amount ?? 0).toLocaleString('fr-FR')}`,
        priority: inv.priority.charAt(0).toUpperCase() + inv.priority.slice(1),
        due: new Date(inv.due_date).toLocaleDateString('fr-FR'),
        status: inv.status,
    };
}

async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
        const [invRes, custRes] = await Promise.all([
            get<PaginatedResponse<ApiInvoice>>('/invoices', { limit: 100 }),
            get<ApiCustomer[]>('/customers'),
        ]);
        rows.value = invRes.data.map(mapInvoice);
        customers.value = custRes;
        // GET /hubs is admin/dispatcher only — derive the hub list (with their
        // address_id) from the invoices already returned for business_manager.
        const byId = new Map<string, HubOption>();
        for (const inv of invRes.data) {
            if (inv.hub && !byId.has(inv.hub.id)) {
                byId.set(inv.hub.id, {
                    id: inv.hub.id,
                    name: inv.hub.name,
                    reference: inv.hub.reference,
                    address_id: inv.hub.address_id,
                });
            }
        }
        hubs.value = [...byId.values()];
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les factures';
    } finally {
        loading.value = false;
    }
}

function openCreate() {
    form.value = { customer_id: '', hub_id: '', service_type: 'standard', priority: 'standard', due_date: '' };
    formError.value = null;
    showCreate.value = true;
}

async function submitCreate() {
    formError.value = null;
    const hub = hubs.value.find((h) => h.id === form.value.hub_id);
    if (!form.value.customer_id || !hub || !form.value.due_date) {
        formError.value = 'Client, hub et échéance sont requis.';
        return;
    }
    // Pickup & delivery addresses are required FKs. business_manager cannot manage
    // addresses, so we anchor both on the selected hub's address (refined later by ops).
    if (!hub.address_id) {
        formError.value = "Le hub sélectionné n'a pas d'adresse associée.";
        return;
    }
    if (!user.value?.sub) {
        formError.value = 'Session expirée, veuillez vous reconnecter.';
        return;
    }
    creating.value = true;
    try {
        await post('/invoices', {
            customer_id: form.value.customer_id,
            hub_id: form.value.hub_id,
            pickup_address_id: hub.address_id,
            delivery_address_id: hub.address_id,
            business_manager_id: user.value.sub,
            reference: `DEV-${Date.now().toString(36).toUpperCase()}`,
            priority: form.value.priority,
            service_type: form.value.service_type,
            due_date: new Date(form.value.due_date).toISOString(),
        });
        showCreate.value = false;
        await fetchData();
    } catch (e: any) {
        formError.value = e?.data?.message ?? e?.message ?? 'Échec de la création du devis';
    } finally {
        creating.value = false;
    }
}

async function advance(f: Row) {
    const next = nextStatus(f.status);
    if (!next) return;
    transitioning.value = f.id;
    try {
        await patch(`/invoices/${f.id}/status`, { status: next });
        await fetchData();
    } catch (e) {
        console.error('Failed to transition invoice status', e);
    } finally {
        transitioning.value = null;
    }
}

async function download(f: Row) {
    exporting.value = f.id;
    try {
        const data = { ref: f.ref, client: f.client, service: f.service, amount: f.amount, due: f.due };
        if (f.status === 'invoice') {
            await exportFacturePdf({ ...data, status: statusLabel(f.status), priority: f.priority });
        } else {
            await exportBonCommandePdf({ ...data, status: statusLabel(f.status) });
        }
    } finally {
        exporting.value = null;
    }
}

function statusClass(s: string) {
    return (
        {
            invoice: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
            purchase_order: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
            quotation: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
        } as Record<string, string>
    )[s] ?? '';
}

onMounted(fetchData);
</script>
