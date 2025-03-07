# [AnimePlanet](https://animeplanet.org/)

![AnimePlanet Logo](https://i.imgur.com/QWef9pk.png)
**Otwarty projekt strony internetowej dla fanów anime, stworzony z wykorzystaniem SvelteKit, Tailwind CSS i nowoczesnych technologii backendowych.**

## 📌 Opis projektu

AnimePlanet to platforma dla miłośników anime, umożliwiająca przeglądanie informacji o seriach, odcinkach oraz interakcję z innymi użytkownikami. Aktualnie strona pozwala jedynie na oglądanie anime, jednak w przyszłości planowane są funkcje takie jak:

- Możliwość dodawania komentarzy,
- Tworzenie grup tłumaczących anime,
- Zarządzanie własnym kontem.

Projekt jest rozwijany jako open-source, a jego głównym celem jest dostarczenie intuicyjnego i estetycznego interfejsu z wysoką wydajnością.

## 🚀 Technologie

- **Frontend:** [SvelteKit](https://kit.svelte.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** SvelteKit, Drizzle, SQLite(Turso)
- **Autoryzacja:** Tymczasowo hash hasła
- **Hosting:** Render

## 🔧 Instalacja

Aby uruchomić projekt lokalnie, wykonaj następujące kroki:

### 1️⃣ Klonowanie repozytorium

```sh
git clone https://github.com/seba9989/AnimePlanet.git
cd AnimePlanet
```

### 2️⃣ Instalacja zależności

```sh
npm install
```

### 3️⃣ Konfiguracja środowiska

Utwórz plik `.env` na podstawie `.env.example` i uzupełnij niezbędne dane:

```
DATABASE_URL=your-database-url
DATABASE_AUTH_TOKEN=your-database-token

# DC Bot Config
DC_BOT_TOKEN=your-dc-bot-token
DC_EPISODES_CHANNEL=your-dc-channel-id
```

### 4️⃣ Uruchomienie aplikacji

```sh
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

## 💡 Wkład w projekt

Chętnie przyjmujemy kontrybucje! Jeśli chcesz pomóc w rozwoju AnimePlanet, oto jak możesz się zaangażować:

- Zgłaszanie błędów (issues)
- Propozycje nowych funkcji
- Poprawki i optymalizacja kodu
- Wsparcie w projektowaniu UI/UX

### Jak rozpocząć kontrybucję?

1. Forkuj repozytorium.
2. Stwórz nowy branch.
3. Wprowadź zmiany i przetestuj je.
4. Wyślij Pull Requesta.

## 📄 Licencja

Projekt jest dostępny na licencji **MIT** – możesz go dowolnie używać i rozwijać.

## 🌟 Kontakt

Jeśli masz pytania lub chcesz się skontaktować z twórcami, napisz do mnie na DC **seba9989** lub otwórz issue na GitHubie.

---

Dziękujemy za wsparcie i zainteresowanie AnimePlanet! 🎌
