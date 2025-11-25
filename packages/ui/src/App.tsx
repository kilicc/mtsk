import { useState, useEffect } from 'react';
import TopMenu, { type Page } from './components/TopMenu';
import Dashboard from './pages/Dashboard';
import KursiyerList from './pages/KursiyerList';
import KursiyerDetail from './pages/KursiyerDetail';
import KursiyerYeniKayit from './pages/KursiyerYeniKayit';
import KursiyerSinavListesi from './pages/KursiyerSinavListesi';
import KursiyerSinavIslemleri from './pages/KursiyerSinavIslemleri';
import KursiyerSinavNotGirisi from './pages/KursiyerSinavNotGirisi';
import KursiyerTopluMebbis from './pages/KursiyerTopluMebbis';
import KursiyerBakiyeRaporu from './pages/KursiyerBakiyeRaporu';
import KursiyerFaturaListesi from './pages/KursiyerFaturaListesi';
import KursiyerEKursiyerListesi from './pages/KursiyerEKursiyerListesi';
import KursiyerEKursiyerAnaliz from './pages/KursiyerEKursiyerAnaliz';
import KursiyerIstatistik from './pages/KursiyerIstatistik';
import KursiyerDonemIstatistik from './pages/KursiyerDonemIstatistik';
import KursiyerGorusmeListesi from './pages/KursiyerGorusmeListesi';
import KursiyerEvrakListesi from './pages/KursiyerEvrakListesi';
import KursiyerFotografKarsilastirma from './pages/KursiyerFotografKarsilastirma';
import AracDetail from './pages/AracDetail';
import PersonelDetail from './pages/PersonelDetail';
import DersProgrami from './pages/DersProgrami';
import KurumsalDersProgrami from './pages/KurumsalDersProgrami';
import DersProgramiTeorik from './pages/DersProgramiTeorik';
import DersProgramiUygulama from './pages/DersProgramiUygulama';
import DersProgramiListesi from './pages/DersProgramiListesi';
import DersProgramiAnalizi from './pages/DersProgramiAnalizi';
import KurumsalDersListesi from './pages/KurumsalDersListesi';
import Finans from './pages/Finans';
import SMS from './pages/SMS';
import AracPersonel from './pages/AracPersonel';
import AracYakit from './pages/AracYakit';
import KursiyerOnKayit from './pages/KursiyerOnKayit';
import Referans from './pages/Referans';
import DogumGunu from './pages/DogumGunu';
import EksikEvrak from './pages/EksikEvrak';
import KullaniciMesajlari from './pages/KullaniciMesajlari';
import Parametreler from './pages/Parametreler';
import Yedekleme from './pages/Yedekleme';
import CariFirma from './pages/CariFirma';
import Banka from './pages/Banka';
import Raporlar from './pages/Raporlar';
import Hizmet from './pages/Hizmet';
import Tanimlar from './pages/Tanimlar';
import KasaListesi from './pages/KasaListesi';
import KasaToplamlari from './pages/KasaToplamlari';
import KasaParaGirisCikis from './pages/KasaParaGirisCikis';
import KasaHareketleri from './pages/KasaHareketleri';
import KasaTransfer from './pages/KasaTransfer';
import KasaYeniKayit from './pages/KasaYeniKayit';
import OdemePlani from './pages/OdemePlani';
import Tahsilat from './pages/Tahsilat';
import BorcSMS from './pages/BorcSMS';
import SanalPosTahsilat from './pages/SanalPosTahsilat';
import SMSSablonlari from './pages/SMSSablonlari';
import SMSRaporlari from './pages/SMSRaporlari';
import PersonelYeniKayit from './pages/PersonelYeniKayit';
import AracYeniKayit from './pages/AracYeniKayit';
import DonemSubeTanimlama from './pages/DonemSubeTanimlama';
import SinavTarihiTanimlama from './pages/SinavTarihiTanimlama';

function App() {
  const [apiConnected, setApiConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedKursiyerId, setSelectedKursiyerId] = useState<number | null>(null);
  const [selectedAracId, setSelectedAracId] = useState<number | null>(null);
  const [selectedPersonelId, setSelectedPersonelId] = useState<number | null>(null);
  const [selectedKasaId, setSelectedKasaId] = useState<number | null>(null);

  useEffect(() => {
    // Check API health
    fetch('http://localhost:3001/health')
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
    
    // Check every 30 seconds
    const interval = setInterval(() => {
      fetch('http://localhost:3001/health')
        .then(() => setApiConnected(true))
        .catch(() => setApiConnected(false));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopMenu currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="max-w-full" style={{ paddingTop: currentPage === 'dashboard' ? '0px' : '220px', position: 'relative', zIndex: 1 }}>
        {currentPage !== 'dashboard' && (
        <header className="bg-gray-100 border-b border-gray-300" style={{ position: 'relative', zIndex: 10 }}>
          <div className="px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {currentPage === 'kursiyer' && 'Kursiyer Listesi'}
                {currentPage === 'kursiyer-detail' && 'Kursiyer Detay'}
                {currentPage === 'kursiyer-yeni-kayit' && 'Kursiyer Yeni Kayıt'}
                {currentPage === 'kursiyer-sinav-listesi' && 'Sınav Listesi'}
                {currentPage === 'kursiyer-sinav-islemleri' && 'Sınav İşlemleri'}
                {currentPage === 'kursiyer-sinav-not-girisi' && 'Sınav Not Girişi'}
                {currentPage === 'kursiyer-toplu-mebbis' && 'Toplu Mebbis Gönderimi'}
                {currentPage === 'kursiyer-bakiye-raporu' && 'Bakiye Raporu'}
                {currentPage === 'kursiyer-detayli-bakiye-raporu' && 'Detaylı Bakiye Raporu'}
                {currentPage === 'kursiyer-fatura-listesi' && 'Fatura Listesi'}
                {currentPage === 'kursiyer-e-kursiyer-listesi' && 'E-Kursiyer Listesi'}
                {currentPage === 'kursiyer-e-kursiyer-analiz' && 'E-Kursiyer Analiz'}
                {currentPage === 'kursiyer-istatistik' && 'İstatistik'}
                {currentPage === 'kursiyer-donem-istatistik' && 'Dönem (MEİS) İstatistiği'}
                {currentPage === 'kursiyer-gorusme-listesi' && 'Görüşme Listesi'}
                {currentPage === 'kursiyer-evrak-listesi' && 'Evrak Listesi'}
                {currentPage === 'kursiyer-fotograf-karsilastirma' && 'Fotoğraf Karşılaştırma'}
                {currentPage === 'arac-detail' && 'Araç Detay'}
                {currentPage === 'personel-detail' && 'Personel Detay'}
                {currentPage === 'kursiyer-on-kayit' && 'Ön Kayıt'}
                {currentPage === 'ders-programi' && 'Ders Programı'}
                {currentPage === 'ders-programi-teorik' && 'Teorik Ders Programı'}
                {currentPage === 'ders-programi-uygulama' && 'Uygulama Ders Programı'}
                {currentPage === 'ders-programi-listesi' && 'Ders Programı Listesi'}
                {currentPage === 'ders-programi-analizi' && 'Ders Programı Analizi'}
                {currentPage === 'kurumsal-ders-programi' && 'Kurumsal Ders Programı'}
                {currentPage === 'kurumsal-ders-listesi' && 'Kurumsal Ders Listesi'}
                {currentPage === 'finans' && 'Finans & Kasa'}
                {currentPage === 'sms' && 'SMS Servisi'}
                {currentPage === 'arac-personel' && 'Araç & Personel'}
                {currentPage === 'arac-yakit' && 'Yakıt Takibi'}
                {currentPage === 'referans' && 'Referans İşlemleri'}
                {currentPage === 'dogum-gunu' && 'Doğum Günü Takibi'}
                {currentPage === 'eksik-evrak' && 'Eksik Evrak Takibi'}
                {currentPage === 'kullanici-mesajlari' && 'Kullanıcı Mesajları'}
                {currentPage === 'parametreler' && 'Parametreler'}
                {currentPage === 'yedekleme' && 'Yedekleme'}
                {currentPage === 'cari-firma' && 'Cari / Firma'}
                {currentPage === 'banka' && 'Banka'}
                {currentPage === 'raporlar' && 'Raporlar'}
                {currentPage === 'hizmet' && 'Hizmet'}
                {currentPage === 'tanimlar' && 'Tanımlar'}
                {currentPage === 'kasa-listesi' && 'Kasa Listesi'}
                {currentPage === 'kasa-toplamlari' && 'Kasa Toplamları'}
                {currentPage === 'kasa-para-giris-cikis' && 'Para Giriş/Çıkışı Ekle'}
                {currentPage === 'kasa-hareketleri' && 'Kasa Hareketleri'}
                {currentPage === 'kasa-transfer' && 'Kasalar Arası Transfer'}
                {currentPage === 'kasa-yeni-kayit' && 'Kasa Yeni Kayıt'}
                {currentPage === 'odeme-plani' && 'Ödeme Planı'}
                {currentPage === 'tahsilat' && 'Tahsilat'}
                {currentPage === 'borc-sms' && 'Borç SMS'}
                {currentPage === 'sanal-pos-tahsilat' && 'Sanal Pos Tahsilat'}
                {currentPage === 'sms-sablonlari' && 'SMS Şablonları'}
                {currentPage === 'sms-raporlari' && 'SMS Raporları'}
                {currentPage === 'personel-yeni-kayit' && 'Personel Yeni Kayıt'}
                {currentPage === 'arac-yeni-kayit' && 'Araç Yeni Kayıt'}
                {currentPage === 'donem-sube-tanimlama' && 'Dönem Şube Tanımlama'}
                {currentPage === 'sinav-tarihi-tanimlama' && 'Sınav Tarihi Tanımlama'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                apiConnected 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {apiConnected ? 'Bağlı' : 'Bağlantı Hatası'}
              </div>
            </div>
          </div>
        </header>
        )}

        <main 
          className={`${
            currentPage === 'kursiyer-yeni-kayit' || 
            currentPage === 'kursiyer-detail' || 
            currentPage === 'kursiyer-sinav-not-girisi' ||
            currentPage === 'kursiyer-toplu-mebbis' ||
            currentPage === 'kursiyer-sinav-islemleri' ||
            currentPage === 'arac-detail' ||
            currentPage === 'personel-detail' ||
            currentPage === 'kursiyer-on-kayit'
              ? 'bg-amber-50' 
              : 'bg-gray-50'
          }`}
          style={{ 
            height: currentPage === 'dashboard' ? 'auto' : 'calc(100vh - 220px)',
            overflowY: currentPage === 'dashboard' ? 'hidden' : 'auto',
            overflowX: 'hidden'
          }}
        >
          {currentPage === 'dashboard' && <Dashboard onPageChange={setCurrentPage} />}
          {currentPage === 'kursiyer' && (
            <KursiyerList 
              onDetailClick={(id) => {
                setSelectedKursiyerId(id);
                setCurrentPage('kursiyer-detail');
              }}
              onNewClick={() => setCurrentPage('kursiyer-yeni-kayit')}
            />
          )}
          {currentPage === 'kursiyer-yeni-kayit' && (
            <KursiyerYeniKayit />
          )}
          {currentPage === 'kursiyer-sinav-listesi' && (
            <KursiyerSinavListesi 
              onDetailClick={(id) => {
                setSelectedKursiyerId(id);
                setCurrentPage('kursiyer-detail');
              }}
            />
          )}
          {currentPage === 'kursiyer-sinav-islemleri' && (
            <KursiyerSinavIslemleri />
          )}
          {currentPage === 'kursiyer-sinav-not-girisi' && (
            <KursiyerSinavNotGirisi />
          )}
          {currentPage === 'kursiyer-toplu-mebbis' && (
            <KursiyerTopluMebbis />
          )}
          {currentPage === 'kursiyer-bakiye-raporu' && (
            <KursiyerBakiyeRaporu />
          )}
          {currentPage === 'kursiyer-detayli-bakiye-raporu' && (
            <KursiyerBakiyeRaporu />
          )}
          {currentPage === 'kursiyer-fatura-listesi' && (
            <KursiyerFaturaListesi />
          )}
          {currentPage === 'kursiyer-e-kursiyer-listesi' && (
            <KursiyerEKursiyerListesi />
          )}
          {currentPage === 'kursiyer-e-kursiyer-analiz' && (
            <KursiyerEKursiyerAnaliz />
          )}
          {currentPage === 'kursiyer-istatistik' && (
            <KursiyerIstatistik />
          )}
          {currentPage === 'kursiyer-donem-istatistik' && (
            <KursiyerDonemIstatistik />
          )}
          {currentPage === 'kursiyer-gorusme-listesi' && (
            <KursiyerGorusmeListesi />
          )}
          {currentPage === 'kursiyer-evrak-listesi' && (
            <KursiyerEvrakListesi />
          )}
          {currentPage === 'kursiyer-fotograf-karsilastirma' && (
            <KursiyerFotografKarsilastirma />
          )}
          {currentPage === 'kursiyer-detail' && selectedKursiyerId && (
            <KursiyerDetail 
              id={selectedKursiyerId.toString()}
              onBack={() => setCurrentPage('kursiyer')}
            />
          )}
          {currentPage === 'kursiyer-on-kayit' && <KursiyerOnKayit />}
          {currentPage === 'ders-programi' && <DersProgrami />}
          {currentPage === 'ders-programi-teorik' && <DersProgramiTeorik />}
          {currentPage === 'ders-programi-uygulama' && <DersProgramiUygulama />}
          {currentPage === 'ders-programi-listesi' && <DersProgramiListesi />}
          {currentPage === 'ders-programi-analizi' && <DersProgramiAnalizi />}
          {currentPage === 'kurumsal-ders-programi' && <KurumsalDersProgrami />}
          {currentPage === 'kurumsal-ders-listesi' && <KurumsalDersListesi />}
          {currentPage === 'finans' && <Finans onPageChange={setCurrentPage} />}
          {currentPage === 'sms' && <SMS />}
          {currentPage === 'arac-personel' && (
            <AracPersonel
              onAracDetailClick={(id) => {
                if (id === 0) {
                  setCurrentPage('arac-yeni-kayit');
                } else {
                  setSelectedAracId(id);
                  setCurrentPage('arac-detail');
                }
              }}
              onPersonelDetailClick={(id) => {
                if (id === 0) {
                  setCurrentPage('personel-yeni-kayit');
                } else {
                  setSelectedPersonelId(id);
                  setCurrentPage('personel-detail');
                }
              }}
            />
          )}
          {currentPage === 'arac-detail' && selectedAracId && (
            <AracDetail
              id={selectedAracId.toString()}
              onBack={() => setCurrentPage('arac-personel')}
            />
          )}
          {currentPage === 'personel-detail' && selectedPersonelId && (
            <PersonelDetail
              id={selectedPersonelId.toString()}
              onBack={() => setCurrentPage('arac-personel')}
            />
          )}
          {currentPage === 'arac-yakit' && <AracYakit />}
          {currentPage === 'referans' && <Referans />}
          {currentPage === 'dogum-gunu' && <DogumGunu />}
          {currentPage === 'eksik-evrak' && <EksikEvrak />}
          {currentPage === 'kullanici-mesajlari' && <KullaniciMesajlari />}
          {currentPage === 'parametreler' && <Parametreler />}
          {currentPage === 'yedekleme' && <Yedekleme />}
          {currentPage === 'cari-firma' && <CariFirma />}
          {currentPage === 'banka' && <Banka />}
          {currentPage === 'raporlar' && <Raporlar />}
          {currentPage === 'hizmet' && <Hizmet />}
          {currentPage === 'tanimlar' && <Tanimlar onPageChange={setCurrentPage} />}
          {currentPage === 'donem-sube-tanimlama' && <DonemSubeTanimlama />}
          {currentPage === 'sinav-tarihi-tanimlama' && <SinavTarihiTanimlama />}
          {currentPage === 'kasa-listesi' && (
            <KasaListesi 
              onNewClick={() => setCurrentPage('kasa-yeni-kayit')}
              onDetailClick={(id) => {
                setSelectedKasaId(id);
                setCurrentPage('kasa-yeni-kayit');
              }}
            />
          )}
          {currentPage === 'kasa-toplamlari' && <KasaToplamlari />}
          {currentPage === 'kasa-para-giris-cikis' && <KasaParaGirisCikis />}
          {currentPage === 'kasa-hareketleri' && <KasaHareketleri />}
          {currentPage === 'kasa-transfer' && <KasaTransfer />}
          {currentPage === 'kasa-yeni-kayit' && (
            <KasaYeniKayit 
              kasaId={selectedKasaId || undefined}
              onBack={() => setCurrentPage('kasa-listesi')}
            />
          )}
          {currentPage === 'odeme-plani' && <OdemePlani />}
          {currentPage === 'tahsilat' && <Tahsilat />}
          {currentPage === 'borc-sms' && <BorcSMS />}
          {currentPage === 'sanal-pos-tahsilat' && <SanalPosTahsilat />}
          {currentPage === 'sms-sablonlari' && <SMSSablonlari />}
          {currentPage === 'sms-raporlari' && <SMSRaporlari />}
          {currentPage === 'personel-yeni-kayit' && (
            <PersonelYeniKayit
              onBack={() => setCurrentPage('arac-personel')}
              onSave={() => setCurrentPage('arac-personel')}
            />
          )}
          {currentPage === 'arac-yeni-kayit' && (
            <AracYeniKayit
              onBack={() => setCurrentPage('arac-personel')}
              onSave={() => setCurrentPage('arac-personel')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
