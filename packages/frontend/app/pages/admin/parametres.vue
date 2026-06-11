<template>
    <AppLayout>
        <div class="max-w-2xl space-y-4">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">Paramètres</h1>
                <p class="text-muted-foreground text-sm mt-1">Configuration de la plateforme</p>
            </div>

            <div class="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <Info class="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Page en consultation uniquement — les modifications ne sont pas encore disponibles.</span>
            </div>

            <Card>
                <CardHeader><CardTitle class="text-base">Informations de la société</CardTitle></CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-1.5">
                        <Label>Nom de la société</Label>
                        <p class="text-sm font-medium border rounded-md px-3 py-2 bg-muted/30">Transvirex Logistics</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Email de contact</Label>
                        <p class="text-sm font-medium border rounded-md px-3 py-2 bg-muted/30">contact@transvirex.com</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Téléphone</Label>
                        <p class="text-sm font-medium border rounded-md px-3 py-2 bg-muted/30">01 23 45 67 89</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Adresse</Label>
                        <p class="text-sm font-medium border rounded-md px-3 py-2 bg-muted/30">12 Rue de la Logistique, 75001 Paris</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle class="text-base">État des services</CardTitle></CardHeader>
                <CardContent>
                    <div v-if="healthLoading" class="text-sm text-muted-foreground">Vérification des services...</div>
                    <div v-else class="space-y-2">
                        <div v-for="s in services" :key="s.name" class="flex items-center justify-between py-1.5 border-b last:border-0">
                            <span class="text-sm">{{ s.label }}</span>
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-muted-foreground">{{ s.status }}</span>
                                <div class="w-2.5 h-2.5 rounded-full" :class="s.ok ? 'bg-green-500' : 'bg-red-500'" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle class="text-base">Plateforme</CardTitle></CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground">Version</span>
                        <span class="font-mono">1.0.0</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground">Environnement</span>
                        <span class="font-mono">{{ env }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground">Mode maintenance</span>
                        <span>Désactivé</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Info } from '@lucide/vue';

definePageMeta({ layout: false });
useHead({ title: 'Paramètres — Transvirex' });

const { get } = useApi();
const healthLoading = ref(true);

const services = ref<Array<{ name: string; label: string; status: string; ok: boolean }>>([]);

const env = import.meta.dev ? 'Développement' : 'Production';

async function fetchHealth() {
    healthLoading.value = true;
    const checks = [
        { name: 'auth', label: 'Authentification' },
        { name: 'billing', label: 'Facturation' },
        { name: 'delivery', label: 'Livraisons' },
        { name: 'stock', label: 'Stock' },
        { name: 'users', label: 'Utilisateurs' },
    ];

    const results = await Promise.allSettled(
        checks.map(async (s) => {
            try {
                const data = await get<{ status: string }>(`/${s.name}/health`);
                return { ...s, status: data.status, ok: true };
            } catch {
                return { ...s, status: 'Indisponible', ok: false };
            }
        }),
    );

    services.value = results.map((r) =>
        r.status === 'fulfilled' ? r.value : { name: '', label: 'Erreur', status: 'Erreur', ok: false },
    );
    healthLoading.value = false;
}

onMounted(fetchHealth);
</script>
