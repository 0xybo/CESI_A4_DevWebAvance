<template>
    <AppLayout>
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">Rapports</h1>
                    <p class="text-muted-foreground text-sm mt-1">Indicateurs de performance</p>
                </div>
                <Button variant="outline" @click="exportPdf" :disabled="exporting">
                    <Loader2 v-if="exporting" class="w-4 h-4 mr-2 animate-spin" />
                    <Download v-else class="w-4 h-4 mr-2" />
                    Exporter
                </Button>
            </div>

            <Card>
                <CardContent class="p-4 flex flex-wrap items-center gap-3">
                    <div class="flex items-center gap-2">
                        <Label class="text-xs whitespace-nowrap">Du</Label>
                        <Input v-model="filterDateFrom" type="date" class="h-9 w-40" />
                    </div>
                    <div class="flex items-center gap-2">
                        <Label class="text-xs whitespace-nowrap">Au</Label>
                        <Input v-model="filterDateTo" type="date" class="h-9 w-40" />
                    </div>
                    <select
                        v-model="filterHub"
                        class="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="">Tous les hubs</option>
                        <option v-for="h in hubsList" :key="h.id" :value="h.id">{{ h.name }}</option>
                    </select>
                    <select
                        v-model="filterDriver"
                        class="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="">Tous les chauffeurs</option>
                        <option v-for="dr in driversList" :key="dr.id" :value="dr.id">{{ dr.name }}</option>
                    </select>
                </CardContent>
            </Card>

            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Card v-for="i in 4" :key="i">
                    <CardHeader class="pb-2">
                        <div class="h-3 w-20 bg-muted/50 animate-pulse rounded" />
                        <div class="h-7 w-16 bg-muted/50 animate-pulse rounded mt-1" />
                    </CardHeader>
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
                            <p class="text-xs" :class="kpi.trend >= 0 ? 'text-green-600' : 'text-red-500'">
                                {{ kpi.trend >= 0 ? '▲' : '▼' }} {{ Math.abs(kpi.trend) }}% ce mois
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle class="text-base">Livraisons par statut</CardTitle></CardHeader>
                        <CardContent>
                            <div v-if="filteredDeliveryStats.length === 0" class="text-sm text-muted-foreground text-center py-4">
                                Aucune livraison dans cette période
                            </div>
                            <div v-else class="space-y-3">
                                <div v-for="stat in filteredDeliveryStats" :key="stat.label" class="flex items-center gap-3">
                                    <span class="text-sm text-muted-foreground w-24 flex-shrink-0">{{ stat.label }}</span>
                                    <div class="flex-1 bg-muted rounded-full h-2">
                                        <div
                                            class="h-2 rounded-full transition-all"
                                            :class="stat.color"
                                            :style="{ width: stat.pct + '%' }"
                                        />
                                    </div>
                                    <span class="text-sm font-semibold w-10 text-right">{{ stat.count }}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle class="text-base">Performance par hub</CardTitle></CardHeader>
                        <CardContent class="p-0 overflow-x-auto">
                            <div v-if="filteredHubPerf.length === 0" class="text-sm text-muted-foreground text-center py-4">
                                Aucune donnée disponible
                            </div>
                            <Table v-else>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hub</TableHead>
                                        <TableHead class="text-right">Livraisons</TableHead>
                                        <TableHead class="text-right">Taux succès</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="h in filteredHubPerf" :key="h.name">
                                        <TableCell>{{ h.name }}</TableCell>
                                        <TableCell class="text-right text-muted-foreground">{{ h.deliveries }}</TableCell>
                                        <TableCell
                                            class="text-right font-semibold"
                                            :class="h.rate >= 95 ? 'text-green-600' : h.rate >= 85 ? 'text-orange-500' : 'text-red-500'"
                                        >{{ h.rate }}%</TableCell>
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Loader2 } from '@lucide/vue';
import type { ApiDelivery, ApiHub, ApiInvoice, ApiUser, PaginatedResponse } from '@/composables/useApi';
import { exportRapportPdf, type ReportData } from '@/composables/usePdfExport';

definePageMeta({ layout: false });
useHead({ title: 'Rapports — Transvirex' });

const { get } = useApi();
const loading = ref(true);
const error = ref<string | null>(null);

const filterDateFrom = ref('');
const filterDateTo = ref('');
const filterHub = ref('');
const filterDriver = ref('');

const hubsList = ref<Array<{ id: string; name: string }>>([]);
const driversList = ref<Array<{ id: string; name: string }>>([]);

const allDeliveries = ref<ApiDelivery[]>([]);
const allInvoices = ref<ApiInvoice[]>([]);
const allHubs = ref<ApiHub[]>([]);

const kpis = ref<Array<{ label: string; value: string; trend: number }>>([]);
const deliveryStats = ref<Array<{ label: string; count: number; pct: number; color: string }>>([]);
const hubPerf = ref<Array<{ name: string; deliveries: number; rate: number }>>([]);

const exporting = ref(false);

const statusColors: Record<string, string> = {
    Livré: 'bg-green-500',
    'En cours': 'bg-blue-500',
    Retardé: 'bg-orange-400',
    Annulé: 'bg-red-400',
    Bloqué: 'bg-purple-400',
    Planifié: 'bg-gray-400',
};

const statusLabels: Record<string, string> = {
    delivered: 'Livré', planned: 'Planifié', delivering: 'En cours',
    cancelled: 'Annulé', blocked: 'Bloqué', delayed: 'Retardé',
};

function filterDeliveries() {
    const from = filterDateFrom.value ? new Date(filterDateFrom.value) : null;
    const to = filterDateTo.value ? new Date(filterDateTo.value + 'T23:59:59') : null;

    return allDeliveries.value.filter((d) => {
        if (filterHub.value && d.invoice?.hub?.id !== filterHub.value) return false;
        if (filterDriver.value && d.driver_id !== filterDriver.value) return false;
        if (from || to) {
            const dd = d.invoice?.due_date ? new Date(d.invoice.due_date) : null;
            if (!dd) return false;
            if (from && dd < from) return false;
            if (to && dd > to) return false;
        }
        return true;
    });
}

const filteredDeliveries = computed(filterDeliveries);

const filteredDeliveryStats = computed(() => {
    const deliveries = filteredDeliveries.value;
    const statusCountMap: Record<string, number> = {};
    for (const d of deliveries) {
        const label = statusLabels[d.status] ?? d.status;
        statusCountMap[label] = (statusCountMap[label] ?? 0) + 1;
    }
    const total = deliveries.length || 1;
    return Object.entries(statusCountMap)
        .map(([label, count]) => ({
            label,
            count,
            pct: Math.round((count / total) * 1000) / 10,
            color: statusColors[label] ?? 'bg-gray-400',
        }))
        .sort((a, b) => b.count - a.count);
});

const filteredHubPerf = computed(() => {
    const deliveries = filteredDeliveries.value;
    return allHubs.value
        .filter((h) => !filterHub.value || h.id === filterHub.value)
        .map((hub) => {
            const hubDeliveries = deliveries.filter((d) => d.invoice?.hub?.id === hub.id);
            const hubSuccess = hubDeliveries.filter((d) => d.status === 'delivered').length;
            return {
                name: hub.name ?? hub.reference,
                deliveries: hubDeliveries.length,
                rate: hubDeliveries.length > 0 ? Math.round((hubSuccess / hubDeliveries.length) * 1000) / 10 : 0,
            };
        })
        .sort((a, b) => b.deliveries - a.deliveries);
});

function computeKpis(deliveries: ApiDelivery[], invoices: ApiInvoice[]) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthDeliveries = deliveries.filter((d) => {
        const dd = d.invoice?.due_date ? new Date(d.invoice.due_date) : null;
        return dd && dd >= monthStart;
    });

    const totalMonth = monthDeliveries.length;
    const successCount = monthDeliveries.filter((d) => d.status === 'delivered').length;
    const successRate = totalMonth > 0 ? Math.round((successCount / totalMonth) * 1000) / 10 : 0;
    const avgDelay = totalMonth > 0
        ? Math.round(monthDeliveries.reduce((sum, d) => sum + (d.status === 'delayed' ? 1 : 0), 0) / totalMonth * 100) / 100
        : 0;
    const monthlyRev = invoices
        .filter((inv) => {
            const d = new Date(inv.due_date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && inv.status === 'invoice';
        })
        .reduce((sum, inv) => sum + inv.amount, 0);
    const prevMonthRev = invoices
        .filter((inv) => {
            const d = new Date(inv.due_date);
            const pm = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
            const py = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
            return d.getMonth() === pm && d.getFullYear() === py && inv.status === 'invoice';
        })
        .reduce((sum, inv) => sum + inv.amount, 0);
    const revTrend = prevMonthRev > 0 ? Math.round(((monthlyRev - prevMonthRev) / prevMonthRev) * 100) : 0;

    kpis.value = [
        { label: 'Livraisons ce mois', value: String(totalMonth), trend: 0 },
        { label: 'Taux de succès', value: `${successRate}%`, trend: 0 },
        { label: 'Taux de retard', value: `${avgDelay}%`, trend: 0 },
        { label: 'CA mensuel', value: `€ ${monthlyRev.toLocaleString('fr-FR')}`, trend: revTrend },
    ];
}

async function fetchData() {
    loading.value = true;
    error.value = null;
    try {
        const [deliveriesRes, invoicesRes, hubsRes] = await Promise.all([
            get<PaginatedResponse<ApiDelivery>>('/deliveries?limit=1000'),
            get<PaginatedResponse<ApiInvoice>>('/invoices?limit=1000'),
            get<ApiHub[]>('/hubs'),
        ]);

        allDeliveries.value = deliveriesRes.data;
        allInvoices.value = invoicesRes.data;
        allHubs.value = hubsRes;

        computeKpis(allDeliveries.value, allInvoices.value);
    } catch (e: any) {
        error.value = e?.message ?? 'Erreur lors du chargement des rapports';
    } finally {
        loading.value = false;
    }
}

async function loadFilters() {
    try {
        const driversRes = await get<PaginatedResponse<ApiUser>>('/users?role=driver&limit=200');
        driversList.value = driversRes.data.map((u) => ({
            id: u.id,
            name: [u.firstname, u.lastname].filter(Boolean).join(' ') || u.email || u.reference,
        }));

        const hubs = await get<ApiHub[]>('/hubs');
        hubsList.value = hubs.map((h) => ({ id: h.id, name: h.name ?? h.reference }));
    } catch {
        // Silently fail — filters will just be empty
    }
}

const reportTitle = computed(() => {
    const parts: string[] = [];
    if (filterDateFrom.value || filterDateTo.value) {
        parts.push(`${filterDateFrom.value || '...'} → ${filterDateTo.value || '...'}`);
    }
    if (filterHub.value) {
        const h = hubsList.value.find((x) => x.id === filterHub.value);
        if (h) parts.push(h.name);
    }
    if (filterDriver.value) {
        const d = driversList.value.find((x) => x.id === filterDriver.value);
        if (d) parts.push(d.name);
    }
    return parts.length > 0 ? parts.join(' | ') : 'Tous';
});

async function exportPdf() {
    exporting.value = true;
    try {
        const data: ReportData = {
            title: reportTitle.value,
            kpis: kpis.value,
            deliveryStats: filteredDeliveryStats.value,
            hubPerf: filteredHubPerf.value,
        };
        await exportRapportPdf(data);
    } finally {
        exporting.value = false;
    }
}

onMounted(async () => {
    await Promise.all([fetchData(), loadFilters()]);
});
</script>
