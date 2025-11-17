# MTSK Programı - Kapsamlı Analiz Belgesi

Bu belge, **Wenntec Sürücü Kursu Programı** (https://wenntec.com.tr/surucu-kursu-programi/) ve **Demo Uygulama** (https://uygulama.cizgisoft.com/) analizlerinden çıkarılan tüm modül işlevselliğini içermektedir.

## Analiz Kaynakları

1. **Wenntec Resmi Sayfası**: Özellik listesi ve modül yapısı
2. **Demo Uygulama (CizgiSoft)**: Gerçek kullanım senaryoları ve UI/UX örnekleri
3. **SQL Server Schema**: Veritabanı yapısı (deneme.sql)

## GENEL ÖZELLİKLER (Wenntec'ten)

1. **Veritabanı**: MS SQL Server (Biz Supabase PostgreSQL kullanıyoruz)
2. **Kullanıcı Yönetimi**: Sınırsız kullanıcı oluşturma ve 400 kalem kullanıcı yetkisi
3. **Kurulum**: Sınırsız sayıda bilgisayara kurulum
4. **Şube Yönetimi**: Sınırsız sayıda şube tanımlama
5. **Şubeler Arası Aktarım**: Kursiyer kart aktarım işlemleri
6. **Kullanıcı Takip Sistemi**: Geliştirilmiş admin yönetim
7. **Yedekleme**: Haftanın 7 gününü ayrı ayrı ayarlayarak farklı saat dilimlerinde yedek alma (Program kapalı olsa dahi)
8. **Kursiyer Ön Kayıt**: Görüşmeleri kayıt altına alma, kesin kayıt yaptıracak kursiyerleri anında kartına aktarma
9. **Kullanıcı Mesajları**: Programa giriş yetkisi olan kullanıcılara mesaj gönderme
10. **Toplu SMS**: Kursiyerlere her an her yerden SMS gönderme

## Genel Yapı

- **Pano (Dashboard)**: Ana sayfa, özet bilgiler, widget'lar
- **Not Defteri**: Kullanıcıya özel notlar, alarmlar, sabitleme
- **Vade Tarihi**: Vade takibi
- **Görüşme Kontrol**: Görüşme takibi

---

## Modül 1: Kursiyer Yönetimi ✅ (Tamamlandı)

### Wenntec Özellikleri:
1. **Kursiyer Kartı**: Detaylı kursiyer bilgileri
2. **Ödeme Kartı**: Normal taksit ve sınav harcı ödemeleri tek ekran
3. **Evrak Bilgileri**: Evrak taramaları, bilgileri
4. **Sınav Bilgileri**: Teori/Direksiyon sınavı not bilgileri ve sertifika bilgileri
5. **Kursiyer Notları**: Çok geniş bir alan, sayfalar dolusu not yazma
6. **Direksiyon Takip**: MEBBİS ders programlarını aktarıp K belgesi ve direksiyon takip formlarını çıkarma
7. **Referans İşlemleri**: Kursiyeri yönlendiren kurumları takip
8. **Kurumsal Ders Programı**: Gerçek direksiyon eğitimlerini takip
9. **Webcam İşlemleri**: Kayıt esnasında fotoğraf çekip MEBBİS'e aktarım
10. **Özel SMS İşlemleri**: Kursiyere özel SMS
11. **SMS Raporları**: Aktif kursiyere gönderilen tüm SMS'lerin listesi
12. **Kullanıcı Mesajı**: Aktif kursiyer hakkında kullanıcılara mesaj gönderme
13. **Kursiyer Raporları**: Çeşitli raporlar
14. **Kursiyer Ön Görüşmeleri**: Ön kayıt görüşmeleri
15. **Kursiyer İstatistik İşlemleri**: MEIS istatistik girişlerini hazırlayıp 2dk MEIS'e aktarım
16. **Grup Kart İşlemleri**: Grup yönetimi
17. **Grup Raporları**: Grup bazlı raporlar

### Demo Uygulama Özellikleri:
1. **Kursiyer Kayıt**: Yeni kursiyer kaydı
2. **Kursiyer Listesi**: 
   - Arama: TC Kimlik No, Adı, Soyadı, Kart No, Telefon, E-posta, Adres
   - Filtreleme: Durum, Grup, Şube, Kayıt Tarihi
   - İşlemler: Düzenle, Sil, SMS Gönder, Excel/PDF Export
3. **Evrak Listesi**: Kursiyer evrakları takibi
4. **Görüşme Listesi**: Kursiyer görüşmeleri
5. **Bakiye Listesi**: Kursiyer bakiyeleri
6. **Kursiyer İstatistik**: İstatistiksel raporlar

### Eksik Özellikler (Eklenmesi Gereken):
- ⚠️ Kursiyer Ön Kayıt modülü
- ⚠️ Webcam işlemleri (fotoğraf çekme)
- ⚠️ Referans İşlemleri
- ⚠️ Kurumsal Ders Programı
- ⚠️ Kullanıcı Mesajları sistemi
- ⚠️ MEIS entegrasyonu

---

## Modül 2: Ders & Direksiyon Planlama ✅ (Tamamlandı)

### Wenntec Özellikleri:
1. **Teori Ders Programı**: Teorik ders planlama
2. **Direksiyon Ders Programı**: Direksiyon ders planlama
3. **Kurumsal Ders Programı**: Gerçek direksiyon eğitimlerini takip

### Demo Uygulama Özellikleri:
1. **Ders Programı**: 
   - Takvim görünümü
   - Ders planlama
   - MEBBİS import/export
2. **Sınav Tarihi**: Sınav tarihleri takibi

### Eksik Özellikler (Eklenmesi Gereken):
- ⚠️ Kurumsal Ders Programı (gerçek direksiyon eğitimleri takibi)

---

## Modül 3: Finans & Kasa ✅ (Tamamlandı)

### Wenntec Özellikleri:
1. **Kasa İşlemleri**: Kasa yönetimi
2. **Kasa Raporları**: Kasa raporları
3. **Fatura Takip İşlemleri**: Fatura takibi
4. **Aylık Finans Tablosu**: Aylık finansal özet
5. **Günü Geçmiş Ödemeler Listesi/SMS**: Vadesi geçen ödemeler ve otomatik SMS
6. **Borç/Bakiye Raporları**: Borç ve bakiye raporları

### Demo Uygulama Özellikleri:
1. **Günlük Kasa**: Günlük kasa işlemleri
2. **Fatura Raporu**: Fatura raporları
3. **Bakiye Listesi**: Kursiyer bakiyeleri
4. **Borc SMS**: Borçlu kursiyerlere otomatik SMS

### Kasa Modülü Detayları (Demo'dan):
1. **Sanal Pos Tahsilat**: Sanal pos ile tahsilat işlemleri
2. **Kasa Toplamları**: Kasa toplam raporları
3. **Para Giriş/Çıkışı Ekle**: Manuel para giriş/çıkış kayıtları
4. **Kasa Hareketleri**: Tüm kasa hareketlerinin listesi
5. **Kasalar Arası Transfer**: Kasalar arası para transferi
6. **Kasa Listesi**: Tüm kasaların listesi
7. **Kasa Yeni Kayıt**: Yeni kasa kaydı
8. **Kasa Grup**: Kasa grupları yönetimi
9. **Tahsilat Makbuzu Dizayn (Yazıcı)**: Makbuz tasarımı ve yazdırma

### Eksik Özellikler (Eklenmesi Gereken):
- ⚠️ Aylık Finans Tablosu
- ⚠️ Günü Geçmiş Ödemeler Listesi (otomatik SMS ile)

---

## Modül 4: SMS Servisi ✅ (Tamamlandı)

### Wenntec Özellikleri:
1. **Toplu SMS İşlemleri**: Genel toplu SMS
2. **Özel Toplu SMS İşlemleri**: Özel kriterlere göre SMS
3. **SMS Raporları**: Gönderilen SMS'lerin raporları
4. **Otomatik SMS Ayarları**: Otomatik SMS gönderim ayarları
5. **SMS Tanımları ve Şablonlar**: SMS şablon yönetimi
6. **SMS Abonelik İşlemleri**: SMS abonelik yönetimi

### Demo Uygulama Özellikleri:
1. **Toplu SMS**: Seçilen kursiyerlere toplu SMS
2. **SMS Şablonları**: Önceden tanımlı şablonlar
3. **Borc SMS**: Otomatik borç hatırlatma SMS'leri

### Eksik Özellikler (Eklenmesi Gereken):
- ⚠️ Özel Toplu SMS İşlemleri
- ⚠️ SMS Abonelik İşlemleri

---

## Modül 5: Araç & Personel & Evrak Takip

### Wenntec Özellikleri:
1. **Araç Yakıt Takip İşlemleri**: Araç yakıt tüketimi takibi
2. **Araç Bakım Takip İşlemleri**: Araç bakım takibi
3. **Araç Ceza Takip İşlemleri**: Trafik cezaları takibi
4. **Personel Kartı**: Personel bilgileri ve takibi

### 5.1 Personel Yönetimi

#### Alt Modüller:
1. **Personel Yeni Kayıt**: Yeni personel kaydı
2. **Personel Listesi**:
   - **Arama Alanları**:
     - Personel Kodu
     - TC Kimlik No
     - Adı
     - Soyadı
     - Kart No
     - Departmanı (dropdown)
     - İşe Giriş Tarihi (tarih aralığı)
     - İşten Çıkış Tarihi (tarih aralığı)
     - Grubu (dropdown)
     - Çalışma Durumu (Çalışan/Ayrılan/Tümü)
     - Çalışma Planı (Tümü/Boş Olanlar)
     - Durumu (Aktif/Pasif/Tümü)
   - **Tablo Kolonları**:
     - No
     - İşlem
     - Seçim
     - TC Kimlik No
     - Adı
     - Soyadı
     - Grubu
     - Departmanı
     - Kayıt Tarihi
     - İşe Giriş Tarihi
     - İşten Çıkış Tarihi
     - Kart No
   - **İşlemler**:
     - Yeni Kayıt Ekle
     - SMS Gönder
     - Excel/PDF Export
     - Yazdır
3. **Görüşme Listesi**: Personel görüşmeleri
4. **Evrak Listesi**: Personel evrakları
5. **Personel Grup İşlemleri**: Personel grupları yönetimi

### 5.2 Araç İşlemleri

#### Alt Modüller:
1. **Araç Yeni Kayıt**: Yeni araç kaydı
2. **Araç Listesi**:
   - **Arama Alanları**:
     - Araç Plakası
     - Araç Marka
     - Araç Model
     - Model Yılı
     - Araç Durumu (Hepsi/Boşta/Kullanımda)
     - Genel Durumu (Aktif/Pasif/Tümü)
     - Araç Türü (Römork, Otomobil, Minibüs, Otobüs, Kamyonet, Kamyon, Çekici, Motosiklet, İş Makinesi, Tır)
     - Römorklarıda Göster (checkbox)
   - **Tablo Kolonları**:
     - No
     - Marka
     - Model
     - Plaka
     - Model Yılı
     - Türü
     - Bağlı Olduğu Araç
     - Toplam KM
     - Araç Durumu
     - Durumu
   - **İşlemler**:
     - Yeni Araç Kaydı Ekle
     - Excel/PDF Export
     - Yazdır
3. **Araç G/Ç Listesi**: Araç giriş/çıkış takibi
4. **Trafik Cezaları**: Trafik cezaları takibi
5. **Trafik Kazaları**: Trafik kazaları takibi
6. **Sigorta Listesi**: Araç sigorta takibi
7. **Bakım Listesi**: Araç bakım takibi
8. **Muayene Listesi**: Araç muayene takibi
9. **MTV Ödeme Listesi**: MTV ödemeleri takibi

### 5.3 Evrak Takip

- Kursiyer evrakları (Modül 1'de mevcut)
- Personel evrakları (Personel modülünde mevcut)

---

## Modül 6: Parametreler / Yetkilendirme

### Wenntec Parametreler:
1. **Wenntec Müşteri Bilgileri**: Müşteri bilgileri
2. **Wenntec Faturalarım**: Fatura takibi
3. **Kurs Genel Bilgileri**: Kurs bilgileri
4. **İlçe Milli Eğitim Bilgileri**: MEBBİS bağlantı bilgileri
5. **Genel Ayarlar**: Sistem ayarları
6. **Sertifika Sınıf Bilgileri**: Sertifika sınıf tanımları
7. **Araç Tanımları**: Araç bilgileri
8. **Sabit Adres Tanımları**: Adres tanımları
9. **SMS Tanımları ve Şablonlar**: SMS ayarları
10. **Otomatik SMS Ayarları**: Otomatik SMS yapılandırması
11. **Gelir/Gider Hesap Kodları**: Muhasebe kodları
12. **Banka Tanımları**: Banka bilgileri
13. **Özel Kodlar**: Özel kod tanımları

### Demo Uygulama Özellikleri:
1. **Tanımlar**: Sistem parametreleri, genel tanımlar
2. **Yetkili (Kullanıcı Yönetimi)**: 
   - Kullanıcı hesapları
   - Rol bazlı yetkilendirme (400 kalem yetki - Wenntec)
   - Şifre yönetimi

---

## Modül 7: Yedekleme & Otomasyon

### Wenntec Özellikleri:
1. **Gelişmiş Yedekleme**: 
   - Haftanın 7 gününü ayrı ayrı ayarlama
   - Farklı saat dilimlerinde yedek alma
   - Program kapalı olsa dahi yedek alma (Local tercih)
2. **Yedek İşlemleri**: Yedek yönetimi

### Demo Uygulama Özellikleri:
- Otomatik yedekleme
- Zamanlanmış görevler
- Electron timing entegrasyonu

### Eksik Özellikler (Eklenmesi Gereken):
- ⚠️ Haftanın 7 günü için ayrı yedekleme zamanları
- ⚠️ Program kapalıyken yedekleme (Electron background job)

---

## Modül 8: Paketleme

### Özellikler:
- Electron builder ile paketleme
- macOS ve Windows build
- Installer oluşturma

---

## MEBBİS İŞLEMLERİ (Wenntec)

1. **MEBBİS Kursiyer Aktarım İşlemleri**: Kursiyer bilgilerini MEBBİS'e aktarma
2. **MEBBİS Fatura Aktarım İşlemleri**: Fatura bilgilerini MEBBİS'e aktarma

## SINAV İŞLEMLERİ (Wenntec)

1. **E-Sınav İşlemleri**: Elektronik sınav yönetimi
2. **Direksiyon Sınav İşlemleri**: Direksiyon sınavı yönetimi
3. **Sertifika İşlemleri**: Sertifika yönetimi

### Eksik Özellikler (Eklenmesi Gereken):
- ⚠️ E-Sınav İşlemleri
- ⚠️ Sertifika İşlemleri

## TAKİP İŞLEMLERİ (Wenntec)

1. **Eksik Evrak Takip İşlemleri**: Eksik evrakları takip
2. **Kursiyer Doğum Günü İşlemleri**: Doğum günü takibi ve hatırlatmalar

### Eksik Özellikler (Eklenmesi Gereken):
- ⚠️ Eksik Evrak Takip İşlemleri
- ⚠️ Kursiyer Doğum Günü İşlemleri

## YARDIM BÖLÜMÜ (Wenntec)

1. **Versiyon Bilgileri**: Program versiyonu
2. **Wenntec Duyurular**: Duyuru sistemi
3. **Eğitim Videoları**: Eğitim içerikleri
4. **Yedek İşlemleri**: Yedekleme yönetimi
5. **Program Temaları**: Tema yönetimi
6. **Genel Program Kontrol/Düzenleme İşlemleri**: Sistem kontrolü
7. **SMS Abonelik İşlemleri**: SMS abonelik yönetimi

## Diğer Modüller (Demo'da Görülen)

### Cari / Firma
- Cari hesap yönetimi
- Firma bilgileri
- Alt menüler: (menü yapısından görüldüğü kadarıyla)

### Banka
- Banka hesapları
- Banka işlemleri
- Alt menüler: (menü yapısından görüldüğü kadarıyla)

### Fatura
- Fatura oluşturma
- Fatura listesi
- Fatura raporları
- Alt menüler: (menü yapısından görüldüğü kadarıyla)

### Raporlar
- Çeşitli raporlar
- İstatistikler
- Alt menüler: (menü yapısından görüldüğü kadarıyla)

### Hizmet
- Hizmet tanımları
- Hizmet listesi
- Alt menüler: (menü yapısından görüldüğü kadarıyla)

---

## Veritabanı Tabloları (İlişkiler)

### Personel Tablosu
- `id` (PK)
- `personel_kodu`
- `tc_kimlik_no`
- `adi`
- `soyadi`
- `kart_no`
- `departman_id` (FK)
- `grup_id` (FK)
- `ise_giris_tarihi`
- `isten_cikis_tarihi`
- `calisma_durumu` (Çalışan/Ayrılan)
- `calisma_plani_id` (FK)
- `durum` (Aktif/Pasif)
- `kayit_tarihi`

### Araç Tablosu
- `id` (PK)
- `plaka`
- `marka`
- `model`
- `model_yili`
- `arac_turu` (enum: Römork, Otomobil, Minibüs, Otobüs, Kamyonet, Kamyon, Çekici, Motosiklet, İş Makinesi, Tır)
- `arac_durumu` (Boşta/Kullanımda/Bakımda)
- `durum` (Aktif/Pasif)
- `bagli_oldugu_arac_id` (FK - self reference)
- `toplam_km`
- `belge_seri_no`
- `personel_id` (FK - hangi personel kullanıyor)
- `sube_id` (FK)

### İlişkili Tablolar
- `arac_bakim`: Bakım kayıtları
- `arac_ceza`: Trafik cezaları
- `arac_kaza`: Trafik kazaları
- `arac_sigorta`: Sigorta kayıtları
- `arac_muayene`: Muayene kayıtları
- `arac_mtv`: MTV ödemeleri
- `arac_giris_cikis`: Giriş/çıkış kayıtları
- `personel_evrak`: Personel evrakları
- `personel_gorusme`: Personel görüşmeleri

---

## UI/UX Özellikleri

1. **Detaylı Arama**: Her liste sayfasında gelişmiş filtreleme
2. **Excel/PDF Export**: Tüm listelerde export özelliği
3. **Yazdır**: Yazdırma desteği
4. **Sayfalama**: Sayfa başına kayıt sayısı seçimi (10, 30, 50, 100, 150, 300, 500)
5. **Hızlı Arama**: Tablo üzerinde hızlı arama
6. **Sütun Yönetimi**: Sütunları aç/kapat
7. **Görünüm Şablonları**: Farklı görünüm şablonları
8. **Çift Tıklama**: Kayıt açmak için çift tıklama
9. **Toplu İşlemler**: Seçili kayıtlar üzerinde toplu işlemler

---

## İncelenen Modüller Özeti

### ✅ Detaylı İncelenen Modüller:
1. **Pano (Dashboard)**: Widget'lar, özet bilgiler, not defteri
2. **Kursiyer Yönetimi**: Listesi, arama/filtreleme özellikleri
3. **Ders Programı**: Takvim görünümü
4. **Personel Yönetimi**: Personel Listesi detaylı incelendi
5. **Araç İşlemleri**: Araç Listesi detaylı incelendi
6. **Kasa Modülü**: Alt menü yapısı incelendi

### ⚠️ Menü Yapısından Görülen (Detaylı İncelenmeyen) Modüller:
1. **Cari / Firma**: Menü yapısı görüldü, detaylı sayfa incelenmedi
2. **Banka**: Menü yapısı görüldü, detaylı sayfa incelenmedi
3. **Fatura**: Menü yapısı görüldü, detaylı sayfa incelenmedi
4. **Raporlar**: Menü yapısı görüldü, detaylı sayfa incelenmedi
5. **Hizmet**: Menü yapısı görüldü, detaylı sayfa incelenmedi
6. **Tanımlar**: Menü yapısı görüldü, detaylı sayfa incelenmedi
7. **Yetkili**: Menü yapısı görüldü, detaylı sayfa incelenmedi

### 📋 Araç İşlemleri Alt Modülleri (Menüden Görüldü):
1. Araç Yeni Kayıt
2. Araç Listesi ✅ (Detaylı incelendi)
3. Araç G/Ç Listesi
4. Trafik Cezaları
5. Trafik Kazaları
6. Sigorta Listesi
7. Bakım Listesi
8. Muayene Listesi
9. MTV Ödeme Listesi

### 📋 Personel Alt Modülleri (Menüden Görüldü):
1. Personel Yeni Kayıt
2. Personel Listesi ✅ (Detaylı incelendi)
3. Görüşme Listesi
4. Evrak Listesi
5. Personel Grup İşlemleri

---

## Notlar

- Tüm modüller responsive tasarıma sahip
- Her modülde tutarlı UI/UX pattern'leri kullanılmış
- Export ve yazdırma özellikleri standart
- Filtreleme ve arama özellikleri gelişmiş
- Rol bazlı yetkilendirme mevcut
- **Not**: Demo uygulamanın tüm sayfaları detaylı incelenmedi, ancak menü yapısı ve temel modüller analiz edildi

---

## ÖNCELİKLİ EKLENMESİ GEREKEN ÖZELLİKLER

### Yüksek Öncelik:
1. ✅ **Kursiyer Ön Kayıt**: Görüşme kayıtları ve kesin kayıt aktarımı
2. ✅ **Kullanıcı Mesajları**: Kullanıcılar arası mesajlaşma sistemi
3. ✅ **Webcam İşlemleri**: Fotoğraf çekme ve MEBBİS aktarımı
4. ✅ **Araç Yakıt Takibi**: Araç yakıt tüketimi takibi
5. ✅ **Eksik Evrak Takibi**: Eksik evrakları otomatik tespit ve bildirim
6. ✅ **Kursiyer Doğum Günü**: Doğum günü hatırlatmaları
7. ✅ **Referans İşlemleri**: Kursiyer referans takibi
8. ✅ **Kurumsal Ders Programı**: Gerçek direksiyon eğitimleri takibi

### Orta Öncelik:
9. ✅ **E-Sınav İşlemleri**: Elektronik sınav sistemi
10. ✅ **Sertifika İşlemleri**: Sertifika yönetimi
11. ✅ **MEIS Entegrasyonu**: MEIS istatistik aktarımı
12. ✅ **Aylık Finans Tablosu**: Aylık finansal özet
13. ✅ **Gelişmiş Yedekleme**: 7 günlük zamanlanmış yedekleme

### Düşük Öncelik:
14. ✅ **SMS Abonelik İşlemleri**: SMS abonelik yönetimi
15. ✅ **Program Temaları**: Tema yönetimi
16. ✅ **Eğitim Videoları**: Yardım içerikleri

---

## TEKNİK FARKLILIKLAR

### Veritabanı:
- **Wenntec**: MS SQL Server (Merkezi Sunucu veya Local)
- **Bizim Proje**: Supabase PostgreSQL (Cloud-based)

### Mimari:
- **Wenntec**: Windows Desktop Application (muhtemelen .NET)
- **Bizim Proje**: Electron (macOS + Windows), React + Vite, Node.js + TypeScript

### Avantajlarımız:
- ✅ Cross-platform (macOS + Windows)
- ✅ Modern web teknolojileri
- ✅ Cloud-based veritabanı (Supabase)
- ✅ Real-time capabilities (Supabase)
- ✅ Modern UI/UX (React + Tailwind)

