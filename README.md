# MTSK - Motorlu Taşıtlar Sürücü Kursu Yönetim Sistemi

Motorlu taşıtlar sürücü kursu yönetimi için Electron tabanlı desktop uygulaması.

## Teknoloji Stack

- **Desktop Shell**: Electron
- **UI**: React + Vite
- **Backend**: Node.js + TypeScript + Express
- **Database**: Supabase (PostgreSQL)
- **Package Manager**: pnpm

## Proje Yapısı

```
packages/
  ├── app/      # Electron main process
  ├── ui/       # React frontend
  ├── api/      # Node.js backend service
  └── shared/   # Shared types & utilities
```

## Kurulum

1. Dependencies yükle:
```bash
pnpm install
```

2. Environment variables ayarla:
```bash
# .env dosyası oluştur ve aşağıdaki değişkenleri ekle:
# SUPABASE_URL=https://kdvluufmzgxhqnpfnvdn.supabase.co
# SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# SUPABASE_DB_PASSWORD=Tkaipd771
# PORT=3001
```

3. Supabase migration uygula:
```bash
# Supabase dashboard'dan SQL Editor'da supabase_migration.sql dosyasını çalıştır
```

4. Development modunda çalıştır:
```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Geliştirme Kuralları

`.cursorrules` dosyasındaki kurallara uyulmalıdır:
- Her feature sonrası `pnpm build` çalıştırılmalı
- Build başarılıysa commit & push yapılmalı
- Modüller sırayla geliştirilmeli (değiştirilemez sıra)

