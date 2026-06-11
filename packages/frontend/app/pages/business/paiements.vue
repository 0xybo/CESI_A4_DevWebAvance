<template>
    <AppLayout>
        <div class="space-y-6">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">Paiements & relances</h1>
                <p class="text-muted-foreground text-sm mt-1">Suivi des règlements et relances des impayés</p>
            </div>

            <div v-if="loading" class="text-center py-12 text-muted-foreground"><p>Chargement...</p></div>

            <div v-else-if="error" class="text-center py-12 text-muted-foreground">
                <p>Erreur : {{ error }}</p>
                <Button variant="outline" class="mt-4" @click="fetchData">Réessayer</Button>
            </div>

            <template v-else>
                <!-- Impayés en retard -->
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <AlertTriangle class="w-4 h-4 text-orange-500" />
                        <h2 class="text-lg font-semibold">À relancer</h2>
                        <Badge variant="outline">{{ overdue.length }}</Badge>
                    </div>
                    <Card>
                        <CardContent class="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Référence</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Montant</TableHead>
                                        <TableHead>Échéance</TableHead>
                                        <TableHead>Retard</TableHead>
                                        <TableHead class="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="inv in overdue" :key="inv.id">
                                        <TableCell class="font-mono text-xs text-muted-foreground">{{ inv.ref }}</TableCell>
                                        <TableCell class="font-medium">{{ inv.client }}</TableCell>
                                        <TableCell class="font-semibold">{{ inv.amount }}</TableCell>
                                        <TableCell class="text-muted-foreground text-xs">{{ inv.due }}</TableCell>
                                        <TableCell><Badge class="bg-orange-100 text-orange-700 border-orange-200">{{ inv.daysLate }} j</Badge></TableCell>
                                        <TableCell>
                                            <div class="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    class="h-7 text-xs"
                                                    :disabled="exporting === inv.id"
                                                    @click="relance(inv)"
                                                >
                                                    <Loader2 v-if="exporting === inv.id" class="w-3.5 h-3.5 mr-1 animate-spin" />
                                                    <FileDown v-else class="w-3.5 h-3.5 mr-1" />
                                                    Relance
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    class="h-7 text-xs text-green-700 hover:text-green-800"
                                                    :disabled="marking === inv.id"
                                                    @click="markPaid(inv)"
                                                >
                                                    <Loader2 v-if="marking === inv.id" class="w-3.5 h-3.5 mr-1 animate-spin" />
                                                    <Check v-else class="w-3.5 h-3.5 mr-1" />
                                                    Marquer payé
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow v-if="overdue.length === 0">
                                        <TableCell colspan="6" class="text-center text-muted-foreground py-6">
                                            Aucun impayé en retard 🎉
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <!-- Historique des paiements -->
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <CheckCircle2 class="w-4 h-4 text-green-500" />
                        <h2 class="text-lg font-semibold">Historique des paiements</h2>
                        <Badge variant="outline">{{ paid.length }}</Badge>
                    </div>
                    <Card>
                        <CardContent class="p-0 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Référence</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Montant</TableHead>
                                        <TableHead>Échéance</TableHead>
                                        <TableHead>Payée le</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="inv in paid" :key="inv.id">
                                        <TableCell class="font-mono text-xs text-muted-foreground">{{ inv.ref }}</TableCell>
                                        <TableCell class="font-medium">{{ inv.client }}</TableCell>
                                        <TableCell class="font-semibold">{{ inv.amount }}</TableCell>
                                        <TableCell class="text-muted-foreground text-xs">{{ inv.due }}</TableCell>
                                        <TableCell class="text-green-700 text-xs">{{ inv.paidOn }}</TableCell>
                                    </TableRow>
                                    <TableRow v-if="paid.length === 0">
                                        <TableCell colspan="5" class="text-center text-muted-foreground py-6">
                                            Aucun paiement enregistré
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </template>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Check, CheckCircle2, FileDown, Loader2 } from '@lucide/vue';
import { exportRelancePdf } from '@/composables/usePdfExport';
import { useApi, type ApiInvoice, type PaginatedResponse } from '@/composables/useApi';

definePageMeta({ layout: false });
useHead({ title: 'Paiements & relances — Business Manager' });

const { get, patch } = useApi();

interface Row {
    id: string;
    ref: string;
    client: string;
    amount: string;
    due: string;
    daysLate: number;
    paidOn: string;
}

const loading = ref(true);
const error = ref<string | null>(null);
const invoices = ref<ApiInvoice[]>([]);
const exporting = ref<string | null>(null);
const marking = ref<string | null>(null);

function fmtAmount(n: number) {
    return `€ ${(n ?? 0).toLocaleString('fr-FR')}`;
}

function mapRow(inv: ApiInvoice): Row {
    const due = new Date(inv.due_date);
    const daysLate = Math.max(0, Math.floor((Date.now() - due.getTime()) / 86_400_000));
    return {
        id: inv.id,
        ref: inv.reference,
        client: inv.customer?.customer_name ?? '—',
        amount: fmtAmount(inv.amount),
        due: due.toLocaleDateString('fr-FR'),
        daysLate,
        paidOn: inv.payment_date ? new Date(inv.payment_date).toLocaleDateString('fr-FR') : '—',
    };
}

const overdue = computed(() =>
    invoices.value
        .filter((i) => i.status === 'invoice' && !i.payment_date && new Date(i.due_date) < new Date())
        .map(mapRow),
);

const paid = computed(() => invoices.value.filter((i) => !!i.payment_date).map(mapRow));

async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
        const res = await get<PaginatedResponse<ApiInvoice>>('/invoices', { limit: 100 });
        invoices.value = res.data;
    } catch (e: any) {
        error.value = e?.message ?? 'Impossible de charger les paiements';
    } finally {
        loading.value = false;
    }
}

async function relance(inv: Row) {
    exporting.value = inv.id;
    try {
        await exportRelancePdf({ ref: inv.ref, client: inv.client, amount: inv.amount, due: inv.due });
    } finally {
        exporting.value = null;
    }
}

async function markPaid(inv: Row) {
    marking.value = inv.id;
    try {
        await patch(`/invoices/${inv.id}`, { payment_date: new Date().toISOString() });
        await fetchData();
    } catch (e) {
        console.error('Failed to mark invoice as paid', e);
    } finally {
        marking.value = null;
    }
}

onMounted(fetchData);
</script>
