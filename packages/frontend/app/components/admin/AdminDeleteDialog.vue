<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, TriangleAlert } from '@lucide/vue';

const props = defineProps<{
    apiEndpoint: string;
    item: Record<string, any> | null;
    title?: string;
}>();

const emit = defineEmits<{
    success: [id: string];
}>();

const open = defineModel<boolean>('open', { default: false });
const submitting = ref(false);
const error = ref<string | null>(null);

const { del } = useApi();

async function confirm() {
    if (!props.item?.id) return;
    submitting.value = true;
    error.value = null;
    try {
        await del(`${props.apiEndpoint}/${props.item.id}`);
        emit('success', props.item.id);
        open.value = false;
    } catch (e: any) {
        error.value = e?.message ?? 'Erreur lors de la suppression';
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <TriangleAlert class="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <DialogTitle>{{ title ?? 'Confirmer la suppression' }}</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div v-if="item" class="text-sm text-muted-foreground border rounded-md p-3 bg-muted/50">
                <span class="font-medium">{{ item.reference || item.name || item.id }}</span>
            </div>

            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

            <DialogFooter>
                <Button variant="outline" @click="open = false" :disabled="submitting">Annuler</Button>
                <Button variant="destructive" @click="confirm" :disabled="submitting">
                    <Loader2 v-if="submitting" class="w-4 h-4 mr-2 animate-spin" />
                    Supprimer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
