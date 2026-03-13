//==============================================================================
//================================ IMPORTS =====================================
//==============================================================================

import Dexie from 'dexie';

//==============================================================================
//================================ VARIABLES ===================================
//==============================================================================

const DB_NAME = 'oni-chan-db';
const DB_VERSION = 1;
const MAX_BLOB_SIZE = 24 * 1024 * 1024; // 24 MB
const MAX_BLOBS_PER_MESSAGE = 6;
const MAX_AUDIO_SECONDS = 60;

let dbInstance = null;

//==============================================================================
//================================ FUNCIONS ====================================
//==============================================================================

/**
 * Retorna la instància de la base de dades Dexie.
 * A) Si ja existeix, retornar-la.
 * B) Crear nova instància, definir stores i versió.
 * C) Retornar la instància.
 */
function getDb() {
  if (dbInstance !== null) {
    return dbInstance;
  }
  dbInstance = new Dexie(DB_NAME);
  dbInstance.version(DB_VERSION).stores({
    blobs: 'id, chatId, messageId, createdAt',
    chat_metadata: 'id, updatedAt',
    messages: 'id, chatId, createdAt',
    preferences: 'key'
  });
  return dbInstance;
}

/**
 * Valida la mida d'un blob.
 * A) Obtenir mida del blob.
 * B) Retornar true si <= MAX_BLOB_SIZE, false si no.
 */
function validateBlobSize(blob) {
  const size = blob.size;
  return size <= MAX_BLOB_SIZE;
}

/**
 * Valida el nombre de blobIds.
 * A) Comprovar que blobIds és array.
 * B) Retornar true si length <= MAX_BLOBS_PER_MESSAGE, false si no.
 */
function validateBlobIdsCount(blobIds) {
  if (!Array.isArray(blobIds)) {
    return false;
  }
  return blobIds.length <= MAX_BLOBS_PER_MESSAGE;
}

/**
 * Afegeix un blob a IndexedDB.
 * A) Validar mida.
 * B) Generar id si no existeix.
 * C) Inserir a store blobs.
 */
async function addBlob(record) {
  if (!validateBlobSize(record.blob)) {
    throw new Error('Blob massa gran (màx 24 MB)');
  }
  const db = getDb();
  const id = record.id || crypto.randomUUID();
  const toInsert = {
    id,
    blob: record.blob,
    mimeType: record.mimeType || '',
    chatId: record.chatId || '',
    messageId: record.messageId || '',
    createdAt: record.createdAt || Date.now()
  };
  await db.blobs.add(toInsert);
  return id;
}

/**
 * Obté un blob per id.
 * A) Cercar a store blobs.
 * B) Retornar el registre o undefined.
 */
async function getBlob(id) {
  const db = getDb();
  const result = await db.blobs.get(id);
  return result;
}

/**
 * Actualitza un blob.
 * A) Validar mida si hi ha blob nou.
 * B) Fer put al store.
 */
async function putBlob(record) {
  if (record.blob && !validateBlobSize(record.blob)) {
    throw new Error('Blob massa gran (màx 24 MB)');
  }
  const db = getDb();
  await db.blobs.put(record);
}

/**
 * Elimina un blob.
 * A) Cridar delete al store.
 */
async function deleteBlob(id) {
  const db = getDb();
  await db.blobs.delete(id);
}

/**
 * Obté tots els blobs d'un xat.
 * A) Obtenir tots els blobs amb chatId.
 * B) Retornar array (amb bucle, sense .map).
 */
async function getBlobsByChatId(chatId) {
  const db = getDb();
  const all = await db.blobs.where('chatId').equals(chatId).toArray();
  const result = [];
  for (let i = 0; i < all.length; i++) {
    result.push(all[i]);
  }
  return result;
}

/**
 * Afegeix metadades de xat.
 */
async function addChatMetadata(record) {
  const db = getDb();
  const now = Date.now();
  const toInsert = {
    id: record.id || crypto.randomUUID(),
    title: record.title || 'Nou xat',
    personality: record.personality || 'otaku',
    messageIds: record.messageIds || [],
    createdAt: record.createdAt || now,
    updatedAt: record.updatedAt || now
  };
  await db.chat_metadata.add(toInsert);
  return toInsert.id;
}

/**
 * Obté metadades d'un xat.
 */
async function getChatMetadata(id) {
  const db = getDb();
  return await db.chat_metadata.get(id);
}

/**
 * Actualitza metadades de xat.
 */
async function putChatMetadata(record) {
  const db = getDb();
  const updated = { ...record, updatedAt: Date.now() };
  await db.chat_metadata.put(updated);
}

/**
 * Elimina metadades de xat.
 */
async function deleteChatMetadata(id) {
  const db = getDb();
  await db.chat_metadata.delete(id);
}

/**
 * Obté tots els xats ordenats per updatedAt descendent.
 * A) Obtenir tots els registres.
 * B) Ordenar amb bucle (bombolla o inserció) per updatedAt desc.
 */
async function getAllChatsSorted() {
  const db = getDb();
  const all = await db.chat_metadata.toArray();
  const result = [];
  for (let i = 0; i < all.length; i++) {
    result.push(all[i]);
  }
  for (let i = 0; i < result.length - 1; i++) {
    for (let j = i + 1; j < result.length; j++) {
      if (result[j].updatedAt > result[i].updatedAt) {
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
    }
  }
  return result;
}

/**
 * Afegeix un missatge.
 */
async function addMessage(record) {
  if (!validateBlobIdsCount(record.blobIds)) {
    throw new Error('Màxim 6 blobs per missatge');
  }
  const db = getDb();
  const toInsert = {
    id: record.id || crypto.randomUUID(),
    chatId: record.chatId,
    role: record.role,
    text: record.text || '',
    blobIds: record.blobIds || [],
    createdAt: record.createdAt || Date.now()
  };
  await db.messages.add(toInsert);
  return toInsert.id;
}

/**
 * Obté missatges d'un xat.
 */
async function getMessagesByChatId(chatId) {
  const db = getDb();
  const all = await db.messages.where('chatId').equals(chatId).toArray();
  const result = [];
  for (let i = 0; i < all.length; i++) {
    result.push(all[i]);
  }
  for (let i = 0; i < result.length - 1; i++) {
    for (let j = i + 1; j < result.length; j++) {
      if (result[j].createdAt < result[i].createdAt) {
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
    }
  }
  return result;
}

/**
 * Afegeix missatge i actualitza messageIds del xat.
 */
async function addMessageAndUpdateChat(record) {
  const msgId = await addMessage(record);
  const chat = await getChatMetadata(record.chatId);
  if (chat) {
    const newIds = [];
    for (let i = 0; i < (chat.messageIds || []).length; i++) {
      newIds.push(chat.messageIds[i]);
    }
    newIds.push(msgId);
    await putChatMetadata({ ...chat, messageIds: newIds });
  }
  return msgId;
}

/**
 * Elimina un missatge.
 */
async function deleteMessage(id) {
  const db = getDb();
  await db.messages.delete(id);
}

/**
 * Obté una preferència.
 */
async function getPreference(key) {
  const db = getDb();
  const rec = await db.preferences.get(key);
  return rec ? rec.value : null;
}

/**
 * Desa una preferència.
 */
async function setPreference(key, value) {
  const db = getDb();
  await db.preferences.put({ key, value });
}

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================

export function useIndexedDB() {
  return {
    addBlob,
    getBlob,
    putBlob,
    deleteBlob,
    getBlobsByChatId,
    addChatMetadata,
    getChatMetadata,
    putChatMetadata,
    deleteChatMetadata,
    getAllChatsSorted,
    addMessage,
    addMessageAndUpdateChat,
    getMessagesByChatId,
    deleteMessage,
    getPreference,
    setPreference,
    MAX_BLOB_SIZE,
    MAX_BLOBS_PER_MESSAGE,
    MAX_AUDIO_SECONDS,
    validateBlobSize,
    validateBlobIdsCount
  };
}
