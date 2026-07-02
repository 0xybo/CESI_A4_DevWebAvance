<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CircleHelp } from '@lucide/vue';

const accounts = [
    { role: 'Admin', email: 'admin@transvirex.com', password: 'password' },
    { role: 'Dispatcher', email: 'dispatcher@transvirex.com', password: 'password' },
    { role: 'Chauffeur', email: 'driver@transvirex.com', password: 'password' },
    { role: 'Responsable Facturation', email: 'billing@transvirex.com', password: 'password' },
];

const githubUrl = 'https://github.com/0xybo/CESI_A4_DevWebAvance';
const visitedKey = 'transvirex-info-visited';
const open = ref(false);

function openDialog() {
    open.value = true;
}

function closeDialog() {
    open.value = false;
}

onMounted(() => {
    if (!localStorage.getItem(visitedKey)) {
        open.value = true;
        localStorage.setItem(visitedKey, '1');
    }
});
</script>

<template>
    <div>
        <Button
            variant="secondary"
            size="icon"
            class="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg"
            @click="openDialog"
            aria-label="Informations"
        >
            <CircleHelp class="h-6 w-6" />
        </Button>

        <Dialog :open="open" @update:open="closeDialog">
            <DialogContent class="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle class="text-xl"> Projet Étudiant — Transvirex Logistics </DialogTitle>
                    <DialogDescription>
                        <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                            Transvirex Logistics est un ERP de gestion logistique réalisé dans le cadre d'un projet de
                            développement web avancé (CESI A4). Il s'agit d'une
                            <strong class="text-foreground">application fictive à but pédagogique</strong>.
                        </p>
                        <br />
                        <p>
                            <strong class="text-foreground">Avertissement :</strong> Le développement de cette
                            application à été réalisé par un petit groupe d'étudiants sur 5 jours. Certaines
                            fonctionnalités soient incomplètes et des bugs soient présents. Merci de votre
                            compréhension.
                        </p>

                        <p>
                            <strong class="text-foreground">Avertissement 2 :</strong> Cette version de l'application
                            est une version de démonstration statique. Il n'y a pas de serveur backend fonctionnel, ni
                            de base de données. L'ensemble des données affichées et des interactions sont simulées ou
                            non fonctionnelles. L'application originale n'est plus hébergée mais le code source est
                            disponible sur GitHub.
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <div class="space-y-4 mt-2">
                    <div>
                        <h3 class="font-semibold text-sm mb-1">Contexte</h3>
                        <p class="text-sm text-muted-foreground leading-relaxed">
                            Transvirex Logistics digitalise le transport régional : plus de 160 chauffeurs indépendants,
                            près de 15 000 livraisons par mois. L'ERP vise à structurer les flux opérationnels,
                            centraliser les données, permettre un suivi temps réel et supporter une montée en charge
                            nationale.
                        </p>
                    </div>

                    <div>
                        <h3 class="font-semibold text-sm mb-1">Comptes de démonstration</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="border-b text-left text-muted-foreground">
                                        <th class="pb-1 pr-2 font-medium">Rôle</th>
                                        <th class="pb-1 pr-2 font-medium">Email</th>
                                        <th class="pb-1 font-medium">Mot de passe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="acct in accounts" :key="acct.email" class="border-b last:border-0">
                                        <td class="py-1.5 pr-2 font-medium">{{ acct.role }}</td>
                                        <td class="py-1.5 pr-2 text-muted-foreground">{{ acct.email }}</td>
                                        <td class="py-1.5 font-mono text-muted-foreground">{{ acct.password }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="text-sm text-muted-foreground">
                        <h3 class="font-semibold text-sm mb-1 text-foreground">Code source</h3>
                        <p>
                            Le projet est open source et disponible sur GitHub :
                            <a
                                :href="githubUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-primary underline hover:no-underline"
                            >
                                {{ githubUrl }}
                            </a>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

