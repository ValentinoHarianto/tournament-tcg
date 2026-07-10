# Tournament Management System - TCG Edition

Aplikasi web untuk manajemen turnamen Trading Card Games dengan fokus pada Swiss Pairing system.

## Fitur Utama

- 🎯 **Swiss Pairing Algorithm**: Sistem pairing otomatis yang adil dan sesuai dengan standar TCG
- 📊 **Real-time Standings**: Tabel klasemen yang terupdate secara otomatis
- 🔄 **Round Management**: Kelola ronde turnamen dengan mudah
- 💾 **Persistent Storage**: Data tersimpan di browser menggunakan Zustand
- 📱 **Responsive Design**: Optimal untuk desktop, tablet, dan mobile
- 🎮 **Pokémon TCG Support**: Built-in support untuk tiebreaker OMW (Opponent Win Percentage)

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Language**: TypeScript
- **Testing**: Jest + React Testing Library

## Instalasi

```bash
# Clone repository
git clone https://github.com/ValentinoHarianto/tournament-tcg.git
cd tournament-tcg

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Project

```
.
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage / Dashboard
│   ├── globals.css               # Global styles
│   └── favicon.ico
├── components/
│   ├── Standings.tsx             # Tabel klasemen
│   ├── PairingResult.tsx         # Tampilan hasil pairing
│   ├── InputResult.tsx           # Form input hasil pertandingan
│   └── Button.tsx                # Reusable button component
├── lib/
│   ├── types.ts                  # Type definitions
│   ├── swissPairing.ts           # Swiss Pairing algorithm
│   ├── tiebreaker.ts             # Tiebreaker calculations (Pokémon TCG)
│   └── utils.ts                  # Utility functions
├── hooks/
│   └── useTournament.ts          # Custom hook for tournament state
├── store/
│   └── tournamentStore.ts        # Zustand store for tournament data
├── __tests__/
│   ├── swissPairing.test.ts
│   └── tiebreaker.test.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── jest.config.js
└── README.md
```

## Cara Menggunakan

1. **Tambah Pemain**: Gunakan form di dashboard untuk menambahkan pemain
2. **Generate Pairing**: Klik tombol "Generate Pairing" untuk membuat pairing ronde
3. **Input Hasil**: Masukkan hasil pertandingan (2-0, 2-1, 1-1-1, etc.)
4. **Lanjut Ronde**: Sistem akan otomatis update standings dan siap untuk ronde berikutnya

## Development

```bash
# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm run start
```

## License

MIT
