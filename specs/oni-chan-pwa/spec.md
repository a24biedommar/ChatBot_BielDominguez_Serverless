# Feature Specification: Oni-chan Chatbot PWA

**Feature Branch**: `oni-chan-pwa`
**Created**: 2025-03-10
**Status**: Ready for implementation

## Overview

Una aplicació de xatbot multimodal optimitzada per a dispositius mòbils com a PWA amb **múltiples xats** (crear nou, llistar, canviar). Permet la pujada de fitxers i imatges (màxim **24 MB per fitxer**, **6 fitxers per missatge**; text il·limitat). Transcripció automàtica per a notes de veu. L'usuari pot **escollir** entre dues personalitats: **Otaku (Oni-chan)** o **Gitano (Primo)** via **dropdown adalt a la dreta**. Auth **només anònim** (Supabase); gestió de mitjans 100% local (IndexedDB). App totalment funcional offline.

## UI i Navegació

- **Dropdown personalitat**: Adalt a la dreta; canvia entre Otaku (Oni-chan) i Gitano (Primo) per a tota l'app.
- **Menú lateral**: Botó adalt a l'esquerra del xat; en fer clic s'obre el menú lateral amb l'historial de xats i el botó «Crear nou xat».
- **Primer xat**: A l'obrir l'app, l'usuari està directament en un xat buit; pot canviar de xat des del menú lateral.
- **Títol del xat**: Generat per l'IA (resum) desprès de **2-3 intercanvis**; **editable** per l'usuari.
- **Eliminar xat**: Botó paperera al costat de cada xat a la llista del menú lateral; amb confirmació.
- **Galeria**: S'accedeix fent **clic al div del títol del xat** (a la vista del xat o al menú lateral).
- **Ordre xats**: Per data de modificació (el més recent dalt).

## User Scenarios & Testing

### User Story 1 - Xat bàsic amb personalitat (Priority: P1)

L'usuari obre l'app, tria una personalitat (Otaku o Gitano) i envia missatges de text. Rep respostes de l'IA amb el llenguatge i gerga corresponent.

**Why this priority**: Funcionalitat core del xatbot; sense això no hi ha valor.

**Independent Test**: Enviar missatge de text i verificar que la resposta usa la personalitat triada (Otaku amb expressions japoneses o Gitano amb caló).

**Acceptance Scenarios**:

1. **Given** usuari a la pàgina de xat, **When** tria Otaku i envia "Hola", **Then** rep resposta amb llenguatge otaku (sugoi, kawaii, etc.)
2. **Given** usuari a la pàgina de xat, **When** tria Gitano i envia "Hola", **Then** rep resposta amb gerga gitana (chaval, tío, etc.)

---

### User Story 2 - Múltiples xats i galeria (Priority: P2)

L'usuari pot crear nous xats, llistar-los i canviar entre ells. Cada xat té historial i galeria propis amb imatges i fitxers.

**Why this priority**: Organització de converses; essencial per experiència completa.

**Independent Test**: Crear dos xats, afegir imatges a cada un, canviar entre xats i verificar que cada galeria mostra només les imatges del xat actiu.

**Acceptance Scenarios**:

1. **Given** usuari amb xat obert, **When** obre el menú lateral i clica "Crear nou xat", **Then** s'obre un xat buit i apareix a la llista
2. **Given** usuari amb múltiples xats, **When** obre el menú lateral i selecciona un xat, **Then** es mostra l'historial d'aquell xat
3. **Given** usuari amb xats a la llista, **When** clica el botó paperera d'un xat, **Then** es demana confirmació i es pot eliminar

---

### User Story 3 - Pujada de fitxers i transcripció (Priority: P3)

L'usuari pot enviar imatges, fitxers i notes de veu. Les notes de veu es transcriuen automàticament. Límits: 24 MB per fitxer, 6 fitxers per missatge.

**Why this priority**: Multimodalitat; augmenta el valor del xat.

**Independent Test**: Pujar imatge i nota de veu; verificar que l'imatge es mostra i la transcripció apareix com a text.

**Acceptance Scenarios**:

1. **Given** usuari al xat, **When** puja imatge (< 24 MB), **Then** es mostra i l'IA la processa
2. **Given** usuari al xat, **When** grava nota de veu i envia, **Then** es transcribe i el text s'afegeix al missatge
3. **Given** usuari sense connexió, **When** intenta transcriure, **Then** es mostra error i pot reintentar

---

### Formats de fitxer acceptats

- **Imatges**: JPEG, PNG, WebP, GIF.
- **Àudio**: MP3, WAV, WebM, OGG. **Durada màxima nota de veu**: 60 segons.
- **Documents**: PDF, TXT.

### Idioma de la interfície

- **Català**: Tots els textos de la UI (botons, menús, missatges d'error, etc.) en català.

### Edge Cases

- Què passa quan es puja un fitxer > 24 MB? Mostrar error i rebutjar.
- Què passa quan s'intenten afegir > 6 fitxers a un missatge? Bloquejar i mostrar avís.
- Què passa quan falla la transcripció (offline, error API)? Mostrar missatge d'error; botó actiu per reintentar.
- Com es gestiona la quota d'IndexedDB? Avís quan s'apropi al límit del navegador.
- Què passa si la nota de veu > 60 segons? Mostrar error i rebutjar abans d'enviar a transcripció.

## Requirements

### Functional Requirements

- **FR-001**: El sistema HA de permetre triar entre les personalitats Otaku (Oni-chan) i Gitano (Primo).
- **FR-002**: El sistema HA de persistir la tria de personalitat a IndexedDB i sincronitzar a Supabase quan online.
- **FR-003**: El sistema HA de permetre crear, llistar i canviar entre múltiples xats.
- **FR-004**: El sistema HA de validar límits: 24 MB per fitxer, 6 fitxers per missatge; text il·limitat.
- **FR-005**: El sistema HA de guardar blobs (imatges, àudio, fitxers) a IndexedDB; mai a Supabase Storage.
- **FR-006**: El sistema HA de transcriure notes de veu via endpoint `/api/transcribe`; en cas d'error, mostrar missatge i permetre reintentar.
- **FR-007**: El sistema HA d'utilitzar només Auth anònim (Supabase); sense registre ni login.
- **FR-008**: Cada xat HA de tenir galeria pròpia amb accés instantani als mitjans des d'IndexedDB.
- **FR-009**: El títol del xat es genera per l'IA (resum) desprès de 2-3 intercanvis i és editable per l'usuari.
- **FR-010**: L'usuari HA de poder eliminar xats des del menú lateral (botó paperera); amb confirmació.
- **FR-011**: La galeria s'obre fent clic al div del títol del xat.
- **FR-012**: La llista de xats s'ordena per data de modificació (més recent dalt).

### Key Entities

- **Chat**: Conversa amb ID únic; conté missatges, IDs de fitxers locals, personalitat; historial i galeria propis.
- **Message**: Missatge de text amb referències opcionals a blobs (IDs locals).
- **Blob**: Imatge, àudio o fitxer emmagatzemat a IndexedDB; referenciat per ID local.
- **Preferences**: Tria de personalitat (Otaku/Gitano) per usuari.

## Success Criteria

### Measurable Outcomes

- **SC-001**: L'usuari pot completar un intercanvi de missatges amb personalitat triada en menys de 30 segons.
- **SC-002**: La galeria carrega imatges en menys de 500 ms des d'IndexedDB.
- **SC-003**: L'app funciona offline per llegir historial i visualitzar galeries.
- **SC-004**: La transcripció retorna text vàlid en menys de 5 segons per a notes de veu de fins a 60 segons.

## Appendix: Personalitats

### Otaku (Oni-chan)

Llenguatge energètic, expressions japoneses (sugoi, kawaii, nee-chan, yatta, gambatte…), kaomojis. Guiar l'usuari amb afecte de germana major.

### Gitano (Primo)

Llenguatge càlid amb caló i gerga romaní (molar, chaval, tío, cante, parné, flipar, mola mazo, nanai, chungo…). Guiar l'usuari amb confiança.
