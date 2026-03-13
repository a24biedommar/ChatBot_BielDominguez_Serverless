# Composables Oni-chan

## useIndexedDB()

Gestió d'IndexedDB amb Dexie.js.

**Mètodes**:
- `addBlob`, `getBlob`, `putBlob`, `deleteBlob`, `getBlobsByChatId`
- `addChatMetadata`, `getChatMetadata`, `putChatMetadata`, `deleteChatMetadata`, `getAllChatsSorted`
- `addMessage`, `addMessageAndUpdateChat`, `getMessagesByChatId`, `deleteMessage`
- `getPreference`, `setPreference`

**Constants**: `MAX_BLOB_SIZE`, `MAX_BLOBS_PER_MESSAGE`, `MAX_AUDIO_SECONDS`

## usePersonality()

Retorna system prompts per Otaku i Gitano.

**Mètodes**: `getSystemPrompt(personality)`
