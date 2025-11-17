import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import kursiyerRoutes from './routes/kursiyer.routes';
import dersProgramiRoutes from './routes/ders-programi.routes';
import finansRoutes from './routes/finans.routes';
import smsRoutes from './routes/sms.routes';
import aracPersonelRoutes from './routes/arac-personel.routes';
import kursiyerOnKayitRoutes from './routes/kursiyer-on-kayit.routes';
import kullaniciMesajlariRoutes from './routes/kullanici-mesajlari.routes';
import eksikEvrakRoutes from './routes/eksik-evrak.routes';
import dogumGunuRoutes from './routes/dogum-gunu.routes';
import aracYakitRoutes from './routes/arac-yakit.routes';
import referansRoutes from './routes/referans.routes';
import kurumsalDersProgramiRoutes from './routes/kurumsal-ders-programi.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/kursiyer', kursiyerRoutes);
app.use('/api/ders-programi', dersProgramiRoutes);
app.use('/api/finans', finansRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/arac-personel', aracPersonelRoutes);
app.use('/api/kursiyer-on-kayit', kursiyerOnKayitRoutes);
app.use('/api/kullanici-mesajlari', kullaniciMesajlariRoutes);
app.use('/api/eksik-evrak', eksikEvrakRoutes);
app.use('/api/dogum-gunu', dogumGunuRoutes);
app.use('/api/arac-yakit', aracYakitRoutes);
app.use('/api/referans', referansRoutes);
app.use('/api/kurumsal-ders-programi', kurumsalDersProgramiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MTSK API Server running on http://localhost:${PORT}`);
  console.log(`📊 Supabase connected: ${process.env.SUPABASE_URL}`);
});

