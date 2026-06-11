<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from '@lucide/vue';
import AdminFormFields from './AdminFormFields.vue';
import type { FormField } from './AdminFormFields.vue';

const props = defineProps<{
    fields: FormField[];
    apiEndpoint: string;
    title: string;
    description?: string;
    item: Record<string, any> | null;
}>();

const emit = defineEmits<{
    success: [item: any];
}>();

const open = defineModel<boolean>('open', { default: false });
const formData = ref<Record<string, any>>({});
const errors = ref<Record<string, string>>({});
const submitting = ref(false);

const { patch } = useApi();

function reset() {
    if (props.item) {
        formData.value = { ...props.item };
    } else {
        formData.value = {};
    }
    errors.value = {};
}

watch(() => props.item, () => {
    if (open.value) reset();
}, { immediate: true });

watch(open, (val) => {
    if (val) reset();
});

async function submit() {
    const errs: Record<string, string> = {};
    for (const field of props.fields) {
        if (field.required && !formData.value[field.name]) {
            errs[field.name] = `${field.label} est requis`;
        }
    }
    if (Object.keys(errs).length > 0) {
        errors.value = errs;
        return;
    }

    submitting.value = true;
    errors.value = {};
    try {
        const result = await patch(`${props.apiEndpoint}/${props.item?.id}`, formData.value);
        emit('success', result);
        open.value = false;
    } catch (e: any) {
        errors.value._api = e?.message ?? 'Erreur lors de la modification';
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription v-if="description">{{ description }}</DialogDescription>
            </DialogHeader>

            <AdminFormFields v-model="formData" :fields="fields" :errors="errors" />

            <p v-if="errors._api" class="text-sm text-destructive px-1">{{ errors._api }}</p>

            <DialogFooter>
                <Button variant="outline" @click="open = false" :disabled="submitting">Annuler</Button>
                <Button @click="submit" :disabled="submitting">
                    <Loader2 v-if="submitting" class="w-4 h-4 mr-2 animate-spin" />
                    Enregistrer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
