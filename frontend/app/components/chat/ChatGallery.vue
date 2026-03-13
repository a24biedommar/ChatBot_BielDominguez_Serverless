<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    @click.self="$emit('close')"
  >
    <div class="max-h-[90vh] max-w-lg overflow-auto rounded-lg bg-white p-4 dark:bg-slate-800">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold">Galeria</h3>
        <button
          class="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          @click="$emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      <div v-if="items.length === 0" class="py-8 text-center text-slate-500">
        No hi ha mitjans en aquest xat
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="item in items"
          :key="item.id"
          class="aspect-square overflow-hidden rounded bg-slate-100 dark:bg-slate-700"
        >
          <img
            v-if="item.url && item.mimeType && item.mimeType.startsWith('image/')"
            :src="item.url"
            :alt="item.id"
            class="h-full w-full object-cover"
            @error="item.url = null"
          />
          <div
            v-else
            class="flex h-full items-center justify-center text-slate-400"
          >
            Fitxer
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';

defineProps({
  open: Boolean,
  items: { type: Array, default: () => [] }
});

defineEmits(['close']);
</script>
