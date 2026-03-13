<template>
  <div class="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <!-- Pending attachments -->
    <div v-if="pendingFiles.length > 0" class="flex flex-wrap gap-2 px-3 pt-2">
      <div
        v-for="(f, idx) in pendingFiles"
        :key="idx"
        class="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-700"
      >
        <span class="truncate max-w-[120px]">{{ f.name }}</span>
        <button
          class="rounded p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600"
          aria-label="Eliminar"
          @click="removeFile(idx)"
        >
          <X class="h-3 w-3" />
        </button>
      </div>
    </div>
    <!-- Input row -->
    <div class="flex gap-2 p-3">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain"
        multiple
        class="hidden"
        @change="onFileSelect"
      >
      <button
        class="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label="Adjuntar fitxer"
        :disabled="disabled || pendingFiles.length >= 6"
        @click="fileInputRef?.click()"
      >
        <Paperclip class="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>
      <button
        :class="[
          'rounded-lg p-2',
          isRecording ? 'bg-red-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
        ]"
        aria-label="Gravar àudio"
        :disabled="disabled"
        @click="toggleRecord"
      >
        <Mic class="h-5 w-5" />
      </button>
      <input
        v-model="inputText"
        type="text"
        :placeholder="placeholder"
        class="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        @keydown.enter="onSend"
      >
      <button
        class="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600 disabled:opacity-50"
        :disabled="!canSend"
        @click="onSend"
      >
        {{ sendLabel }}
      </button>
    </div>
    <p v-if="errorMsg" class="px-3 pb-2 text-sm text-red-500">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { X, Paperclip, Mic } from 'lucide-vue-next';

const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24 MB
const MAX_FILES = 6;

const props = defineProps({
  placeholder: { type: String, default: 'Escriu un missatge...' },
  sendLabel: { type: String, default: 'Envia' },
  disabled: { type: Boolean, default: false },
  apiUrl: { type: String, default: 'http://localhost:3001' },
  personality: { type: String, default: 'otaku' }
});

const emit = defineEmits(['send']);

const inputText = ref('');
const fileInputRef = ref(null);
const pendingFiles = ref([]);
const isRecording = ref(false);
const errorMsg = ref('');
let mediaRecorder = null;
let audioChunks = [];

const canSend = computed(() => {
  const trimmed = inputText.value ? inputText.value.trim() : '';
  return (trimmed.length > 0 || pendingFiles.value.length > 0) && !props.disabled;
});

function removeFile(idx) {
  const next = [];
  for (let i = 0; i < pendingFiles.value.length; i++) {
    if (i !== idx) next.push(pendingFiles.value[i]);
  }
  pendingFiles.value = next;
}

function onFileSelect(ev) {
  errorMsg.value = '';
  const files = ev.target.files;
  if (!files) return;
  for (let i = 0; i < files.length; i++) {
    if (pendingFiles.value.length >= MAX_FILES) {
      errorMsg.value = 'Màxim 6 fitxers per missatge';
      break;
    }
    const f = files[i];
    if (f.size > MAX_FILE_SIZE) {
      errorMsg.value = 'Fitxer massa gran (màx 24 MB): ' + f.name;
      continue;
    }
    pendingFiles.value.push(f);
  }
  ev.target.value = '';
}

async function toggleRecord() {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  errorMsg.value = '';
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    errorMsg.value = 'El navegador no suporta la gravació';
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      transcribeAndAppend(blob);
    };
    mediaRecorder.start();
    isRecording.value = true;
  }).catch(() => {
    errorMsg.value = 'No s\'ha pogut accedir al micròfon';
  });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    isRecording.value = false;
  }
}

async function transcribeAndAppend(blob) {
  errorMsg.value = '';
  const fd = new FormData();
  fd.append('audio', blob);
  fd.append('personality', props.personality);
  try {
    const res = await $fetch(props.apiUrl + '/api/transcribe', {
      method: 'POST',
      body: fd
    });
    if (res.error) throw new Error(res.error);
    const current = inputText.value || '';
    inputText.value = current + (current ? ' ' : '') + (res.text || '');
  } catch (e) {
    errorMsg.value = e.message || 'Error en la transcripció. Comprova la connexió i GEMINI_API_KEY.';
  }
}

function onSend() {
  const trimmed = inputText.value ? inputText.value.trim() : '';
  if ((trimmed.length === 0 && pendingFiles.value.length === 0) || props.disabled) return;
  emit('send', { text: trimmed, files: [...pendingFiles.value] });
  inputText.value = '';
  pendingFiles.value = [];
}
</script>
