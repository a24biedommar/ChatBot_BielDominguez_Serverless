<template>
  <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
    <div
      v-for="msg in messages"
      :key="msg.id"
      :class="msgClass(msg.role)"
    >
      <div v-if="msg.isLoading" class="flex items-center gap-1.5 px-2 py-1 h-[24px]">
        <span class="w-2 h-2 rounded-full bg-slate-500/60 dark:bg-slate-400/60 animate-bounce" style="animation-delay: 0ms;"></span>
        <span class="w-2 h-2 rounded-full bg-slate-500/60 dark:bg-slate-400/60 animate-bounce" style="animation-delay: 150ms;"></span>
        <span class="w-2 h-2 rounded-full bg-slate-500/60 dark:bg-slate-400/60 animate-bounce" style="animation-delay: 300ms;"></span>
      </div>
      <p v-else-if="msg.text" class="whitespace-pre-wrap break-words text-sm">{{ msg.text }}</p>
      <div v-if="getBlobPreviews(msg).length > 0" class="mt-2 flex flex-wrap gap-1">
        <img
          v-for="p in getBlobPreviews(msg)"
          :key="p.id"
          :src="p.url"
          alt=""
          class="max-h-24 rounded object-cover"
          loading="lazy"
          @error="revokeUrl(p.url)"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  messages: { type: Array, default: () => [] }
});

const { getBlob } = useIndexedDB();
const urlCache = ref({});

function msgClass(role) {
  const base = 'flex max-w-[85%] flex-col rounded-xl px-4 py-2';
  if (role === 'user') return base + ' ml-auto bg-slate-700 text-white';
  return base + ' mr-auto bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100';
}

function getBlobPreviews(msg) {
  const ids = msg.blobIds || [];
  const result = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const cached = urlCache.value[id];
    if (cached) result.push({ id, url: cached });
  }
  return result;
}

async function loadBlobUrls(msg) {
  const ids = msg.blobIds || [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (urlCache.value[id]) continue;
    const rec = await getBlob(id);
    if (rec && rec.blob && (rec.mimeType || '').startsWith('image/')) {
      const next = { ...urlCache.value };
      next[id] = URL.createObjectURL(rec.blob);
      urlCache.value = next;
    }
  }
}

function revokeUrl(url) {
  if (url) URL.revokeObjectURL(url);
}

watch(() => props.messages, (msgs) => {
  for (let i = 0; i < (msgs || []).length; i++) {
    loadBlobUrls(msgs[i]);
  }
}, { immediate: true });
</script>
