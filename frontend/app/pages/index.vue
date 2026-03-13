<template>
  <div class="flex h-screen flex-col bg-slate-50 dark:bg-slate-900">
    <!-- Header -->
    <header class="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
      <button
        class="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
        aria-label="Menú"
        @click="sidebarOpen = true"
      >
        <Menu class="h-6 w-6 text-slate-700 dark:text-slate-300" />
      </button>
      <div class="min-w-0 flex-1 cursor-pointer text-center" @click="openGallery">
        <input
          v-if="editingTitle"
          ref="titleInputRef"
          v-model="editingTitleValue"
          type="text"
          class="w-full truncate rounded bg-slate-100 text-center text-lg font-semibold dark:bg-slate-700"
          @blur="saveTitle"
          @keydown.enter="saveTitle"
        >
        <h1
          v-else
          class="truncate text-lg font-semibold text-slate-800 dark:text-slate-100"
          @dblclick.prevent="startEditTitle"
        >
          {{ currentChatTitle }}
        </h1>
      </div>
      <div class="relative">
        <button
          class="flex items-center gap-1 rounded px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
          @click="personalityDropdownOpen = !personalityDropdownOpen"
        >
          <span class="text-sm text-slate-600 dark:text-slate-400">{{ personalityLabel }}</span>
          <ChevronDown class="h-4 w-4" />
        </button>
        <div
          v-if="personalityDropdownOpen"
          class="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white shadow dark:border-slate-600 dark:bg-slate-800"
        >
          <button
            class="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
            @click="selectPersonality('otaku')"
          >
            Otaku (Oni-chan)
          </button>
          <button
            class="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
            @click="selectPersonality('gitano')"
          >
            Gitano (Primo)
          </button>
        </div>
      </div>
    </header>

    <!-- Chat messages -->
    <ChatMessageList :messages="messages" />

    <!-- Input -->
    <ChatInput
      placeholder="Escriu un missatge..."
      send-label="Envia"
      :disabled="sending"
      :api-url="apiUrl"
      :personality="personality"
      @send="sendMessage"
    />

    <!-- Sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 z-40 h-full w-72 transform bg-white shadow-xl transition-transform dark:bg-slate-800',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex items-center justify-between border-b p-4">
        <h2 class="font-semibold">Xats</h2>
        <button
          class="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          @click="sidebarOpen = false"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      <button
        class="m-4 flex w-[calc(100%-2rem)] items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
        @click="createNewChat"
      >
        <Plus class="h-5 w-5" />
        Crear nou xat
      </button>
      <div class="overflow-y-auto p-2">
        <div
          v-for="chat in chats"
          :key="chat.id"
          class="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          :class="{ 'bg-slate-100 dark:bg-slate-700': currentChatId === chat.id }"
        >
          <button
            class="min-w-0 flex-1 truncate text-left text-sm"
            @click="selectChat(chat.id)"
          >
            {{ chat.title }}
          </button>
          <button
            class="rounded p-1.5 opacity-0 hover:bg-slate-200 group-hover:opacity-100 dark:hover:bg-slate-600"
            aria-label="Eliminar"
            @click="deleteChat(chat.id)"
          >
            <Trash2 class="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Gallery modal -->
    <ChatGallery
      :open="galleryOpen"
      :items="galleryItems"
      @close="galleryOpen = false"
    />
  </div>
</template>

<script setup>
import { Menu, ChevronDown, X, Plus, Trash2 } from 'lucide-vue-next';

definePageMeta({ layout: 'default' });

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl || 'http://localhost:3001';

const sidebarOpen = ref(false);
const personalityDropdownOpen = ref(false);
const currentChatId = ref(null);
const messages = ref([]);
const chats = ref([]);
const sending = ref(false);
const personality = ref('otaku');
const galleryOpen = ref(false);
const galleryItems = ref([]);
const editingTitle = ref(false);
const editingTitleValue = ref('');
const titleInputRef = ref(null);

const currentChatTitle = computed(() => {
  if (!currentChatId.value) return 'Nou xat';
  const c = chats.value.find((ch) => ch.id === currentChatId.value);
  return c ? c.title : 'Nou xat';
});

const personalityLabel = computed(() => {
  if (personality.value === 'gitano') return 'Gitano';
  return 'Otaku';
});

function startEditTitle() {
  if (!currentChatId.value) return;
  editingTitleValue.value = currentChatTitle.value;
  editingTitle.value = true;
  nextTick(() => titleInputRef.value?.focus());
}

async function saveTitle() {
  if (!editingTitle.value) return;
  const val = editingTitleValue.value ? editingTitleValue.value.trim() : 'Nou xat';
  editingTitle.value = false;
  if (!currentChatId.value) return;
  const { getChatMetadata, putChatMetadata } = useIndexedDB();
  const chat = await getChatMetadata(currentChatId.value);
  if (chat) {
    await putChatMetadata({ ...chat, title: val });
    await loadChats();
  }
}

async function openGallery() {
  if (!currentChatId.value) return;
  const { getBlobsByChatId, getBlob } = useIndexedDB();
  const blobs = await getBlobsByChatId(currentChatId.value);
  const items = [];
  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i];
    let url = null;
    if (b.blob) {
      url = URL.createObjectURL(b.blob);
    }
    items.push({ id: b.id, url, mimeType: b.mimeType || '' });
  }
  galleryItems.value = items;
  galleryOpen.value = true;
}

function selectPersonality(p) {
  personality.value = p;
  personalityDropdownOpen.value = false;
  useIndexedDB().setPreference('personality', p);
}

async function loadChats() {
  const { getAllChatsSorted } = useIndexedDB();
  chats.value = await getAllChatsSorted();
}

async function loadMessages() {
  if (!currentChatId.value) {
    messages.value = [];
    return;
  }
  const { getMessagesByChatId } = useIndexedDB();
  messages.value = await getMessagesByChatId(currentChatId.value);
}

async function ensureCurrentChat() {
  if (currentChatId.value) return;
  const { addChatMetadata, setPreference, getPreference } = useIndexedDB();
  const pref = await getPreference('personality');
  if (pref) personality.value = pref;
  const id = await addChatMetadata({ title: 'Nou xat', personality: personality.value });
  currentChatId.value = id;
  await loadChats();
  await loadMessages();
}

async function createNewChat() {
  const { addChatMetadata } = useIndexedDB();
  const id = await addChatMetadata({ title: 'Nou xat', personality: personality.value });
  currentChatId.value = id;
  messages.value = [];
  sidebarOpen.value = false;
  await loadChats();
}

async function selectChat(id) {
  currentChatId.value = id;
  await loadMessages();
  sidebarOpen.value = false;
}

async function deleteChat(id) {
  if (!confirm('Eliminar aquest xat?')) return;
  const { deleteChatMetadata, getMessagesByChatId, deleteMessage } = useIndexedDB();
  const msgs = await getMessagesByChatId(id);
  for (let i = 0; i < msgs.length; i++) {
    await deleteMessage(msgs[i].id);
  }
  await deleteChatMetadata(id);
  if (currentChatId.value === id) {
    currentChatId.value = null;
    messages.value = [];
  }
  await loadChats();
}

async function sendMessage(payload) {
  await ensureCurrentChat();
  if (!currentChatId.value) return;
  sending.value = true;
  const { addMessageAndUpdateChat, getChatMetadata, putChatMetadata, addBlob } = useIndexedDB();

  const text = payload.text || '';
  const files = payload.files || [];
  const blobIds = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const id = await addBlob({
      blob: f,
      mimeType: f.type || '',
      chatId: currentChatId.value,
      messageId: '',
      createdAt: Date.now()
    });
    blobIds.push(id);
  }

  const userMsg = { id: crypto.randomUUID(), chatId: currentChatId.value, role: 'user', text, blobIds, createdAt: Date.now() };
  await addMessageAndUpdateChat(userMsg);
  messages.value.push(userMsg);

  const hist = [];
  for (let i = 0; i < messages.value.length; i++) {
    hist.push({ role: messages.value[i].role, text: messages.value[i].text, blobIds: messages.value[i].blobIds || [] });
  }

  const tempId = crypto.randomUUID();
  messages.value.push({
    id: tempId,
    chatId: currentChatId.value,
    role: 'assistant',
    text: '',
    isLoading: true,
    blobIds: [],
    createdAt: Date.now()
  });

  try {
    const res = await $fetch(apiUrl + '/api/chat', {
      method: 'POST',
      body: { messages: hist, personality: personality.value }
    });
    
    messages.value = messages.value.filter(m => m.id !== tempId);

    if (res.error) throw new Error(res.error);
    const assistantMsg = {
      id: crypto.randomUUID(),
      chatId: currentChatId.value,
      role: 'assistant',
      text: res.text || '',
      blobIds: [],
      createdAt: Date.now()
    };
    await addMessageAndUpdateChat(assistantMsg);
    messages.value.push(assistantMsg);

    const chat = await getChatMetadata(currentChatId.value);
    if (chat && messages.value.length >= 4 && chat.title === 'Nou xat') {
      await putChatMetadata({ ...chat, title: res.text.substring(0, 50) + (res.text.length > 50 ? '...' : '') });
      await loadChats();
    }
  } catch (e) {
    messages.value = messages.value.filter(m => m.id !== tempId);
    
    const actualError = (e.data && e.data.error) ? e.data.error : e.message;
    const errMsg = { id: crypto.randomUUID(), chatId: currentChatId.value, role: 'assistant', text: 'Error: ' + (actualError || 'No s\'ha pogut connectar. Comprova que el backend funciona i que GEMINI_API_KEY està configurada.'), blobIds: [], createdAt: Date.now() };
    await addMessageAndUpdateChat(errMsg);
    messages.value.push(errMsg);
  } finally {
    sending.value = false;
  }
}

onMounted(() => {
  loadChats();
  ensureCurrentChat().then(() => loadMessages());
});
</script>
