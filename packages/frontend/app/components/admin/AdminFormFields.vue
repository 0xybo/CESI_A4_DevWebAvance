<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from '@lucide/vue';

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'datetime';
    required?: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
    asyncOptions?: { endpoint: string; labelKey: string; valueKey: string };
}

const props = defineProps<{
    fields: FormField[];
    modelValue: Record<string, any>;
    errors: Record<string, string>;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: Record<string, any>];
}>();

const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});

const asyncOptionsMap = ref<Record<string, { value: string; label: string }[]>>({});
const loadingOptions = ref<Record<string, boolean>>({});

onMounted(async () => {
    for (const field of props.fields) {
        if (field.asyncOptions) {
            loadingOptions.value[field.name] = true;
            try {
                const { get } = useApi();
                const data = await get<any[]>(field.asyncOptions.endpoint);
                asyncOptionsMap.value[field.name] = data.map((item: any) => ({
                    value: item[field.asyncOptions!.valueKey],
                    label: item[field.asyncOptions!.labelKey],
                }));
            } catch {
                asyncOptionsMap.value[field.name] = [];
            } finally {
                loadingOptions.value[field.name] = false;
            }
        }
    }
});

function update(field: string, value: any) {
    formData.value = { ...formData.value, [field]: value };
}
</script>

<template>
    <div class="grid gap-4 py-4">
        <div v-for="field in fields" :key="field.name" class="grid gap-2">
            <Label :for="field.name">
                {{ field.label }}
                <span v-if="field.required" class="text-destructive">*</span>
            </Label>

            <Input
                v-if="field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number' || field.type === 'date' || field.type === 'datetime'"
                :id="field.name"
                :type="field.type === 'datetime' ? 'datetime-local' : field.type"
                :placeholder="field.placeholder"
                :required="field.required"
                :model-value="formData[field.name] ?? ''"
                @update:model-value="update(field.name, $event)"
            />

            <select
                v-else-if="field.type === 'select'"
                :id="field.name"
                :required="field.required"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                :value="formData[field.name] ?? ''"
                @change="update(field.name, ($event.target as HTMLSelectElement).value)"
            >
                <option value="" disabled>Sélectionner...</option>
                <option v-for="opt in (field.options ?? asyncOptionsMap[field.name] ?? [])" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                </option>
            </select>

            <Textarea
                v-else-if="field.type === 'textarea'"
                :id="field.name"
                :placeholder="field.placeholder"
                :required="field.required"
                :model-value="formData[field.name] ?? ''"
                @update:model-value="update(field.name, $event)"
            />

            <p v-if="errors[field.name]" class="text-xs text-destructive">{{ errors[field.name] }}</p>
        </div>
    </div>
</template>
