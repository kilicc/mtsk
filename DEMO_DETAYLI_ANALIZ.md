# Demo Uygulama Detaylı Analiz - TÜM MENÜLER VE SAYFALAR

Bu dosya, https://uygulama.cizgisoft.com/ adresindeki demo uygulamanın tüm menüleri, alt menüleri, sayfaları ve işlevlerinin detaylı analizini içermektedir.

---

## ANA MENÜ YAPISI

### 1. Pano (Dashboard)
- Ana sayfa, widget'lar ve hızlı erişim linkleri

### 2. Kursiyer
**Alt Menüler:**
1. Kursiyer Yeni Kayıt
2. Kursiyer Listesi
3. Sınav Listesi
4. Sınav İşlemleri
5. Sınav Not Girişi
6. Toplu Mebbis Gönderimi
7. Bakiye Raporu
8. Detaylı Bakiye Raporu
9. Fatura Listesi
10. E-Kursiyer Listesi
11. E-Kursiyer Analiz
12. İstatistik
13. Dönem (MEİS) İstatistiği
14. Görüşme Listesi
15. Evrak Listesi
16. Fotoğraf Karşılaştırma Listesi
17. Kursiyer Grup (alt menü var)

### 3. Ders Programı
**Alt Menüler:**
1. Mebbis Ders Programı (alt menü var)
2. Kurumsal Ders Programı (alt menü var)
3. Diğer Ders Programı (alt menü var)

### 4. Cari / Firma
**Alt Menüler:**
1. Cari / Firma Yeni Kayıt
2. Cari / Firma Listesi
3. Görüşme Listesi
4. Cari / Firma Grup (alt menü var)

### 5. Personel
**Alt Menüler:**
1. Personel Yeni Kayıt
2. Personel Listesi
3. Görüşme Listesi
4. Evrak Listesi
5. Personel Grup İşlemleri (alt menü var)

### 6. Kasa
**Alt Menüler:**
1. Sanal Pos Tahsilat
2. Kasa Toplamları
3. Para Giriş/Çıkışı Ekle
4. Kasa Hareketleri
5. Kasalar Arası Transfer
6. Kasa Listesi
7. Kasa Yeni Kayıt
8. Kasa Grup (alt menü var)
9. Tahsilat Makbuzu Dizayn (Yazıcı)

### 7. Banka
**Alt Menüler:**
1. Banka Bakiyeleri
2. Para Giriş/Çıkışı Ekle
3. Banka Hareketleri
4. Bankalar Arası Transfer
5. Banka Listesi
6. Pos/Provizyon Raporu
7. Banka Hesap Listesi
8. Banka Yeni Kayıt
9. Banka / Grup (alt menü var)

### 8. Fatura
**Alt Menüler:**
1. Kesilen Tüm Faturalar
2. Yeni Satış Faturası Ekle
3. Yeni Alış Faturası Ekle
4. Satıştan İade Faturası
5. Alıştan İade Faturası
6. E-Fatura İşlemleri (alt menü var)
7. Otomatik Fatura Logları
8. Fatura Dizaynı (Yazıcı)
9. Fatura Grup (alt menü var)

### 9. Raporlar
**Alt Menüler:**
1. Genel Bakiye Raporu
2. Gelir / Gider Raporu
3. Genel Hareket Raporu
4. Vade Hareket Raporu

### 10. Hizmet
**Alt Menüler:**
1. Hizmet Yeni Kayıt
2. Hizmet Listesi
3. Hizmet Grup (alt menü var)

### 11. Araç İşlemleri
**Alt Menüler:**
1. Araç Yeni Kayıt
2. Araç Listesi
3. Araç G/Ç Listesi
4. Trafik Cezaları
5. Trafik Kazaları
6. Sigorta Listesi
7. Bakım Listesi
8. Muayene Listesi
9. MTV Ödeme Listesi

### 12. Tanımlar
**Alt Menüler:**
1. Dönem Şube Tanımlama
2. Sınav Tarihi Tanımlama

### 13. Yetkili
**Alt Menüler:**
1. Finansal Analiz
2. Gün Sonu Raporu
3. Gün Sonu Analizi
4. Program Tanımları
5. Entegrasyon
6. SMS Paneli (alt menü var)
7. SMS Şablonları (alt menü var)
8. Mail Şablonları (alt menü var)
9. Firma / Şube Kaydı
10. Sayaç Sistemi
11. Evrak Yönetimi
12. Kullanıcı (alt menü var)
13. Kursiyer Excel Transfer
14. Yedekleme
15. Ar-Ge Kaydı
16. IP Yetkilendirme (White List)
17. Ar-Ge Listesi

### 14. Yardım
**Alt Menüler:**
1. Bilgi Güvenliği
2. Online Eğitim
3. Sık Sorulan Sorular

### 15. Çıkış

---

## DETAYLI SAYFA ANALİZLERİ

### 1. KURSIYER MODÜLÜ

#### 1.1. Kursiyer Yeni Kayıt Sayfası

**Ana Form Alanları:**
- Fotoğraf yükleme (Belge Seçilmedi)
- Aday No
- TC No (TC Kimlik No ile arama butonu)
- N.C. Seri No
- Adı (*) - Zorunlu
- Soyadı (*) - Zorunlu
- Cep Tel. (Cep Telefonu)
- Mebbis Dönemi (Dropdown)
- Özel Dönemi (Dropdown + Yeni ekleme butonu)
- Kayıt Tarihi (17.11.2025 formatında)
- Mevcut Belge (Dropdown)
- İstenen Belge (Dropdown)
- Mebbis Ücreti (0,00 formatında)
- Kategori (Dropdown + Yeni ekleme)
- Alt Kategori (Dropdown + Yeni ekleme)
- Referans Grubu (Dropdown + Yeni ekleme)

**Genel Durum Göstergesi:**
- Genel Durum: İşlem Devam Ediyor
- Teorik: Sınav Aşamasında
- Uygulama: Teorik Bekleniyor
- Belge: Sınav Sürecinde
- Ödeme: Girilmedi

**Tab'lar (Hızlı Erişim Menüsü):**
1. **Hızlı Erişim** (#Tozelbilgiler)
2. **Evraklar** (#Tevrakbilgileri)
3. **Adres-İletişim** (#Tadresbilgileri)
4. **Ek Bilgi** (#Tekbilgiler2)
5. **Sınavlar** (#Tsinavbilgileri)
6. **E-Kursiyer** (#Tesinavbilgileri)
7. **Görüşme** (#Tgorusmeler)
8. **Hesaplar** (#ThesapIslemleri)
9. **Mebbis** (#Tmebbisislemleri)

**Alt Bölümler:**
- **Kursiyerin Diğer Kayıtları Tablosu:**
  - Kayıt Tarihi, Firma/Şube, Dönemi, Aday No, Mevcut Belge, İstenen Sertifika, Bakiye, İşlem
  - Uyarı: Diğer şubedeki kayıtlar sadece önizleme modunda açılabilir

- **Mevcut Sürücü Belge Bilgileri:**
  - Belge Tarihi / No
  - Belge Ver.İl (Belgenin Verildiği İl)
  - 2016 Ocak Öncesi (Checkbox)

- **Diğer Bilgiler:**
  - Cari Bağlantı (Firma Adı + Arama butonu)
  - Araç Kullanabiliyor (EVET/HAYIR checkbox)
  - Transfer Edilen Şube (Firma Adı)

- **Ders Programı Kurumsal Tablosu:**
  - #, Personel, Tarih, Saat, Durumu, E.Yeri, E.Türü, Araç

- **Genel Açıklama - Not:**
  - Büyük textarea alanı

- **Riskli Kursiyer (Kara Liste):**
  - EVET/HAYIR checkbox
  - Risk Notları (textarea, disabled)

- **Avukata Verildi:**
  - EVET/HAYIR checkbox
  - Verilme Tarihi (disabled)
  - Avukat (Dropdown, disabled)
  - Açıklama (textarea, disabled)

**Araç Çubuğu Butonları (Üst Toolbar):**
1. **Fotoğraf Butonu** (icon: ) - Kursiyer fotoğrafı yükleme/düzenleme
2. **Yazdır** (icon: ) - Sayfayı yazdırma
3. **Export** (icon: ) - Veri dışa aktarma
4. **Silme** (icon: ) - Kayıt silme
5. **Yeni** (icon: ) - Yeni kursiyer kaydı oluşturma
6. **Bul** (icon: ) - Kursiyer arama
7. **Kaydet** (icon: ) - Değişiklikleri kaydetme
8. **İptal** (icon: ) - Değişiklikleri iptal etme

**Form İçi Butonlar:**
- TC No yanında **Arama Butonu** (icon: ) - TC Kimlik No ile arama
- Özel Dönemi yanında **Yeni Ekleme Butonu** (icon: ) - Yeni dönem ekleme
- Kategori yanında **Yeni Ekleme Butonu** (icon: ) - Yeni kategori ekleme
- Alt Kategori yanında **Yeni Ekleme Butonu** (icon: ) - Yeni alt kategori ekleme
- Referans Grubu yanında **Yeni Ekleme Butonu** (icon: ) - Yeni referans grubu ekleme
- Cari Bağlantı yanında **Arama Butonu** (icon: ) - Firma arama

---

#### 1.2. Kursiyer Listesi Sayfası

**Filtreleme Sistemi (4 Tab):**
- **F-1 Tab:** Temel filtreler
- **F-2 Tab:** Ek filtreler
- **F-3 Tab:** Ek filtreler
- **S-1 Tab:** Sıralama filtreleri

**F-1 Tab Filtreleri:**
- Adı (Textbox)
- Soyadı (Textbox)
- TC Kimlik No (Textbox)
- Cep Telefonu (Textbox)
- Mevcut Belge (Dropdown - Tümü)
- İstediği Sertifika (Dropdown - Tümü)
- Aday No (İki değer arasında - Min/Max)
- Aday No Durumu (Dropdown: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- Genel Durum (Dropdown: Tümü, İşlem Devam Ediyor, Tamamlandı)
- Kategori (Dropdown - Tümü)
- Alt Kategori (Dropdown - Öncelikle Kategori Seçiniz)
- Kurs Özel Dönemi (Dropdown - Tümü)
- Referans Grubu (Listbox/Combobox)
- Dönem Seçimi (Dropdown: Hızlı Dönem Seçimi, Elle Dönem Seçimi, Seçilmemiş Olanlar, Seçilmiş Olanlar)
- Mebbis Dönemi (Button - Seçili Yok)
- Bakiye Türü (Dropdown: Tümü, Borç, Alacak, Sıfır)
- Bakiye Tutarı (İki değer arasında - Min/Max)
- Bakiyesi Olanları Göster (Checkbox)
- Aynı TC Olanları Göster (Checkbox)
- Bugün Doğum Günü Olanlar (Checkbox)

**Filtreleme Butonları:**
- **Seçilenleri Filtrele** (icon: ) - Seçili filtreleri uygula
- **Temizle** (icon: ) - Filtreleri temizle
- **Filtrele** (icon: ) - Filtreleri uygula

**Üst Toolbar Butonları:**
1. **Yeni Kayıt** (icon: ) - Yeni kursiyer kaydı oluştur
2. **SMS** (icon: ) - SMS gönder
3. **Toplu İşlem** (icon: ) - Toplu işlem menüsü (dropdown)
4. **Yazdır** (icon: ) - Yazdırma menüsü (dropdown)
5. **Filtre Sepeti** (icon: ) - Kayıtlı filtreleri göster
6. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Özellikleri:**
- **Sütunlar:** #, No, İşlem, Seçim, Kursiyer Durumu, Aday No, TC Kimlik No, Adı, Soyadı, Cep Telefonu, Mevcut Belge, İstediği Sertifika
- **Sayfalama:** Sayfada kayıt göster (10, 30, 50, 100, 150, 300)
- **Görünüm Şablonları** - Tablo görünüm şablonları
- **Sütunları Aç/Kapat** - Sütun görünürlüğü
- **Excel** - Excel'e aktar
- **PDF** - PDF'e aktar
- **Yazdır** - Yazdır

---

#### 1.3. Sınav Listesi Sayfası

**Sayfa Başlığı:**
- "Kursiyer Sınav Listesi (Kaydı açmak için çift tıklayınız.)"

**Filtreleme Sistemi:**
- Kursiyer Listesi ile aynı filtreleme sistemi (4 Tab: F-1, F-2, F-3, S-1)
- Aynı filtre alanları ve butonlar

**Üst Toolbar Butonları:**
1. **SMS** (icon: ) - SMS gönder
2. **Toplu İşlem** (icon: ) - Toplu işlem menüsü (dropdown)
3. **Yazdır** (icon: ) - Yazdırma menüsü (dropdown)
4. **Filtre Sepeti** (icon: ) - Kayıtlı filtreleri göster
5. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Özellikleri:**
- **Sütunlar:** No, İşlem, Seçim, Aday No, TC Kimlik No, Adı, Soyadı, Cep Telefonu, Mevcut Belge, İstediği Sertifika, **Teorik Sınav Notu**, **Teorik Sınav Drm.**, **Uygulama Sınav Drm.**
- **Özellik:** Kayıtları açmak için çift tıklama
- **Sayfalama:** Sayfada kayıt göster (10, 30, 50, 100, 150, 300)
- **Export:** Excel, PDF, Yazdır
- **Görünüm:** Görünüm Şablonları, Sütunları Aç/Kapat

---

#### 1.4. Toplu Mebbis Gönderimi Sayfası

**Sayfa Başlığı:**
- "Kursiyer Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Mebbis Dönemi** (Dropdown - Lütfen Dönem Seçiniz)
- **İstediği Sertifika** (Dropdown - Lütfen Sertifika Seçiniz, disabled)
- **Mebbis Gönderim** (Dropdown: Tümü, Gönderime Hazır, Eksikleri Var, Mebbis'e Gönderildi)
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Mevcut Belge** (Dropdown - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Dropdown: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Genel Durum** (Dropdown: Tümü, İşlem Devam Ediyor, Tamamlandı)
- **Kategori** (Dropdown - Tümü)
- **Alt Kategori** (Dropdown - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Dropdown - Tümü)
- **Sıralama** (Dropdown: Yok, Adı, Soyadı, Aday No, TC Kimlik No, İstediği Sertifika, Mevcut Belge, Mebbis Dönemi, Özel Dönemi, Kayıt Sırası)
- **Ters** (Checkbox) - Sıralamayı tersine çevir

**Filtreleme Butonları:**
- **Temizle** (icon: ) - Filtreleri temizle
- **Filtrele** (icon: ) - Filtreleri uygula

**Üst Toolbar Butonları:**
1. **Toplu Mebbis Gönderim** (icon: ) - Toplu MEBBİS gönderimi
2. **Mebbis Bağlantısını Temizle** (icon: ) - MEBBİS bağlantısını temizle
3. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Özellikleri:**
- **Sütunlar:** No, Adı, Soyadı, **Aday Kaydı**, **Fotoğraf Bilgisi**, **Öğrenim Bilgisi**, **Sağlık Bilgisi**, **Savcılık Kaydı**, **Aday İmzası**, **Sözleşme Kaydı**, **Aday Adres Beyanı**, Genel Durum
- **Özellik:** Kayıtları açmak için çift tıklama
- **Sayfalama:** Sayfada kayıt göster (10, 30, 50, 100, 150, 300)
- **Sayfa Navigasyonu:** İlk, Önceki, Sayfa (textbox), Sonraki, Son
- **Export:** Excel, PDF, Yazdır
- **Görünüm:** Görünüm Şablonları, Sütunları Aç/Kapat

#### 1.5. Sınav İşlemleri Sayfası

**Sayfa Başlığı:**
- "Kursiyer Sınav İşlemleri"

**Kursiyer Ekle Bölümü:**
- **Açıklama:** "Seçtiğiniz sınav tarihlerine toplu veya tekil olarak kursiyer ekleyebilirsiniz."
- **Kaynak/Sınav Türü:**
  - **Kaynak** (Combobox: Mebbisten Çek, Sistemden Çek)
  - **Sınav Türü** (Combobox: Seçiniz, Teorik, Uygulama)
- **Sınav Tarihi:**
  - **Sınav Tarihi** (Combobox - Disabled, "Sınav Türü Seçiniz.." - Sınav türü seçilene kadar disabled)
  - **Özel Tarih Girişi** (Buton) - Özel tarih girişi için

**Eklenen Kursiyerler Bölümü:**
- **Başlık:** "Eklenen Kursiyerler"
- **Kursiyer Ekle** (Buton - icon: ) - Yeni kursiyer ekleme
- **Tam Ekran** (icon: ) - Sayfayı tam ekran yap

**Dikkat Mesajı:**
- "Dikkat, girmiş olduğunuz sınav notları ve sinav durumları anlık olarak sisteme girilmektedir. Sınav not girişi için notu girdikten sonra **TAB tuşuna basmanız** veya **not girilen alanın dışında** bir yere tıklamanız yeterli olacaktır. Eğer bunu iptal etmek istiyorsanız sağ üstte bulunan **Otomatik Kaydet** tikini kaldırmanız yeterli olacaktır."

**Tablo Sütunları:**
- **Aday No** (Sıralanabilir - azalan/artan)
- **T.C No** (Sıralanabilir - azalan/artan)
- **Adı Soyadı** (Sıralanabilir - azalan/artan)
- **Dönemi** (Sıralanabilir - azalan/artan)
- **İstediği Sertifika** (Sıralanabilir - azalan/artan)
- **Sınav Notu** (Editable - Not girişi için)
- **Sınav Durumu** (Editable - Durum seçimi için)
- **Not Gir** (Buton - icon: ) - Not girişi için

**Özellikler:**
- Otomatik kaydet özelliği (sağ üstte checkbox ile açılıp kapatılabilir)
- TAB tuşu ile otomatik kaydetme
- Not girilen alanın dışına tıklayınca otomatik kaydetme

#### 1.6. Sınav Not Girişi Sayfası

**Sayfa Başlığı:**
- "Kursiyer Sınav İşlemleri"

**Farklılıklar (Sınav İşlemleri'nden):**
- **Başlık:** "Sınav Sonucu Ekle" (Sınav İşlemleri'nde "Kursiyer Ekle")
- **Açıklama:** "Sınav sonuçlarını toplu olarak girmenizi sağlar."
- **Üst Toolbar Butonları:**
  - **Sınavları Kayıt Et** (icon: ) - Disabled (veri yokken)
  - **Otomatik Kaydet** (Checkbox - Varsayılan olarak işaretli)
- **Eklenen Kursiyerler Bölümü:**
  - **Sonuçları Mebbis'ten Çek** (Buton - icon: ) - MEBBİS'ten sonuçları çekme
  - **Mebbis Bağlantısını Temizle** (Buton - icon: ) - MEBBİS bağlantısını temizleme

**Diğer Özellikler:**
- Sınav İşlemleri sayfası ile aynı tablo yapısı ve filtreleme sistemi
- Otomatik kaydet özelliği
- TAB tuşu ile otomatik kaydetme

#### 1.7. Bakiye Raporu Sayfası

**Sayfa Başlığı:**
- "Kursiyer Bakiye Listesi (Kaydı açmak için çift tıklayınız.)"

**Filtreleme Sistemi (4 Tab):**
- **F-1 Tab:** Temel filtreler
- **F-2 Tab:** Ek filtreler
- **F-3 Tab:** Ek filtreler
- **S-1 Tab:** Sıralama filtreleri

**F-1 Tab Filtreleri:**
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Cep Telefonu** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **İstediği Sertifika** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Genel Durum** (Combobox: Tümü, İşlem Devam Ediyor, Tamamlandı)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)
- **Referans Grubu** (Listbox/Combobox)
- **Dönem Seçimi** (Combobox: Hızlı Dönem Seçimi, Elle Dönem Seçimi, Seçilmemiş Olanlar, Seçilmiş Olanlar)
- **Mebbis Dönemi** (Buton - "Seçili Yok" - Dönem seçimi için)
- **İşlem Türü** (Combobox: Tümü, Kurs Ücreti, Teorik Sınav Ücreti, Uygulama Sınav Ücreti, Diğer)
- **Bakiye Türü** (Combobox: Tümü, Borç, Alacak, Sıfır)
- **Bakiye Tutarı** (İki değer arasında - Min/Max, "0,00" formatında)
- **Bakiyesi Olanları Göster** (Checkbox)
- **Aynı TC Olanları Göster** (Checkbox)
- **Bugün Doğum Günü Olanlar** (Checkbox)

**Filtreleme Butonları:**
- **Seçilenleri Filtrele** (icon: )
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **SMS** (icon: ) - SMS gönder
2. **Toplu İşlem** (icon: ) - Toplu işlem menüsü (dropdown)
3. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **İşlem**, **Seçim**, **Aday No**, **TC Kimlik No**, **Adı**, **Soyadı**, **Cep Telefonu**, **Borç**, **Alacak**, **Bakiye**, **Hesap Türü**, **Bakiye Türü**

**Alt Özet Tablosu:**
- **Hesap Türü**
- **Toplam Borç**
- **Toplam Alacak**
- **Bakiye Toplamı**
- **Durum**

**Export ve Görünüm:**
- **Sayfada kayıt göster** (10, 30, 50, 100, 150, 300, 500)
- **Görünüm Şablonları** (Dropdown)
- **Sütunları Aç/Kapat** (Dropdown)
- **Excel** (Buton)
- **PDF** (Buton)
- **Yazdır** (Buton)

#### 1.8. Detaylı Bakiye Raporu Sayfası

**Sayfa Başlığı:**
- "Kursiyer Listesi (Kaydı açmak için çift tıklayınız.)"

**Not:** Bu sayfa Bakiye Raporu sayfası ile aynı yapıya sahiptir. Filtreleme sistemi, tablo sütunları ve özellikler aynıdır. Tek fark, sayfa başlığı ve URL'de "detaylı" ifadesinin bulunmasıdır.

**Filtreleme Sistemi:**
- Bakiye Raporu sayfası ile aynı (4 Tab: F-1, F-2, F-3, S-1)
- Aynı filtre alanları ve butonlar

**Tablo Sütunları:**
- Bakiye Raporu sayfası ile aynı sütunlar
- Alt özet tablosu mevcut

**Üst Toolbar Butonları:**
- SMS, Toplu İşlem, Sayfa Kontrolleri

**Export ve Görünüm:**
- Excel, PDF, Yazdır
- Görünüm Şablonları, Sütunları Aç/Kapat

#### 1.9. Fatura Listesi Sayfası

**Sayfa Başlığı:**
- "Kursiyer Fatura Listesi (Kaydı açmak için çift tıklayınız.)"

**Filtreleme Sistemi (4 Tab):**
- **F-1 Tab:** Temel filtreler (Kursiyer Listesi ile benzer)
- **F-2 Tab:** Ek filtreler
- **F-3 Tab:** Ek filtreler
- **S-1 Tab:** Sıralama filtreleri

**F-1 Tab Filtreleri:**
- **Adı**, **Soyadı**, **TC Kimlik No**, **Cep Telefonu**
- **Mevcut Belge**, **İstediği Sertifika**
- **Aday No** (İki değer arasında)
- **Aday No Durumu** (Combobox)
- **Genel Durum** (Combobox)
- **Kategori**, **Alt Kategori**, **Kurs Özel Dönemi**
- **Referans Grubu** (Listbox/Combobox)
- **Dönem Seçimi** (Combobox)
- **Mebbis Dönemi** (Buton)
- **Bakiye Türü** (Combobox: Tümü, Borç, Alacak, Sıfır)
- **Bakiye Tutarı** (İki değer arasında)
- **Bakiyesi Olanları Göster** (Checkbox)
- **Aynı TC Olanları Göster** (Checkbox)
- **Bugün Doğum Günü Olanlar** (Checkbox)

**Filtreleme Butonları:**
- **Seçilenleri Filtrele** (icon: )
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **SMS** (icon: ) - SMS gönder
2. **Toplu İşlem** (icon: ) - Toplu işlem menüsü (dropdown)
3. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **Seçim**, **Aday No**, **TC Kimlik No**, **Adı**, **Soyadı**, **Mevcut Belge**, **İstediği Sertifika**, **Hesaplanan Fatura**, **Kesilen Fatura**, **Eksik Kalan Fatura**

**Export ve Görünüm:**
- **Sayfada kayıt göster** (10, 30, 50, 100, 150, 300)
- **Görünüm Şablonları** (Dropdown)
- **Sütunları Aç/Kapat** (Dropdown)
- **Excel** (Buton)
- **PDF** (Buton)
- **Yazdır** (Buton)

#### 1.10. E-Kursiyer Listesi Sayfası

**Sayfa Başlığı:**
- "E-Kursiyer Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Mebbis Dönemi** (Combobox - "Lütfen Dönem Seçiniz")
- **İstediği Sertifika** (Combobox - "Lütfen Sertifika Seçiniz")
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Genel Durum** (Combobox: Tümü, İşlem Devam Ediyor, Tamamlandı)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)
- **Sıralama** (Combobox: Yok, Adı, Soyadı, Aday No, TC Kimlik No, İstediği Sertifika, Mevcut Belge, Mebbis Dönemi, Özel Dönemi, Kayıt Sırası)
- **Ters** (Checkbox - Sıralama tersine çevirme)

**Filtreleme Butonları:**
- **Seçilenleri Filtrele** (icon: )
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **SMS** (icon: ) - SMS gönder
2. **E-Sınav MTSK - Toplu Kayıt** (icon: ) - E-Sınav MTSK toplu kayıt işlemi
3. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **İşlem**, **Seçim**, **Aday No**, **TC Kimlik No**, **Adı**, **Soyadı**, **Cep Telefonu**, **İstediği Sertifika**, **E-Kursiyer**, **E-Sınav MTSK**

**Export ve Görünüm:**
- **Sayfada kayıt göster** (10, 30, 50, 100, 150, 300)
- **Görünüm Şablonları** (Dropdown)
- **Sütunları Aç/Kapat** (Dropdown)
- **Excel** (Buton)
- **PDF** (Buton)
- **Yazdır** (Buton)

#### 1.11. İstatistik Sayfası

**Sayfa Başlığı:**
- "İstatistik Listesi (Kayıt Tarihine Göre)"

**Detaylı Arama Bölümü:**
- **İstatistik** (Combobox - İstatistik türü seçimi):
  - İstenen Sertifika (Varsayılan)
  - Cinsiyet
  - Dönemi
  - Kurs Özel Dönemi
  - Özel Grubu
  - Referans Grubu
  - Öğrenim durumu
  - Riskli Kursiyer
  - Avukata Verildi
  - Genel Kursiyer Durumu
  - Teorik Sınav Durumu
  - Uygulama Sınav Durumu
  - Belge Durumu
  - Ödeme Durumu
  - Kayıt Tarihi
  - Araç Kullanabiliyor
  - Kan Grubu
- **Kayıt Tarihi** (İki tarih arasında - Başlangıç/Bitiş)
- **Kurs Özel Dönemi** (Combobox - Tümü)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Referans Grubu** (Combobox - Tümü)
- **Dönem Seçimi** (Combobox: Hızlı Dönem Seçimi, Elle Dönem Seçimi, Seçilmemiş Olanlar, Seçilmiş Olanlar)
- **Mebbis Dönemi** (Buton - "Seçili Yok" - Dönem seçimi için)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Excel'e Aktar** (icon: ) - Excel'e dışa aktarma
2. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- İstatistik türüne göre değişir (örneğin: "İstenen Sertifika" seçildiğinde "İstenen Sertifika" ve "Adet" sütunları görünür)

**Özellikler:**
- İstatistik türü seçildikten sonra filtreleme yapılabilir
- Sonuçlar tablo formatında gösterilir
- Excel'e aktarılabilir

#### 1.12. Dönem (MEİS) İstatistiği Sayfası

**Sayfa Başlığı:**
- "Dönem (MEİS) İstatistiği Listesi"

**Detaylı Arama Bölümü:**
- **Dönem Başlama Yıl** (Combobox - 2024 seçili, 2010-2026 arası yıllar)
- **Dönem Başlama Ay** (Combobox - Eylül seçili, Ocak-Aralık arası aylar)
- **İstenilen Sertifika** (Combobox - Tümü, Muaf, M, M-Otomatik, A1, A1-Otomatik, A1-Yeni Nesil, A1-Yeni Nesil(Otomatik), A2, A2-Otomatik, A, A-Otomatik, B1, B1-Otomatik, B, B-Otomatik, B-Engelli, BE, BE-Otomatik, C1, C1-Otomatik, C1E, C1E-Otomatik, C, C-Otomatik, CE, CE-Otomatik, D1, D1-Otomatik, D1E, D1E-Otomatik, D, D-Otomatik, DE, DE-Otomatik, E, E-Otomatik, F, F-Otomatik, G, G-Otomatik, 100/CP)
- **Dönem Bitiş Yıl** (Combobox - 2025 seçili, 2010-2026 arası yıllar)
- **Dönem Bitiş Ay** (Combobox - Eylül seçili, Ocak-Aralık arası aylar)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Excel'e Aktar** (icon: ) - Excel'e dışa aktarma
2. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- Dönem bilgilerine göre istatistik verileri gösterilir

**Özellikler:**
- Dönem başlama ve bitiş tarihlerine göre filtreleme yapılabilir
- İstenilen sertifika türüne göre filtreleme yapılabilir
- Excel'e aktarılabilir

#### 1.13. Görüşme Listesi Sayfası

**Sayfa Başlığı:**
- "Görüşme Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Firma Adı** (Textbox)
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **Konu** (Textbox)
- **Etiket** (Combobox - Tümü)
- **İşlem Tarihi** (İki tarih arasında - Başlangıç/Bitiş)
- **Kontrol Tarihi** (İki tarih arasında - Başlangıç/Bitiş)
- **Kaydeden** (Combobox - Tümü, kullanıcı listesi)
- **Değiştiren** (Combobox - Tümü, kullanıcı listesi)
- **Kayıt Sayısı** (Combobox: 30, 50, 100, 150, 300)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Excel'e Aktar** (icon: ) - Excel'e dışa aktarma
2. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **Adı Soyadı**, **İşlem Tarihi**, **Kontrol Tarihi**, **Etiket**, **Konu**, **Görüşme Detayı**, **Kaydeden**, **Kayıt Tarihi**, **Değiştiren**, **Değiştirme Tarihi**

**Özellikler:**
- Çift tıklama ile kayıt detayı açılabilir
- Excel'e aktarılabilir
- Sayfalama mevcut

#### 1.14. Evrak Listesi Sayfası

**Sayfa Başlığı:**
- "Evrak Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Aday No** (Textbox)
- **Kurs Özel Dönemi** (Combobox - Tümü)
- **Referans Grubu** (Combobox - Tümü)
- **Dönem Seçimi** (Combobox: Hızlı Dönem Seçimi, Elle Dönem Seçimi, Seçilmemiş Olanlar, Seçilmiş Olanlar)
- **Mebbis Dönemi** (Buton - "Seçili Yok" - Dönem seçimi için)
- **Durumu** (Combobox: Tümü, Var (Tümü), Var (Yüklendi), Var (Yüklenmedi), Eksik)
- **Evrak Seçimi** (Multi-select - "Bazı Seçenekleri Seçin")
- **Genel Durum** (Combobox: Tümü, İşlem Devam Ediyor, Tamamlandı)
- **Kayıt Sayısı** (Combobox: 30, 50, 100, 150, 300)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Yazdır** (icon: ) - Yazdırma
2. **Excel'e Aktar** (icon: ) - Excel'e dışa aktarma
3. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **TC Kimlik No**, **Aday No**, **Adı**, **Soyadı**, **Biyometrik Fotoğraf**, **Kursiyer Webcam Fotoğrafı**, **Öğrenim Belgesi**, **Sağlık Raporu**, **Sabıka Kayıt Belgesi**, **İmza Örneği**, **Sözleşme Belgesi Ön**, **Sözleşme Belgesi Arka**

**Özellikler:**
- Çift tıklama ile kayıt detayı açılabilir
- Evrak durumlarına göre filtreleme yapılabilir
- Excel'e aktarılabilir
- Yazdırılabilir

#### 1.15. Fotoğraf Karşılaştırma Listesi Sayfası

**Sayfa Başlığı:**
- "Fotoğraf Karşılaştırma Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Cep Telefonu** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **İstediği Sertifika** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Genel Durum** (Combobox: Tümü, İşlem Devam Ediyor, Tamamlandı)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)
- **Referans Grubu** (Listbox/Combobox)
- **Dönem Seçimi** (Combobox: Hızlı Dönem Seçimi, Elle Dönem Seçimi, Seçilmemiş Olanlar, Seçilmiş Olanlar)
- **Mebbis Dönemi** (Buton - "Seçili Yok" - Dönem seçimi için)
- **Bakiye Türü** (Combobox: Tümü, Borç, Alacak, Sıfır)
- **Bakiye Tutarı** (İki değer arasında - Min/Max, "0,00" formatında)
- **Bakiyesi Olanları Göster** (Checkbox)
- **Aynı TC Olanları Göster** (Checkbox)
- **Bugün Doğum Günü Olanlar** (Checkbox)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Export ve Görünüm:**
- **Sayfada kayıt göster** (10, 30, 50, 100, 150, 300)
- **Görünüm Şablonları** (Dropdown)
- **Sütunları Aç/Kapat** (Dropdown)
- **Excel** (Buton)
- **PDF** (Buton)
- **Yazdır** (Buton)

**Tablo Sütunları:**
- **#**, **No**, **Aday No**, **TC Kimlik No**, **Adı**, **Soyadı**, **Adı Soyadı**, **Biyometrik Fotoğraf**, **Webcam Fotoğrafı**

**Özellikler:**
- Çift tıklama ile kayıt detayı açılabilir
- Biyometrik fotoğraf ve webcam fotoğrafı karşılaştırması yapılabilir
- Excel, PDF ve yazdırma seçenekleri mevcut

#### 1.15. E-Kursiyer Analiz Sayfası

**Sayfa Başlığı:**
- "Kursiyer E-Sınav Listesi (Kaydı açmak için çift tıklayınız.)"

**Filtreleme Sistemi (4 Tab):**
- **F-1 Tab:** Temel filtreler (E-Kursiyer Listesi ile benzer + ek sınav filtreleri)
- **F-2 Tab:** Ek filtreler
- **F-3 Tab:** Ek filtreler
- **S-1 Tab:** Sıralama filtreleri

**F-1 Tab Filtreleri:**
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Cep Telefonu** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **İstediği Sertifika** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Genel Durum** (Combobox: Tümü, İşlem Devam Ediyor, Tamamlandı)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)
- **Referans Grubu** (Listbox/Combobox)
- **Dönem Seçimi** (Combobox: Hızlı Dönem Seçimi, Elle Dönem Seçimi, Seçilmemiş Olanlar, Seçilmiş Olanlar)
- **Mebbis Dönemi** (Buton - "Seçili Yok" - Dönem seçimi için)
- **Bakiye Türü** (Combobox: Tümü, Borç, Alacak, Sıfır)
- **Bakiye Tutarı** (İki değer arasında - Min/Max, "0,00" formatında)
- **Bakiyesi Olanları Göster** (Checkbox)
- **Aynı TC Olanları Göster** (Checkbox)
- **Başarılı Sınav** (İki değer arasında - Min/Max)
- **Başarısız Sınav** (İki değer arasında - Min/Max)
- **Toplam Giriş** (İki değer arasında - Min/Max, "Sınav Giriş Sayısı")
- **Başarılı Oran** (İki değer arasında - Min/Max)
- **Başarısız Oran** (İki değer arasında - Min/Max)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **SMS** (icon: ) - SMS gönder
2. **Toplu İşlem** (icon: ) - Toplu işlem menüsü (dropdown)
3. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **İşlem**, **Seçim**, **TC Kimlik No**, **Adı**, **Soyadı**, **Cep Telefonu**, **Başarılı Sınav**, **Başarısız Sınav**, **Toplam Giriş**, **Başarılı Oran**, **Başarısız Oran**

**Export ve Görünüm:**
- **Sayfada kayıt göster** (10, 30, 50, 100, 150, 300, 500)
- **Görünüm Şablonları** (Dropdown)
- **Sütunları Aç/Kapat** (Dropdown)
- **Excel** (Buton)
- **PDF** (Buton)
- **Yazdır** (Buton)

**Özellikler:**
- E-Kursiyer sınav istatistiklerini analiz etmek için kullanılır
- Başarılı/başarısız sınav sayıları ve oranları gösterilir
- Toplam sınav giriş sayısı takip edilir
- Excel, PDF ve yazdırma seçenekleri mevcut

#### 1.16. Kursiyer Grup Alt Menüleri

**Alt Menüler:**
1. Kursiyer Grup Kaydı
2. Kursiyer Grup Listesi

**Not:** Bu sayfaların detayları Kursiyer Grup Kaydı ve Kursiyer Grup Listesi sayfaları açıldığında incelenecek.

---

## 2. DERS PROGRAMI MODÜLÜ

### 2.1. Mebbis Ders Programı Alt Menüleri
1. Teorik Ders Programı
2. Uygulama Ders Programı
3. Ders Programı Listesi
4. Ders Programı Analizi

#### 2.1.1. Teorik Ders Programı Sayfası

**Sayfa Başlığı:**
- "Teorik Ders Programı"

**Üst Toolbar Butonları:**
1. **Ders Programını Kaydet** (icon: ) - Disabled (Mebbis dönemi seçilene kadar)
2. **Ders Programını Yazdır** (icon: ) - Disabled
3. **Yoklama Çizelgesi Bastır** (icon: ) - Disabled
4. **Mebbise Ders Programını Gönder** (icon: ) - Disabled
5. **Mebbis Ders Programını Çek** (icon: ) - Disabled
6. **Tam Ekran** (icon: ) - Sayfayı tam ekran yap

**Filtreleme Bölümü:**
- **Mebbis Dönemi** (Dropdown - Seçiniz)
- **Grup Başlangıç Tarihi** (Textbox - Disabled, Mebbis dönemi seçilince aktif)
- **Görüntüle** (icon: ) - Ders programını görüntüle

**Ders Ekleme Paneli:**
- **Eğitim Türü** (Dropdown - Disabled):
  - Normal Eğitim (seçili)
  - Telafi Eğitim
- **Ders Türü** (Dropdown - Disabled):
  - Seçiniz
  - Trafik ve Çevre Bilgisi
  - İlk Yardım
  - Araç Tekniği
  - Trafik Adabı

**Ders Türü Özet Tablosu:**
- **Sütunlar:** Ders Türü, Toplam, Atanan, Kalan
- **Satırlar:**
  - Trafik ve Çevre Bilgisi (Toplam: 16, Atanan: 0, Kalan: 16)
  - İlk Yardım (Toplam: 8, Atanan: 0, Kalan: 8)
  - Araç Tekniği (Toplam: 6, Atanan: 0, Kalan: 6)
  - Trafik Adabı (Toplam: 4, Atanan: 0, Kalan: 4)

**Personel Atama Tablosu:**
- **Sütunlar:** Personel Adı, Haftada
- **Durum:** "Atama Yapılmadı" (henüz personel atanmamış)

**Uyarı Mesajı:**
- "Programı oluşturma işlemine başlamak/devam etmek için lütfen yukarıda yer alan mebbis dönemini seçip, 'Görüntüle' butonuna basınız."

#### 2.1.2. Uygulama Ders Programı Sayfası

**Sayfa Başlığı:**
- "Uygulama Ders Programı"

**Üst Toolbar Butonları:**
1. **Ders Programını Kaydet** (icon: ) - Disabled (Mebbis dönemi ve kursiyer seçilene kadar)
2. **Mebbise Ders Programını Gönder** (icon: ) - Disabled
3. **Mebbis Ders Programını Çek** (icon: ) - Disabled
4. **Tam Ekran** (icon: ) - Sayfayı tam ekran yap

**Filtreleme Bölümü:**
- **Mebbis Dönemi** (Dropdown - Seçiniz)
- **Kursiyer** (Dropdown - Disabled, "Mebbis Dönemi Seçiniz" - Mebbis dönemi seçilince aktif)
- **Prg.Bşl.Trh.** (Program Başlama Tarihi - Textbox - Disabled)
- **Görüntüle** (icon: ) - Ders programını görüntüle

**Ders Ekleme Paneli:**
- **Eğitim Türü** (Dropdown - Disabled):
  - Normal (seçili)
  - Telafi
  - 2.Dir.
  - Başarısız
- **Eğitim Alınan Yer** (Dropdown - Disabled):
  - Seçiniz
  - Eğitim Alanı
  - Simülator
  - Akan Trafik

**Ders Türü Özet Tablosu:**
- **Sütunlar:** Ders Türü, Toplam, Atanan, Kalan
- **Satırlar:**
  - Eğitim Alanı/Simülatör (Toplam: 2, Atanan: 0, Kalan: 2)
  - Akan Trafik (Toplam: 0, Atanan: 0, Kalan: 0)

**Personel Atama Tablosu:**
- **Sütunlar:** Personel Adı, Haftada
- **Durum:** "Atama Yapılmadı" (henüz personel atanmamış)

**Uyarı Mesajı:**
- "Programı oluşturma işlemine başlamak/devam etmek için lütfen yukarıda yer alan mebbis dönemini ve işlem yapmak istediğiniz kursiyeri seçip, 'Görüntüle' butonuna basınız."

#### 2.1.3. Ders Programı Listesi Sayfası

**Sayfa Başlığı:**
- "Ders Programı Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Genel Durum** (Combobox: İşlem Devam Ediyor, Tamamlandı)
- **Modül Seçimi** (Combobox: Teorik Ders Programı, Uygulama Ders Programı)
- **Mebbis Dönemi** (Combobox - Tümü)
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **İstediği Sertifika** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Yazdır** (icon: )
2. **Excel'e Aktar** (icon: )
3. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **İşlem**, **Seçim**, **TC Kimlik No**, **Adı**, **Soyadı**, **Mevcut Belge**, **İstediği Sertifika**, **Mebbis Dönemi**, **Özel Dönemi**, **Genel Durum**

**Özellikler:**
- Detaylı arama ve filtreleme seçenekleri
- Sonuçlar tablo formatında gösterilir
- Excel'e aktarılabilir
- Çift tıklama ile kayıt detayına gidilebilir

#### 2.1.4. Ders Programı Analizi Sayfası

**Sayfa Başlığı:**
- "Ders Programı Analizi"

**Detaylı Arama Bölümü:**
- **Genel Durum** (Combobox: İşlem Devam Ediyor, Tamamlandı)
- **Modül Seçimi** (Combobox: Teorik Ders Programı, Uygulama Ders Programı)
- **Mebbis Dönemi** (Combobox - Tümü)
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **İstediği Sertifika** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Excel'e Aktar** (icon: )
2. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **TC Kimlik No**, **Kursiyer Adı**, **Eğitim Türü**, **Ders Adı**, **Toplam Ders**

**Özellikler:**
- Ders programı analiz raporu
- Excel'e aktarılabilir
- Modül seçimine göre (Teorik/Uygulama) analiz yapılabilir

---

### 2.2. Kurumsal Ders Programı

**Alt Menüler:**
1. **Kurumsal Ders Programı** (Randevu Paneli)
2. **Kurumsal Ders Listesi**

#### 2.2.1. Kurumsal Ders Programı (Randevu Paneli) Sayfası

**Sayfa Başlığı:**
- "Kurumsal Ders Programı Randevu Paneli"

**Üst Toolbar Butonları:**
1. **Saat Şablonu Ekle** (icon: )
2. **Saat Şablonu Listesi** (icon: ) - Link

**Filtreleme Bölümü:**
- **Tarih Seç** (İki tarih arasında - Başlangıç/Bitiş)
- **Personel** (Combobox: Tümü, Aktif Personeller, Pasif Personeller)
- **Görüntüle** (icon: ) - Butonu

**Randevu Yönetimi Bölümü:**
- **Personel** (Combobox - Seçiniz)
- **Personel** (Combobox - Tümü)
- **Tarih Seç** (İki tarih arasında - Başlangıç/Bitiş)
- **Randevuları Toplu Sil** (icon: ) - Butonu

**Bilgilendirme Metni:**
- "Toplu kayıt : Randevu vermek istediğiniz personel / tarih / saat bölümüne tıklayınız ve açılan pencerede aşağıdaki işlemleri tamamlayınız."
- Seçenek-1: "Randevu tarihi" bölümünden çoklu tarih seçiniz.
- Seçenek-2: Tarih Seçimi bölümünden "Tarihler Arası" seçiniz ve açılan tarihlerden seçim yapınız.

**Takvim Tablosu:**
- **Sütun:** Saat
- **Satırlar:** Tarihler (18 Kasım 2025 - 18 Aralık 2025 arası)
- Her tarih satırı tıklanabilir (randevu ekleme için)

**Özellikler:**
- Randevu takvimi görünümü
- Personel bazlı randevu yönetimi
- Toplu randevu silme
- Saat şablonu yönetimi

#### 2.2.2. Kurumsal Ders Listesi Sayfası

**Sayfa Başlığı:**
- "Kurumsal Ders Programı Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Eğitim Tarihi** (İki tarih arasında - Başlangıç/Bitiş)
- **Ders Durumu** (Combobox: Tümü, Beklemede, Ders Yapıldı, Ders Yapılmadı, Gelmedi)
- **Personel** (Combobox - Tümü)
- **Araç** (Combobox - Tümü)
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **İstediği Sertifika** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Genel Durum** (Combobox: Tümü, İşlem Devam Ediyor, Tamamlandı)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)
- **Mebbis Dönemi** (Combobox - Tümü)

**Filtreleme Butonları:**
- **Seçilenleri Filtrele** (icon: )
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **Seçim**, **Eğitim Tarihi**, **Eğitim Saati**, **Ders Durumu**, **TC Kimlik No**, **Adı**, **Soyadı**, **Eğitim Yeri**, **Eğitim Türü**, **Araç**, **Personel**

**Export ve Görünüm:**
- **Sayfada kayıt göster** (10, 30, 50, 100, 150, 300)
- **Görünüm Şablonları** (Dropdown)
- **Sütunları Aç/Kapat** (Dropdown)
- **Excel** (Buton)
- **PDF** (Buton)
- **Yazdır** (Buton)

**Özellikler:**
- Detaylı arama ve filtreleme seçenekleri
- Sonuçlar tablo formatında gösterilir
- Excel'e aktarılabilir

---

### 2.3. Diğer Ders Programı

**Alt Menüler:**
1. **Teorik Ders Programı** (Diğer)
2. **Uygulama Ders Programı** (Diğer)
3. **Ders Programı Listesi** (Diğer)
4. **Ders Programı Analizi** (Diğer)

#### 2.3.1. Teorik Ders Programı (Diğer) Sayfası

**Sayfa Başlığı:**
- "Teorik Ders Programı"

**Üst Toolbar Butonları:**
1. **Ders Programını Kaydet** (icon: ) - Disabled (Mebbis dönemi seçilene kadar)
2. **Ders Programını Yazdır** (icon: ) - Disabled
3. **Yoklama Çizelgesi Bastır** (icon: ) - Disabled
4. **Mebbise Ders Programını Gönder** (icon: ) - Disabled
5. **Mebbis Ders Programını Çek** (icon: ) - Disabled
6. **Tam Ekran** (icon: ) - Sayfayı tam ekran yap

**Filtreleme Bölümü:**
- **Mebbis Dönemi** (Dropdown - Seçiniz)
- **Grup Bşl.Trh.** (Textbox - Disabled, Mebbis dönemi seçilince aktif)
- **Görüntüle** (Buton)

**Ders Ekleme Paneli:**
- **Eğitim Türü** (Combobox - Disabled, Normal Eğitim/Telafi Eğitim)
- **Ders Türü** (Combobox - Disabled, Seçiniz/Trafik ve Çevre Bilgisi/İlk Yardım/Araç Tekniği/Trafik Adabı)

**Tablo Yapısı:**
- **Ders Türü Özet Tablosu:** Ders Türü, Toplam, Atanan, Kalan
- **Personel Atama Tablosu:** Personel Adı, Haftada

**Uyarı Mesajı:**
- "Programı oluşturma işlemine başlamak/devam etmek için lütfen yukarıda yer alan mebbis dönemini seçip, 'Görüntüle' butonuna basınız."

**Özellikler:**
- Mebbis Ders Programı ile benzer yapıda
- "Diğer" kategorisinde ders programı yönetimi
- MEBBİS entegrasyonu

#### 2.3.2. Uygulama Ders Programı (Diğer) Sayfası

**Sayfa Başlığı:**
- "Uygulama Ders Programı"

**Üst Toolbar Butonları:**
1. **Ders Programını Kaydet** (icon: ) - Disabled (Mebbis dönemi ve kursiyer seçilene kadar)
2. **Tam Ekran** (icon: ) - Sayfayı tam ekran yap

**Filtreleme Bölümü:**
- **Mebbis Dönemi** (Dropdown - Seçiniz)
- **Kursiyer** (Dropdown - Disabled, "Mebbis Dönemi Seçiniz" - Mebbis dönemi seçilince aktif)
- **Prg.Bşl.Trh.** (Program Başlama Tarihi - Textbox, Disabled)
- **Görüntüle** (Buton)

**Ders Ekleme Paneli:**
- **Eğitim Türü** (Combobox - Disabled, Normal/Telafi/2.Dir./Başarısız)
- **Eğitim Alınan Yer** (Combobox - Disabled, Seçiniz/Eğitim Alanı/Simülator/Akan Trafik)

**Tablo Yapısı:**
- **Ders Türü Özet Tablosu:** Ders Türü (Eğitim Alanı/Simülatör, Akan Trafik), Toplam, Atanan, Kalan
- **Personel Atama Tablosu:** Personel Adı, Haftada

**Uyarı Mesajı:**
- "Programı oluşturma işlemine başlamak/devam etmek için lütfen yukarıda yer alan mebbis dönemini ve işlem yapmak istediğiniz kursiyeri seçip, 'Görüntüle' butonuna basınız."

**Özellikler:**
- Mebbis Ders Programı ile benzer yapıda
- "Diğer" kategorisinde uygulama ders programı yönetimi
- Kursiyer bazlı ders programı

#### 2.3.3. Ders Programı Listesi (Diğer) Sayfası

**Sayfa Başlığı:**
- "Ders Programı Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Modül Seçimi** (Combobox - Tümü, Teorik Ders Programı, Uygulama Ders Programı)
- **Eğitim Tarihi** (İki tarih arasında - Başlangıç/Bitiş)
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **İstediği Sertifika** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Genel Durum** (Combobox: Tümü, İşlem Devam Ediyor, Tamamlandı)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)
- **Mebbis Dönemi** (Combobox - Tümü)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**, **Seçim**, **Modül**, **Eğitim Tarihi**, **Eğitim Saati**, **TC Kimlik No**, **Adı**, **Soyadı**, **Cep Telefonu**, **Cep Telefonu-2**, **İş Telefonu**, **Ders Adı**, **Eğitim Türü**, **Eğitim Yeri**, **Personel**, **Mebbis Dönemi**, **Mevcut Belge**, **İstediği Sertifika**, **Belge Durumu**, **Ödeme Durumu**, **Genel Durumu**, **Eğitim Durumu**, **Kurs Özel Dönemi**, **Kategori**, **Alt Kategori**, **Referans Grubu**, **Boş Sütun-1**, **Boş Sütun-2**, **Boş Sütun-3**

**Export ve Görünüm:**
- **Sayfada kayıt göster** (10, 30, 50, 100, 150, 300)
- **Görünüm Şablonları** (Dropdown)
- **Sütunları Aç/Kapat** (Dropdown)
- **Excel** (Buton)
- **PDF** (Buton)
- **Yazdır** (Buton)

**Özellikler:**
- Detaylı arama ve filtreleme seçenekleri
- Modül seçimine göre (Teorik/Uygulama) filtreleme
- Sonuçlar tablo formatında gösterilir
- Excel'e aktarılabilir

#### 2.3.4. Ders Programı Analizi (Diğer) Sayfası

**Sayfa Başlığı:**
- "Ders Programı Analizi"

**Detaylı Arama Bölümü:**
- **Genel Durum** (Combobox - İşlem Devam Ediyor, Tamamlandı)
- **Modül Seçimi** (Combobox - Teorik Ders Programı, Uygulama Ders Programı)
- **Mebbis Dönemi** (Combobox - Tümü)
- **Adı** (Textbox)
- **Soyadı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Mevcut Belge** (Combobox - Tümü)
- **İstediği Sertifika** (Combobox - Tümü)
- **Aday No** (İki değer arasında - Min/Max)
- **Aday No Durumu** (Combobox: Tümü, Aday No Olmayanları Getir, Aday No Olanları Getir)
- **Kategori** (Combobox - Tümü)
- **Alt Kategori** (Combobox - Öncelikle Kategori Seçiniz)
- **Kurs Özel Dönemi** (Combobox - Tümü)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
1. **Excel'e Aktar** (icon: )
2. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **TC Kimlik No**, **Kursiyer Adı**, **Eğitim Türü**, **Ders Adı**, **Toplam Ders**

**Özellikler:**
- Ders programı analiz raporu
- Excel'e aktarılabilir
- Modül seçimine göre (Teorik/Uygulama) analiz yapılabilir
- "Diğer" kategorisinde ders programı analizi

---

## 3. CARİ / FİRMA MODÜLÜ

### 3.1. Cari / Firma Alt Menüleri
1. Cari / Firma Yeni Kayıt
2. Cari / Firma Listesi
3. Görüşme Listesi
4. Cari / Firma Grup (alt menü var)

#### 3.1.1. Cari / Firma Yeni Kayıt Sayfası

**Sayfa Başlığı:**
- "Cari İşlemleri"

**Tab Yapısı (7 Tab):**
1. **Cari Bilgileri** (#Tcari)
2. **Hesap Bilgileri** (#Thesapbilgileri)
3. **İletişim Bilgileri** (#TiletisimBilgileri)
4. **Görüşmeler** (#Tgorusmeler)
5. **Hesap Hareketleri** (#ThesapIslemleri)
6. **Bakiyeler** (#Tbakiyeler)
7. **Galeri** (#Tgaleri)

**Üst Toolbar Butonları:**
1. **Fotoğraf** (icon: ) - Cari fotoğrafı yükleme/düzenleme
2. **Export** (icon: ) - Veri dışa aktarma
3. **Silme** (icon: ) - Kayıt silme
4. **Yeni** (icon: ) - Yeni cari kaydı oluşturma
5. **Bul** (icon: ) - Cari arama
6. **Kaydet** (icon: ) - Değişiklikleri kaydetme
7. **İptal** (icon: ) - Değişiklikleri iptal etme

**Cari Bilgileri Tab - Form Alanları:**
- **Cari Adı** (Link - Cari adı gösterimi)
- **Durumu** (Dropdown: Aktif, Pasif)

**Kişi Bilgileri Bölümü:**
- **Cari Türü** (Radio Button):
  - Bireysel
  - Kurumsal (varsayılan)
- **Cari Kodu** (Textbox - "Kart Kodu (Boş bırakılırsa otomatik kod verilir)") + Arama butonu (icon: )
- **Firma Adı** (*) (Textbox - Zorunlu)
- **Adı** (*) (Textbox - Zorunlu)
- **Soyadı** (*) (Textbox - Zorunlu)
- **Vergi Dairesi** (Textbox)
- **Vergi / TC Kimlik No** (Textbox)
- **Adres** (Textbox)
- **İlçe** (Textbox)
- **Şehir** (Dropdown - 81 il seçeneği: "Şehir Seçiniz", Adana, Adıyaman, ... Zonguldak)
- **Cep Telefonu** (Combobox: "+90" + Textbox)
- **Açıklama** (Textbox)
- **E-Mail** (Textbox - "E-Posta Adresi") + Arama butonu (icon: )

**Grup Bilgileri Bölümü:**
- **Grubu** (Dropdown - "Seçiniz") + **Kayıt Ekle** butonu (icon: )
- **Ara Grubu** (Dropdown - "Seçiniz") + **Kayıt Ekle** butonu (icon: )

**Not:** Diğer tab'lar (Hesap Bilgileri, İletişim Bilgileri, Görüşmeler, Hesap Hareketleri, Bakiyeler, Galeri) detayları sayfa açıldığında incelenecek.

#### 3.1.2. Cari / Firma Listesi Sayfası

**Sayfa Başlığı:**
- "Cari Kartlar Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Firma Kodu** (Textbox)
- **Firma Adı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Adı** (Textbox - "Yetkili Adı")
- **Soyadı** (Textbox - "Yetkili Soyadı")
- **Avukata Verildi** (Dropdown: Tümü, Evet, Hayır)
- **Grubu** (Dropdown - "Cari Grubu", Tümü)
- **Riskli Müşteri** (Dropdown: Tümü, Evet, Hayır)
- **Durumu** (Dropdown: Tümü, Aktif, Pasif)

**Filtreleme Butonları:**
- **Seçilenleri Filtrele** (icon: ) - Seçili kayıtları filtrele
- **Temizle** (icon: ) - Filtreleri temizle
- **Filtrele** (icon: ) - Filtreleri uygula

**Üst Toolbar Butonları:**
1. **Sayfa Kontrolleri** (icon: , , ) - İlk, Önceki, Sonraki, Son sayfa navigasyonu
2. **Yeni Kayıt Ekle** (icon: ) - Yeni cari kaydı ekleme
3. **SMS Gönder** (icon: ) - Seçili carilere SMS gönderme

**Tablo Özellikleri:**
- **Sütunlar:** No, İşlem, Seçim, Firma Kodu, Firma Adı, Vergi Numarası, Adı, Soyadı, Kayıt Tarihi, Durumu
- **Özellik:** Kayıtları açmak için çift tıklama
- **Sayfalama:** Sayfada kayıt göster (10, 30, 50, 100, 150, 300, 500)
- **Hızlı Ara:** Arama kutusu (tablo içinde hızlı arama)
- **Export:** Excel, PDF, Yazdır
- **Görünüm:** Görünüm Şablonları, Sütunları Aç/Kapat

---

## 4. PERSONEL MODÜLÜ

### 4.1. Personel Alt Menüleri
1. Personel Yeni Kayıt
2. Personel Listesi
3. Görüşme Listesi
4. Evrak Listesi
5. Personel Grup İşlemleri (alt menü var)

#### 4.1.1. Personel Yeni Kayıt Sayfası

**Sayfa Başlığı:**
- "Personel Yeni Kayıt"

**Üst Toolbar Butonları:**
1. **Fotoğraf** (icon: ) - Personel fotoğrafı yükleme/düzenleme
2. **Export** (icon: ) - Veri dışa aktarma
3. **Silme** (icon: ) - Kayıt silme
4. **Yeni** (icon: ) - Yeni personel kaydı oluşturma
5. **Bul** (icon: ) - Personel arama
6. **Kaydet** (icon: ) - Değişiklikleri kaydetme
7. **İptal** (icon: ) - Değişiklikleri iptal etme

**Üst Form Alanları:**
- **Personel Kodu** (Textbox - "Personel Kodu (Boş ise otomatik verilir)") + Arama butonu (icon: )
- **SGK Numarası** (Textbox)
- **Kayıt Tarihi** (Textbox - format: 17.11.2025)
- **Kart No** (Textbox - "Kart Numarası")
- **Personel Grubu** (Dropdown - "Seçiniz") + Yeni ekleme butonu (icon: )
- **Çalışma Planı** (Dropdown - "Seçiniz")
- **Durumu** (Dropdown: Aktif, Pasif)

**Tab Yapısı (10 Tab):**
1. **Hızlı Erişim** (#Tozelbilgiler)
2. **Adres Bilgisi** (#Tadresbilgileri)
3. **Aile Bilgisi** (#Tailebilgileri)
4. **Evrak Takip** (#Tevraktakip)
5. **Ücret Bilgisi** (#Tucretbilgi)
6. **Zimmet Takip** (#Tzimmetbilgileri)
7. **İzin Takip** (#Tizintakip)
8. **Görüşmeler** (#Tgorusmeler)
9. **Hesap İşlemleri** (#ThesapIslemleri)
10. **Galeri** (#Tgaleri)

**Personel Bilgileri Bölümü:**
- **TC Kimlik No** (Textbox)
- **Adı** (*) (Textbox - Zorunlu, placeholder: "Adı")
- **Soyadı** (*) (Textbox - Zorunlu, placeholder: "Soyadı")
- **Cep Telefonu-1** (Textbox - placeholder: "Cep Telefonu - 1")
- **Cep Telefonu-2** (Textbox - placeholder: "Cep Telefonu - 2")
- **E-Posta Adresi** (Textbox - placeholder: "E-Posta Adresi (Online İşlemlerde Kullanıcı Adı Yerine Kullanılır)") + Arama butonu (icon: )

**Çalışma Bilgileri Bölümü:**
- **Giriş / Çıkış Tarihi:**
  - İşe Giriş Tarihi (Textbox)
  - İşten Çıkış Tarihi (Textbox)
- **İstihdam Durumu** (Dropdown: Seçiniz, Daimi, Mevsimlik, Geçici, Full-Time, Part-Time, Stajyer)
- **Sözleşme Tipi** (Dropdown: Seçiniz, Belirsiz Süreli İş Sözleşmesi, Belirli Süreli İş Sözleşmesi, Tam Süreli İş Sözleşmesi, Kısmi Süreli İş Sözleşmesi, Deneme Süreli İş Sözleşmesi)
- **Statü** (Dropdown: Seçiniz, Kadrolu, Ders Saat Ücretli, Diğer Personel)
- **Haftalık Ders Saati** (Textbox)
- **Görevi** (Combobox/Listbox - "Görevini Seçiniz...")
- **Branşı** (Combobox/Listbox - "Branşını Seçiniz...")
- **Belge Türleri** (Combobox/Listbox - "Belge Türünü Seçiniz...")
- **Mebbis İzin No** (Textbox)
- **Kurumsal Ders** (Checkbox - EVET/HAYIR) + Kullanıcı seçimi (Dropdown - "Kullanıcı Seçiniz", "(Aktif) - yücel kılıç")

**Diğer İletişim Bilgileri Bölümü:**
- **Ev Telefonu** (Textbox)
- **Acil Erişim Tlf. - 1** (Textbox - placeholder: "Acil Erişim Telefonu - 1")
- **Acil Erişim Tlf. - 2** (Textbox - placeholder: "Acil Erişim Telefonu - 2")

**Diğer Bilgiler Bölümü:**
- **Askerlik** (Dropdown: Seçiniz, Yaptı, Tecilli, Muaf, Yükümsüz)
- **Ehliyet Durumu** (Dropdown: Seçiniz, Var (Tecrübeli), Var (Tecrübe Yok), Yok)
- **Belge No / Ver.Yer:**
  - Belge No (Textbox - placeholder: "Belge No")
  - Verildiği Yer (Textbox)

**Kimlik Bilgileri Bölümü:**
- **Anne Adı** (Textbox - placeholder: "Anne Adı")
- **Baba Adı** (Textbox - placeholder: "Baba Adı")
- **D.Tarihi** (Textbox - placeholder: "Doğum Tarihi")
- **D.Yeri** (Textbox - placeholder: "Doğum Yeri")
- **Cinsiyeti** (Dropdown: Seçiniz, Kadın, Erkek, Seçilmemiş)
- **Medeni Hali** (Dropdown: Seçiniz, Bekar, Evli, Dul)
- **Kan Grubu** (Dropdown: Seçiniz, AB Rh(+), AB Rh(-), A Rh(+), A Rh(-), B Rh(+), B Rh(-), 0 Rh(+), 0 Rh(-))
- **Uyruğu** (Combobox - "Türkiye" varsayılan)
- **Seri No** (Textbox)
- **Verildiği Yer** (Textbox)
- **Veriliş Tarihi** (Textbox)
- **Gçr.Tarihi** (Textbox - placeholder: "Geçerlilik Tarihi")

**Banka Bilgileri Bölümü:**
- **Banka** (Dropdown - 25+ banka seçeneği: Seçiniz, Adabank, Akbank, Albaraka Türk, Alternatif Bank, Anadolubank, Burgan Bank, Citibank, DenizBank, Fibabanka, Garanti BBVA, HSBC, Halkbank, ICBC Turkey Bank, ING Bank, Kuveyt Türk, Odeabank, Şekerbank, Türk Ekonomi Bankası (TEB), Türkiye Finans, Türkiye İş Bankası, VakıfBank, Yapı Kredi Bankası, Ziraat Bankası, QNB Finansbank)
- **IBAN** (Textbox)

**Not:** Diğer tab'lar (Adres Bilgisi, Aile Bilgisi, Evrak Takip, Ücret Bilgisi, Zimmet Takip, İzin Takip, Görüşmeler, Hesap İşlemleri, Galeri) detayları sayfa açıldığında incelenecek.

---

## 5. KASA MODÜLÜ

### 5.1. Kasa Alt Menüleri
1. Sanal Pos Tahsilat
2. Kasa Toplamları
3. Para Giriş/Çıkışı Ekle
4. Kasa Hareketleri
5. Kasalar Arası Transfer
6. Kasa Listesi
7. Kasa Yeni Kayıt
8. Kasa Grup (alt menü var)
9. Tahsilat Makbuzu Dizayn (Yazıcı)

#### 5.1.1. Sanal Pos Tahsilat Sayfası

**Sayfa Başlığı:**
- "Sanal Pos - Tahsilat İşlemi"

**Uyarı Mesajı:**
- Sanal Pos Paytr entegrasyon bilgilerini girmek gerekiyor
- Entegrasyon bilgilerini girdikten sonra bu bölümden ödeme alınabilir
- Entegrasyon bilgilerini almak için paytr.com üzerinden ücretsiz sanal pos başvurusunda bulunmak gerekiyor

**Form Alanları:**
- **Kursiyer / Cari Adı Soyadı** (Textbox - Aktif)
- **E-Posta Adresi** (Textbox)
- **İşlem Tutarı** (Textbox)
- **İşlem Butonu:** "Ödeme Linki Al" (Disabled - Form doldurulana kadar)

**Sonuç Bölümü:**
- **QR Kod Görüntüsü** (img)
- **Ödeme Linki** (Text - "-" varsayılan)
- **Geçerlilik Tarihi** (Text - "-" varsayılan)
- **Paylaş** (Text - "-" varsayılan)

**Bilgi Notu:**
- Bilgileri doldurduktan sonra ödeme linkini ve QR kodu aşağıda görebilirsiniz

#### 5.1.2. Kasa Toplamları Sayfası

**Sayfa Başlığı:**
- "Kasa Hareket Listesi"

**Üst Toolbar Butonları:**
- **Export** (icon: ) - Veri dışa aktarma
- **Yazdır** (icon: ) - Yazdırma
- **Filtre** (icon: ) - Filtreleme
- **Temizle** (icon: ) - Filtreleri temizleme
- **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **Kasa Adı**
- **Toplam Gelir**
- **Toplam Gider**
- **Kasa Toplamı**
- **Hesap Türü**

**Not:** Tablo verileri yüklendikten sonra görüntülenir.

---

## 6. BANKA MODÜLÜ

### 6.1. Banka Alt Menüleri
1. Banka Bakiyeleri
2. Para Giriş/Çıkışı Ekle
3. Banka Hareketleri
4. Bankalar Arası Transfer
5. Banka Listesi
6. Pos/Provizyon Raporu
7. Banka Hesap Listesi
8. Banka Yeni Kayıt
9. Banka / Grup (alt menü var)

#### 6.1.1. Banka Bakiyeleri Sayfası

**Sayfa Başlığı:**
- "Banka Bakiye Listesi (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Banka** (Combobox - "Banka Adı", Tümü seçili)
- **Şube Adı** (Textbox)
- **Hesap No** (Textbox - "Hesap Numarası")
- **Grubu** (Combobox - Tümü seçili)
- **İşlem Tarihi** (İki tarih arasında - Başlangıç/Bitiş)
- **Bakiye Türü** (Combobox: Tümü, Borç, Alacak, Sıfır)
- **Bakiye Tutarı** (İki değer arasında - Min/Max, "0,00" formatında)
- **Açıklama** (Textbox)
- **Bakiyesi Olanları Göster** (Checkbox)
- **Kayıt Sayısı** (Combobox - "Sayfa Başına Kayıt Sayısı": 30, 50, 100, 150, 300)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
- **Yazdır** (icon: )
- **Kartını Aç** (icon: )
- **Excel'e Aktar** (icon: )
- **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**
- **Banka Adı**
- **Şube Adı**
- **Şube Kodu**
- **Hesap No**
- **Para Girişi**
- **Para Çıkışı**
- **Bakiye**
- **Hesap Türü**

**Sayfalama:**
- Sayfa Sayısı ve Kayıt Sayısı gösterimi

---

## 7. FATURA MODÜLÜ

### 7.1. Fatura Alt Menüleri
1. Kesilen Tüm Faturalar
2. Yeni Satış Faturası Ekle
3. Yeni Alış Faturası Ekle
4. Satıştan İade Faturası
5. Alıştan İade Faturası
6. E-Fatura İşlemleri (alt menü var)
7. Otomatik Fatura Logları
8. Fatura Dizaynı (Yazıcı)
9. Fatura Grup (alt menü var)

#### 7.1.1. Kesilen Tüm Faturalar Sayfası

**Sayfa Başlığı:**
- "Fatura Raporu (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Firma Adı** (Textbox)
- **Yetkili Adı** (Textbox)
- **Yetkili Soyadı** (Textbox)
- **Vergi No** (Textbox)
- **Fatura Tipi** (Combobox: Tümü, Satış Faturası, Alış Faturası)
- **Fatura No** (İki değer arasında - Min/Max)
- **Fatura Tarihi** (İki tarih arasında - Başlangıç/Bitiş)
- **Fatura Saati** (İki saat arasında - Başlangıç/Bitiş)
- **Grubu** (Combobox - Tümü)
- **F.İptal** (Combobox - "Fatura İptal": Tümü, Evet, Hayır)
- **Yazdırıldı** (Combobox: Tümü, Evet, Hayır)
- **Resmileştirildi** (Combobox: Tümü, Evet, Hayır)
- **Kayıt Tipi** (Combobox: Tümü, Kursiyer, Personel, Cari)
- **Sıralama** (Combobox: -- Yok --, Fatura No, Fatura Tarihi) + **Ters** (Checkbox)

**Filtreleme Butonları:**
- **Seçilenleri Filtrele** (icon: )
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
- **Sayfa Kontrolleri** (icon: , , ) - Sayfa navigasyonu
- **Tahsilat Ekle** (icon: )
- **Yeni Satış Faturası** (Buton)
- **Yeni Alış Faturası** (Buton)
- **Fatura Birleştir** (icon: )
- **Toplu E-Fatura İşlemi** (icon: )

**Tablo Kontrolleri:**
- **Sayfada kayıt göster** (Combobox: 10, 30, 50, 100, 150, 300)
- **Görünüm Şablonları▼** (Buton)
- **Sütunları Aç/Kapat▼** (Buton)
- **Excel** (Buton)
- **PDF** (Buton)
- **Yazdır** (Buton)
- **Hızlı Ara** (Searchbox)

**Tablo Sütunları:**
- **No**
- **Seçim**
- **Fatura Tipi**
- **Fatura No**
- **Tarihi - Saati**
- **Firma Adı**
- **Vergi/TC Kimlik No**
- **Yetkili**
- **Ara Toplam**
- **Kdv**
- **Genel Toplam**
- **İptal**
- **Yazdırıldı**
- **E-Fatura Durumu**

**Özet Tablosu:**
- **Toplam Satış Faturası**
- **Toplam Alış Faturası**
- **Toplam Satış - Alış Fark**

---

## 8. RAPORLAR MODÜLÜ

### 8.1. Raporlar Alt Menüleri
1. Genel Bakiye Raporu
2. Gelir / Gider Raporu
3. Genel Hareket Raporu
4. Vade Hareket Raporu

#### 8.1.1. Genel Bakiye Raporu Sayfası

**Sayfa Başlığı:**
- "Bakiye Raporu (Kaydı açmak için çift tıklayınız.)"

**Detaylı Arama Bölümü:**
- **Adı** (Textbox - Aktif)
- **Soyadı** (Textbox)
- **Firma Adı** (Textbox)
- **TC Kimlik No** (Textbox)
- **Bakiye Türü** (Combobox: Tümü, Borç, Alacak, Sıfır)
- **Bakiye Tutarı** (İki değer arasında - Min/Max, "0,00" formatında)
- **Bakiyesi Olanları Göster** (Checkbox - Varsayılan olarak işaretli)
- **Kayıt Tipi** (Combobox: Tümü, Kursiyer, Cari, Personel)
- **Avukata Verildi** (Combobox: Tümü, Evet, Hayır)
- **Kayıt Sayısı** (Combobox - "Sayfa Başına Kayıt Sayısı": 30, 50, 100, 150, 300)

**Filtreleme Butonları:**
- **Temizle** (icon: )
- **Filtrele** (icon: )

**Üst Toolbar Butonları:**
- **Yazdır** (icon: )
- **Kartını Aç** (icon: )
- **Excel'e Aktar** (icon: )
- **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Tablo Sütunları:**
- **No**
- **İşlem**
- **Firma Adı**
- **Vergi No / TC Kimlik No**
- **Adı**
- **Soyadı**
- **Cep Telefonu**
- **Borç**
- **Alacak**
- **Bakiye**
- **Hesap Türü**
- **Bakiye Türü**

**Özet Tablosu:**
- **Toplam Borç**
- **Toplam Alacak**
- **Toplam Bakiye**
- **Hesap Türü**
- **Durum**

---

## 9. HİZMET MODÜLÜ

### 9.1. Hizmet Alt Menüleri
1. Hizmet Yeni Kayıt
2. Hizmet Listesi
3. Hizmet Grup (alt menü var)

#### 9.1.1. Hizmet Yeni Kayıt Sayfası

**Sayfa Başlığı:**
- "Hizmet İşlemleri"

**Tab Yapısı:**
- **Hizmet Bilgileri** (#Tstok)

**Üst Toolbar Butonları:**
1. **Export** (icon: ) - Veri dışa aktarma
2. **Silme** (icon: ) - Kayıt silme
3. **Yeni** (icon: ) - Yeni hizmet kaydı oluşturma
4. **Bul** (icon: ) - Hizmet arama
5. **Kaydet** (icon: ) - Değişiklikleri kaydetme
6. **İptal** (icon: ) - Değişiklikleri iptal etme

**Form Alanları:**

**Genel Bilgiler:**
- **Hizmet Kodu** (Textbox - "Hizmet Kodu (Boş bırakılırsa otomatik kod verilir)") + **Ara** butonu (icon: )
- **Özel Kodu** (Textbox)
- **Hizmet Adı** (Textbox)
- **Fiyatı** (Textbox - "Hizmet Fiyatı")

**Varsayılan Ayarlar:**
- **KDV Alış (%)** (Textbox - "KDV (%) Oranı")
- **KDV Satış (%)** (Textbox - "KDV (%) Oranı")

**Grup Bilgileri:**
- **Grubu** (Combobox - "Seçiniz") + **Kayıt Ekle** butonu (icon: )
- **Ara Grubu** (Combobox - "Seçiniz") + **Kayıt Ekle** butonu (icon: )

**Fotoğraf Yükleme:**
- Fotoğraf yükleme alanı (Drag & Drop veya dosya seçimi)
- "Dosyaları buraya bırakın veya seçim yapmak için tıklayın"

---

## 10. DASHBOARD (PANO) KISA YOLLARI VE WIDGET'LARI

### 10.1. Dashboard Kare Kısayolları

Dashboard ana sayfasında bulunan kare kısayollar (hızlı erişim linkleri):

#### 10.1.1. Dönem Şube

**Sayfa Başlığı:**
- "Dönem Şube Tanımlama"

**Üst Toolbar Butonları:**
1. **Temizle** (icon: )
2. **Yeni** (icon: )
3. **Vazgeç** (icon: )
4. **Kaydet** (icon: )
5. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Form Alanları:**
- **Kurs Tipi** (Combobox - MTSK seçili, disabled)
- **Dönemi** (İki combobox - Yıl ve Ay seçimi)
  - Yıl: 2010-2026 arası
  - Ay: Ocak-Aralık arası
- **Grup Adı** (Combobox - Seçiniz, Grup 1, Grup 2, Grup 3)
- **Şube Adı** (Combobox - Seçiniz, A-H Şubeleri)
- **Grup Başlangıç Tarihi** (Textbox - Tarih seçimi)
- **Özel Kodu** (Textbox)

**Liste Bölümü:**
- **Başlık:** "Dönem Şube Kayıt Listesi"
- **Yeni Dönem Şube Ekle** butonu (icon: , )
- **Sayfada kayıt göster** (Combobox: 10, 25, 50, 100)
- **Ara** (Searchbox)
- **Tablo Sütunları:**
  - Kurs Tipi
  - Dönemi
  - Grup Adı
  - Grup Bşl.Tarihi
  - Şube Adı
  - Özel Kodu
- **Sayfa Navigasyonu:** İlk, Önceki, Sonraki, Son

**Özellikler:**
- Dönem ve şube tanımlama
- Grup bazlı dönem yönetimi
- Özel kod tanımlama

#### 10.1.2. Kursiyer Kayıt

**Not:** Bu sayfa "Kursiyer Yeni Kayıt" sayfası ile aynıdır. Detaylar için bkz. 1.1.1. Kursiyer Yeni Kayıt Sayfası.

#### 10.1.3. Kursiyer Listesi

**Not:** Bu sayfa "Kursiyer Listesi" sayfası ile aynıdır. Detaylar için bkz. 1.1.2. Kursiyer Listesi Sayfası.

#### 10.1.4. Evrak Listesi

**Not:** Bu sayfa "Evrak Listesi" sayfası ile aynıdır. Detaylar için bkz. 1.1.14. Evrak Listesi Sayfası.

#### 10.1.5. Görüşme Listesi

**Not:** Bu sayfa "Görüşme Listesi" sayfası ile aynıdır. Detaylar için bkz. 1.1.13. Görüşme Listesi Sayfası.

#### 10.1.6. Bakiye Listesi

**Not:** Bu sayfa "Bakiye Raporu" sayfası ile benzerdir. Detaylar için bkz. 1.1.7. Bakiye Raporu Sayfası.

#### 10.1.7. Kursiyer İstatistik

**Not:** Bu sayfa "İstatistik" sayfası ile aynıdır. Detaylar için bkz. 1.1.11. İstatistik Sayfası.

#### 10.1.8. Günlük Kasa

**Not:** Bu sayfa "Kasa" modülü altındaki "Günlük Kasa" sayfası ile aynıdır. Detaylar için Kasa modülü analizi.

#### 10.1.9. Fatura Raporu

**Not:** Bu sayfa "Fatura" modülü altındaki "Fatura Raporu" sayfası ile aynıdır. Detaylar için Fatura modülü analizi.

#### 10.1.10. Sınav Tarihi

**Sayfa Başlığı:**
- "Sınav Tarihi Tanımlama"

**Üst Toolbar Butonları:**
1. **Temizle** (icon: )
2. **Yeni** (icon: )
3. **Vazgeç** (icon: )
4. **Kaydet** (icon: )
5. **Sayfa Kontrolleri** (icon: , ) - Sayfa navigasyonu

**Form Alanları:**
- **Kurs Tipi** (Combobox - MTSK seçili, disabled)
- **Sınav Tipi** (Combobox - Uygulama seçili, disabled - Teorik/Uygulama seçenekleri olabilir)
- **Sınav Tarihi** (Textbox - Tarih seçimi)

**Liste Bölümü:**
- **Başlık:** "Sınav Tarihi Listesi"
- **Yeni Sınav Tarihi Ekle** butonu (icon: )
- **Sayfada kayıt göster** (Combobox: 10, 25, 50, 100)
- **Ara** (Searchbox)
- **Tablo Sütunları:**
  - Kurs Tipi
  - Sınav Tipi
  - Sınav Tarihi
- **Sayfa Navigasyonu:** İlk, Önceki, Sonraki, Son

**Özellikler:**
- Sınav tarihleri tanımlama
- Kurs tipi ve sınav tipi bazlı tarih yönetimi

#### 10.1.11. Sanal Pos

**Not:** Bu sayfa "Kasa" modülü altındaki "Sanal Pos Tahsilat" sayfası ile aynıdır. Detaylar için Kasa modülü analizi.

---

### 10.2. Dashboard Widget'ları

#### 10.2.1. Not Defteri Widget

**Konum:** Dashboard sağ tarafında, üst kısımda

**Görünüm:**
- **Başlık:** "Kullanıcıya Özel Not Defteri"
- **Sayaç:** "Not Defteri 0" (link - "#mainNotDefteri")
- **Kapatma Butonu** (icon: , )

**Form Alanları:**
- **Yeni Not Yaz** (Textbox - "Yeni Not Yaz (Kayıt İçin Enter)")
- **Kaydet** butonu (icon: )

**Not Listesi:**
- Notlar listelenir (şu anda "Eklenmiş not kaydı bulunamadı.")
- Her not için düzenleme, silme, tamamlama seçenekleri

**Kullanım Özellikleri:**
1. Eklenen notlar sadece ekleyen kullanıcın hesabında görülür.
2. Eklediğiniz notu sonradan düzenleyip, değiştirebilirsiniz.
3. Eklediğiniz notlara ek açıklama yazabilirsiniz. (Açıklama yazılan notların rengi değişir)
4. Eklediğiniz notlara alarm kurabilirsiniz. (Alarm kurulan notların rengi değişir)
5. Alarm kurduğunuz notun tarihi geldiğinde paneli açar açmaz uyarı gelir.
6. Önemli notlarınızı sabitleyip en üstte görünmesini sağlayabilirsiniz. (Sabitlenen notların rengi değişir)
7. Sabitlediğiniz notların istediğiniz zaman sabitini kaldırabilirsiniz.
8. Notlarınızın sıralamasını değiştirebilirsiniz.
9. Tamamlanan notunuzu işaretlerseniz listeden kalkar.
10. Eklediğiniz notu tamamlandı işareti yapmadan da silebilirsiniz.

**Filtreleme:**
- "10 KİŞİ TÜMÜ" / "3 GÜN BUGÜN" filtreleme seçenekleri

#### 10.2.2. Vade Tarihi Widget

**Konum:** Dashboard sağ tarafında, Not Defteri altında

**Görünüm:**
- **Sayaç:** "Vade Tarihi 0" (link - "#mainVadeTarihi")
- Vade tarihi yaklaşan öğeleri gösterir

**Özellikler:**
- Vade tarihi yaklaşan öğelerin listesi
- Tarih bazlı uyarı sistemi

#### 10.2.3. Görüşme Kontrol Widget

**Konum:** Dashboard sağ tarafında, Vade Tarihi altında

**Görünüm:**
- **Sayaç:** "Görüşme Kontrol 0" (link - "#mainGorusmeKontrol")
- Kontrol edilmesi gereken görüşmeleri gösterir

**Özellikler:**
- Görüşme takip sistemi
- Kontrol tarihi yaklaşan görüşmeler

#### 10.2.4. MTV Ödemesi Gelen Araçlar Widget

**Konum:** Dashboard orta kısımda, üstte

**Görünüm:**
- **Başlık:** "MTV Ödemesi Gelen Araçlar"
- **Tümünü Görüntüle** butonu

**Tablo Sütunları:**
- Araç Plaka
- Araç Türü
- Ocak Taksidi
- Temmuz Taksidi

**Özellikler:**
- MTV ödemesi yaklaşan araçları gösterir
- Taksit bazlı takip

#### 10.2.5. Araç Durum Widget'ları

**Konum:** Dashboard sağ alt kısımda, 5 adet kare widget

**Widget'lar:**

1. **Araç Kullanımda Olan**
   - **Sayaç:** "0 Araç"
   - **Açıklama:** "Kullanımda Olan"
   - **Link:** "?pg=list&ls=aracgiris"
   - Kullanımda olan araç sayısını gösterir

2. **Araç Bakımda Olan**
   - **Sayaç:** "0 Araç"
   - **Açıklama:** "Bakımda Olan"
   - **Link:** "?pg=list&ls=aracgiris"
   - Bakımda olan araç sayısını gösterir

3. **Araç Sigorta/Kasko Yaklaşan**
   - **Sayaç:** "0 Araç"
   - **Açıklama:** "Sigorta/Kasko Yaklaşan"
   - **Link:** "?pg=list&ls=sigorta&fSigortaDurum=0"
   - Sigorta/Kasko tarihi yaklaşan araçları gösterir

4. **Araç Muayene Tarihi Gelen**
   - **Sayaç:** "0 Araç"
   - **Açıklama:** "Muayene Tarihi Gelen"
   - **Link:** "?pg/list&ls=muayene"
   - Muayene tarihi yaklaşan araçları gösterir

5. **Araç Bakım Zamanı Gelen**
   - **Sayaç:** "0 Araç"
   - **Açıklama:** "Bakım Zamanı Gelen"
   - **Link:** "?pg/list&ls=bakim"
   - Bakım zamanı yaklaşan araçları gösterir

**Özellikler:**
- Her widget tıklanabilir ve ilgili liste sayfasına yönlendirir
- Gerçek zamanlı sayaç gösterimi
- Araç durum takibi

---

**Not:** Bu analiz devam ediyor. Tüm menüler ve sayfalar tek tek incelenecek ve tüm butonlar, formlar ve işlevler belgelenecek.
