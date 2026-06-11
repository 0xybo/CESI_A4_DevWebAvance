<template>
    <div class="max-w-4xl mx-auto space-y-8">
        <div class="space-y-1">
            <h1 class="text-3xl font-bold text-slate-900">Notifications (test)</h1>
            <p class="text-gray-500">Déclencher manuellement des notifications SSE et/ou MongoDB</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card v-for="preset in presets" :key="preset.id">
                <CardHeader class="pb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="preset.color">
                            <component :is="preset.icon" class="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle class="text-sm">{{ preset.label }}</CardTitle>
                            <CardDescription class="text-xs">{{ preset.description }}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p class="text-xs text-muted-foreground mb-3">{{ preset.message }}</p>
                    <div class="flex flex-wrap items-center gap-2">
                        <select
                            v-model="audience[preset.id]"
                            class="h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="all">Tous</option>
                            <option value="driver">Chauffeurs</option>
                            <option value="dispatcher">Répartiteurs</option>
                        </select>
                        <Button size="sm" variant="outline" :disabled="sending[preset.id]" @click="sendPreset(preset)">
                            <Loader2Icon v-if="sending[preset.id]" class="w-3 h-3 mr-1 animate-spin" />
                            Envoyer
                        </Button>
                    </div>
                    <p v-if="result[preset.id]" class="text-xs text-green-600 mt-2">{{ result[preset.id] }}</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle class="text-sm">Envoi personnalisé</CardTitle>
                <CardDescription class="text-xs">Composer un événement SSE arbitraire</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-1">
                        <Label class="text-xs">Type d'événement</Label>
                        <select
                            v-model="custom.event"
                            class="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="delivery:status">delivery:status</option>
                            <option value="delivery:assigned">delivery:assigned</option>
                            <option value="delivery:incident">delivery:incident</option>
                            <option value="delivery:overdue">delivery:overdue</option>
                            <option value="position:update">position:update</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <Label class="text-xs">Audience</Label>
                        <select
                            v-model="custom.audience"
                            class="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="all">Tous</option>
                            <option value="driver">Chauffeurs</option>
                            <option value="dispatcher">Répartiteurs</option>
                        </select>
                    </div>
                    <div class="space-y-1">
                        <Label class="text-xs">Message</Label>
                        <Input v-model="custom.message" placeholder="Contenu de la notification" class="h-9" />
                    </div>
                    <div class="space-y-1">
                        <Label class="text-xs">User ID (optionnel)</Label>
                        <Input v-model="custom.userId" placeholder="sub de l'utilisateur" class="h-9" />
                    </div>
                </div>
                <Button size="sm" :disabled="customSending" @click="sendCustom">
                    <Loader2Icon v-if="customSending" class="w-3 h-3 mr-1 animate-spin" />
                    Envoyer
                </Button>
                <p
                    v-if="customResult"
                    class="text-xs"
                    :class="customResult.startsWith('✓') ? 'text-green-600' : 'text-red-600'"
                >
                    {{ customResult }}
                </p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle class="text-sm">Dernières notifications SSE reçues</CardTitle>
                <CardDescription class="text-xs">
                    Les événements captés par le navigateur pendant cette session
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="sseLog.length === 0" class="text-sm text-muted-foreground text-center py-4">
                    Aucun événement reçu. Ouvrez la connexion SSE avec le bouton ci-dessous.
                </div>
                <div v-else class="space-y-1 max-h-80 overflow-y-auto">
                    <div
                        v-for="(entry, i) in sseLog"
                        :key="i"
                        class="flex items-start gap-2 p-2 rounded text-xs font-mono bg-muted/40"
                    >
                        <span class="text-muted-foreground shrink-0 w-10">{{ entry.time }}</span>
                        <span class="font-semibold shrink-0" :class="eventColor(entry.event)">{{ entry.event }}</span>
                        <span class="text-muted-foreground truncate">{{ entry.data }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" @click="toggleSse">
                        <PlugZapIcon v-if="!sseConnected" class="w-3 h-3 mr-1" />
                        <XIcon v-else class="w-3 h-3 mr-1" />
                        {{ sseConnected ? 'Déconnecter' : 'Connecter SSE' }}
                    </Button>
                    <Button size="sm" variant="ghost" @click="sseLog = []">Effacer</Button>
                    <span v-if="sseConnected" class="text-xs text-green-600 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
                        Connecté
                    </span>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertTriangleIcon,
    BellIcon,
    BellRingIcon,
    CarIcon,
    CheckCheckIcon,
    ClockIcon,
    Loader2Icon,
    MapPinIcon,
    PlugZapIcon,
    UserPlusIcon,
    XCircleIcon,
    XIcon,
} from '@lucide/vue';
import type { Component } from 'vue';

useHead({ title: 'Notifications (test) — Transvirex' });
definePageMeta({ layout: false });

const { post } = useApi();

interface Preset {
    id: string;
    label: string;
    description: string;
    message: string;
    event: string;
    audience: 'driver' | 'dispatcher' | 'all';
    icon: Component;
    color: string;
    summary?: string;
}

const presets: Preset[] = [
    {
        id: 'status-delivered',
        label: 'Livraison terminée',
        description: 'Statut → livré',
        message: 'Le colis #COL-0042 a été livré avec succès chez le client.',
        event: 'delivery:status',
        audience: 'all',
        icon: CheckCheckIcon,
        color: 'bg-green-500',
        summary: 'Votre livraison a été effectuée avec succès',
    },
    {
        id: 'status-delivering',
        label: 'Livraison en cours',
        description: 'Statut → en cours',
        message: 'Le chauffeur prend en charge la livraison #LIV-0123.',
        event: 'delivery:status',
        audience: 'dispatcher',
        icon: CarIcon,
        color: 'bg-blue-500',
    },
    {
        id: 'status-delayed',
        label: 'Livraison retardée',
        description: 'Statut → retardé',
        message: "La livraison #LIV-0089 est retardée en raison d'embouteillages sur l'A6.",
        event: 'delivery:status',
        audience: 'dispatcher',
        icon: ClockIcon,
        color: 'bg-amber-500',
        summary: 'Votre livraison a été retardée',
    },
    {
        id: 'status-blocked',
        label: 'Livraison bloquée',
        description: 'Statut → bloqué',
        message: 'Incident signalé : le client refuse la livraison #LIV-0056 (colis endommagé).',
        event: 'delivery:status',
        audience: 'all',
        icon: XCircleIcon,
        color: 'bg-red-500',
        summary: 'Un problème a été signalé sur votre livraison',
    },
    {
        id: 'incident',
        label: 'Incident critique',
        description: 'Alerte incident',
        message: '⚠️ Accident signalé sur le secteur Lyon-Est. Le chauffeur Marc Dubois est en sécurité.',
        event: 'delivery:incident',
        audience: 'all',
        icon: AlertTriangleIcon,
        color: 'bg-purple-500',
    },
    {
        id: 'assigned',
        label: 'Nouvelle affectation',
        description: 'Livraison assignée',
        message: 'Vous avez été assigné à la livraison #LIV-0150 (Paris → Lyon, 3 colis).',
        event: 'delivery:assigned',
        audience: 'driver',
        icon: UserPlusIcon,
        color: 'bg-indigo-500',
        summary: 'Une nouvelle livraison vous a été assignée',
    },
    {
        id: 'overdue',
        label: 'Dépassement délai',
        description: 'Livraison en retard',
        message: 'La livraison #LIV-0033 devait être effectuée il y a 2h. Aucun mouvement détecté.',
        event: 'delivery:overdue',
        audience: 'dispatcher',
        icon: BellRingIcon,
        color: 'bg-orange-500',
    },
    {
        id: 'position',
        label: 'Mise à jour position',
        description: 'GPS chauffeur',
        message: 'Le chauffeur Thomas Petit se rapproche du hub Paris-Nord (1.2 km).',
        event: 'position:update',
        audience: 'dispatcher',
        icon: MapPinIcon,
        color: 'bg-teal-500',
    },
    {
        id: 'general-info',
        label: 'Notification info',
        description: 'Information générale',
        message: 'Un nouveau créneau de livraison est disponible sur le secteur Bordeaux.',
        event: 'delivery:status',
        audience: 'all',
        icon: BellIcon,
        color: 'bg-slate-500',
    },
    {
        id: 'general-urgent',
        label: 'Alerte générale',
        description: 'Urgence / information importante',
        message: '🚨 Grève partielle annoncée sur le hub Lille-Nord. Réaffectation en cours.',
        event: 'delivery:incident',
        audience: 'dispatcher',
        icon: AlertTriangleIcon,
        color: 'bg-rose-600',
    },
];

const audience = reactive<Record<string, string>>({});
for (const p of presets) {
    audience[p.id] = p.audience;
}

const sending = reactive<Record<string, boolean>>({});
const result = reactive<Record<string, string>>({});

async function sendPreset(preset: Preset) {
    sending[preset.id] = true;
    result[preset.id] = '';
    try {
        await post('/debug/notifications/send', {
            event: preset.event,
            audience: audience[preset.id],
            message: preset.message,
            summary: preset.summary,
            deliveryId: `debug-${Date.now()}`,
        });
        result[preset.id] = '✓ Envoyé';
    } catch {
        result[preset.id] = '✗ Erreur';
    } finally {
        sending[preset.id] = false;
    }
}

const custom = reactive({
    event: 'delivery:status',
    audience: 'all' as string,
    message: '',
    userId: '',
});
const customSending = ref(false);
const customResult = ref('');

async function sendCustom() {
    if (!custom.message) return;
    customSending.value = true;
    customResult.value = '';
    try {
        await post('/debug/notifications/send', {
            event: custom.event,
            audience: custom.audience,
            message: custom.message,
            userId: custom.userId || undefined,
            deliveryId: `debug-${Date.now()}`,
        });
        customResult.value = '✓ Envoyé';
    } catch {
        customResult.value = '✗ Erreur';
    } finally {
        customSending.value = false;
    }
}

// ── SSE monitor ────────────────────────────────────────────────────────────
const sseConnected = ref(false);
const sseLog = ref<Array<{ time: string; event: string; data: string }>>([]);
let sse: EventSource | null = null;

function eventColor(event: string) {
    if (event.includes('incident') || event.includes('blocked')) return 'text-red-500';
    if (event.includes('delayed') || event.includes('overdue')) return 'text-amber-500';
    if (event.includes('assigned')) return 'text-indigo-500';
    if (event.includes('status')) return 'text-blue-500';
    if (event.includes('position')) return 'text-teal-500';
    return 'text-slate-500';
}

function toggleSse() {
    if (sse) {
        sse.close();
        sse = null;
        sseConnected.value = false;
        return;
    }
    const accessToken = useCookie('access_token').value;
    const url = accessToken ? `/api/events?token=${encodeURIComponent(accessToken)}` : '/api/events';
    sse = new EventSource(url);
    sse.addEventListener('open', () => {
        sseConnected.value = true;
    });
    const events = ['delivery:status', 'delivery:assigned', 'delivery:incident', 'delivery:overdue', 'position:update'];
    for (const evt of events) {
        sse.addEventListener(evt, (e: MessageEvent) => {
            if (sseLog.value.length > 200) sseLog.value = sseLog.value.slice(-150);
            sseLog.value.push({
                time: new Date().toLocaleTimeString('fr-FR'),
                event: evt,
                data: (e.data ?? '').slice(0, 200),
            });
        });
    }
    sse.addEventListener('error', () => {
        sseConnected.value = false;
    });
}

onUnmounted(() => {
    sse?.close();
});
</script>

