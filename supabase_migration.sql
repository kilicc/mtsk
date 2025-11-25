-- Supabase PostgreSQL Migration
-- Generated from SQL Server schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fix: Mevcut tablolara eksik PRIMARY KEY'leri ekle (yeni tablolar oluşturulmadan önce)
DO $$
BEGIN
    -- Kursiyer tablosuna PRIMARY KEY ekle (eğer yoksa)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'kursiyer') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'pk_kursiyer' 
            AND conrelid = 'kursiyer'::regclass
        ) THEN
            ALTER TABLE kursiyer ADD CONSTRAINT pk_kursiyer PRIMARY KEY (id);
        END IF;
    END IF;

    -- Muhasebe tablosuna PRIMARY KEY ekle (eğer yoksa)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'muhasebe') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'pk_muhasebe' 
            AND conrelid = 'muhasebe'::regclass
        ) THEN
            ALTER TABLE muhasebe ADD CONSTRAINT pk_muhasebe PRIMARY KEY (id);
        END IF;
    END IF;

    -- Personel tablosuna PRIMARY KEY ekle (eğer yoksa)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'personel') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'pk_personel' 
            AND conrelid = 'personel'::regclass
        ) THEN
            ALTER TABLE personel ADD CONSTRAINT pk_personel PRIMARY KEY (id);
        END IF;
    END IF;

    -- Cari_firma tablosuna PRIMARY KEY ekle (eğer yoksa)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cari_firma') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'pk_cari_firma' 
            AND conrelid = 'cari_firma'::regclass
        ) THEN
            ALTER TABLE cari_firma ADD CONSTRAINT pk_cari_firma PRIMARY KEY (id);
        END IF;
    END IF;

    -- Banka_hesabi tablosuna PRIMARY KEY ekle (eğer yoksa)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'banka_hesabi') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'pk_banka_hesabi' 
            AND conrelid = 'banka_hesabi'::regclass
        ) THEN
            ALTER TABLE banka_hesabi ADD CONSTRAINT pk_banka_hesabi PRIMARY KEY (id);
        END IF;
    END IF;

    -- Hizmet tablosuna PRIMARY KEY ekle (eğer yoksa)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hizmet') THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'pk_hizmet' 
            AND conrelid = 'hizmet'::regclass
        ) THEN
            ALTER TABLE hizmet ADD CONSTRAINT pk_hizmet PRIMARY KEY (id);
        END IF;
    END IF;
END $$;

-- Table: appointments
CREATE TABLE IF NOT EXISTS appointments (
    uniqueid SERIAL,
    type INTEGER,
    startdate TIMESTAMP,
    enddate TIMESTAMP,
    allday BOOLEAN,
    status INTEGER,
    label INTEGER,
    resourceid INTEGER,
    id_personel INTEGER,
    sms_durumu INTEGER,
    CONSTRAINT pk_appointments PRIMARY KEY (uniqueid)
);

-- Table: ders_programi_direksiyon
CREATE TABLE IF NOT EXISTS ders_programi_direksiyon (
    id SERIAL,
    id_kursiyer INTEGER,
    id_personel INTEGER,
    id_grup INTEGER,
    id_arac INTEGER,
    t1 DATE,
    t2 DATE,
    t3 DATE,
    t4 DATE,
    t5 DATE,
    t6 DATE,
    t7 DATE,
    t8 DATE,
    t9 DATE,
    t10 DATE,
    t11 DATE,
    t12 DATE,
    t13 DATE,
    t14 DATE,
    t15 DATE,
    t16 DATE,
    t17 DATE,
    t18 DATE,
    t19 DATE,
    t20 DATE,
    t21 DATE,
    t22 DATE,
    t23 DATE,
    t24 DATE,
    t25 DATE,
    t26 DATE,
    t27 DATE,
    t28 DATE,
    t29 DATE,
    t30 DATE,
    t31 DATE,
    durum INTEGER,
    toplam_saat INTEGER,
    direksiyon_no INTEGER,
    CONSTRAINT pk_ders_programi_direksiyon PRIMARY KEY (id)
);

-- Table: ders_programi_direksiyon_e
CREATE TABLE IF NOT EXISTS ders_programi_direksiyon_e (
    id SERIAL,
    direksiyon_no INTEGER,
    id_kursiyer INTEGER,
    id_grup INTEGER,
    id_personel INTEGER,
    id_arac INTEGER,
    t1 DATE,
    t2 DATE,
    t3 DATE,
    t4 DATE,
    t5 DATE,
    t6 DATE,
    t7 DATE,
    t8 DATE,
    t9 DATE,
    t10 DATE,
    t11 DATE,
    t12 DATE,
    t13 DATE,
    t14 DATE,
    t15 DATE,
    t16 DATE,
    t17 DATE,
    t18 DATE,
    t19 DATE,
    t20 DATE,
    seri_simulator INTEGER,
    toplam_saat INTEGER,
    k_bel_bas DATE,
    k_bel_bit DATE,
    CONSTRAINT pk_ders_programi_direksiyon_e PRIMARY KEY (id)
);

-- Table: ders_programi_direksiyon_sab_personel
CREATE TABLE IF NOT EXISTS ders_programi_direksiyon_sab_personel (
    id SERIAL,
    sira_no INTEGER,
    id_personel INTEGER,
    CONSTRAINT pk_ders_programi_direksiyon_sab_personel PRIMARY KEY (id)
);

-- Table: ders_programi_direksiyon_sab_saatler
CREATE TABLE IF NOT EXISTS ders_programi_direksiyon_sab_saatler (
    id SERIAL,
    ders_saati INTEGER,
    sira_no INTEGER,
    CONSTRAINT pk_ders_programi_direksiyon_sab_saatler PRIMARY KEY (id)
);

-- Table: ders_programi_direksiyon_temp
CREATE TABLE IF NOT EXISTS ders_programi_direksiyon_temp (
    id SERIAL,
    ge_direksiyon_no INTEGER NOT NULL,
    ge_id_kursiyer INTEGER,
    ge_id_personel INTEGER,
    ge_id_grup INTEGER,
    ge_id_arac INTEGER,
    ge_id_simu INTEGER,
    ge_aday_no INTEGER,
    ge_durumu INTEGER,
    CONSTRAINT pk_ders_programi_direksiyon_temp PRIMARY KEY (id)
);

-- Table: ders_programi_direksiyon_yeni
CREATE TABLE IF NOT EXISTS ders_programi_direksiyon_yeni (
    id SERIAL,
    direksiyon_no INTEGER,
    id_kursiyer INTEGER,
    id_grupkarti INTEGER,
    t1 DATE,
    t2 DATE,
    t3 DATE,
    t4 DATE,
    t5 DATE,
    t6 DATE,
    t7 DATE,
    t8 DATE,
    t9 DATE,
    t10 DATE,
    t11 DATE,
    t12 DATE,
    t13 DATE,
    t14 DATE,
    t15 DATE,
    t16 DATE,
    t17 DATE,
    t18 DATE,
    t19 DATE,
    t20 DATE,
    id_per_1 INTEGER,
    id_per_2 INTEGER,
    id_per_3 INTEGER,
    id_per_4 INTEGER,
    id_per_5 INTEGER,
    id_per_6 INTEGER,
    id_per_7 INTEGER,
    id_per_8 INTEGER,
    id_per_9 INTEGER,
    id_per_10 INTEGER,
    id_per_11 INTEGER,
    id_per_12 INTEGER,
    id_per_13 INTEGER,
    id_per_14 INTEGER,
    id_per_15 INTEGER,
    id_per_16 INTEGER,
    id_per_17 INTEGER,
    id_per_18 INTEGER,
    id_per_19 INTEGER,
    id_per_20 INTEGER,
    id_arac1 INTEGER,
    id_arac2 INTEGER,
    id_arac3 INTEGER,
    id_arac4 INTEGER,
    id_arac5 INTEGER,
    id_arac6 INTEGER,
    id_arac7 INTEGER,
    id_arac8 INTEGER,
    id_arac9 INTEGER,
    id_arac10 INTEGER,
    id_arac11 INTEGER,
    id_arac12 INTEGER,
    id_arac13 INTEGER,
    id_arac14 INTEGER,
    id_arac15 INTEGER,
    id_arac16 INTEGER,
    id_arac17 INTEGER,
    id_arac18 INTEGER,
    id_arac19 INTEGER,
    id_arac20 INTEGER,
    t_simulator DATE,
    p_simulator INTEGER,
    a_simulator INTEGER,
    t_dir_egt_yeri DATE,
    p_dir_egt_yeri INTEGER,
    a_dir_egt_yeri INTEGER,
    toplam_saat INTEGER,
    k_bel_bas DATE,
    k_bel_bit DATE,
    CONSTRAINT pk_ders_programi_direksiyon_yeni PRIMARY KEY (id)
);

-- Table: ders_programi_direksiyon_yeni_temp
CREATE TABLE IF NOT EXISTS ders_programi_direksiyon_yeni_temp (
    id SERIAL,
    id_personel INTEGER,
    direksiyonno INTEGER,
    kacinci_haf INTEGER,
    haftalik_ders_saati INTEGER,
    kac_saat_ders_verdi INTEGER,
    CONSTRAINT pk_ders_programi_direksiyon_yeni_temp PRIMARY KEY (id)
);

-- Table: ders_programi_new_direksiyon
CREATE TABLE IF NOT EXISTS ders_programi_new_direksiyon (
    id SERIAL,
    direksiyon_no INTEGER,
    id_kursiyer INTEGER,
    id_grupkarti INTEGER,
    t1 DATE,
    t2 DATE,
    t3 DATE,
    t4 DATE,
    t5 DATE,
    t6 DATE,
    t7 DATE,
    t8 DATE,
    t9 DATE,
    t10 DATE,
    t11 DATE,
    t12 DATE,
    t13 DATE,
    t14 DATE,
    t15 DATE,
    t16 DATE,
    t17 DATE,
    t18 DATE,
    t19 DATE,
    t20 DATE,
    id_per_1 INTEGER,
    id_per_2 INTEGER,
    id_per_3 INTEGER,
    id_per_4 INTEGER,
    id_per_5 INTEGER,
    id_per_6 INTEGER,
    id_per_7 INTEGER,
    id_per_8 INTEGER,
    id_per_9 INTEGER,
    id_per_10 INTEGER,
    id_per_11 INTEGER,
    id_per_12 INTEGER,
    id_per_13 INTEGER,
    id_per_14 INTEGER,
    id_per_15 INTEGER,
    id_per_16 INTEGER,
    id_per_17 INTEGER,
    id_per_18 INTEGER,
    id_per_19 INTEGER,
    id_per_20 INTEGER,
    id_arac1 INTEGER,
    id_arac2 INTEGER,
    id_arac3 INTEGER,
    id_arac4 INTEGER,
    id_arac5 INTEGER,
    id_arac6 INTEGER,
    id_arac7 INTEGER,
    id_arac8 INTEGER,
    id_arac9 INTEGER,
    id_arac10 INTEGER,
    id_arac11 INTEGER,
    id_arac12 INTEGER,
    id_arac13 INTEGER,
    id_arac14 INTEGER,
    id_arac15 INTEGER,
    id_arac16 INTEGER,
    id_arac17 INTEGER,
    id_arac18 INTEGER,
    id_arac19 INTEGER,
    id_arac20 INTEGER,
    t_simulator DATE,
    p_simulator INTEGER,
    a_simulator INTEGER,
    t_dir_egt_yeri DATE,
    p_dir_egt_yeri INTEGER,
    a_dir_egt_yeri INTEGER,
    toplam_saat INTEGER,
    k_bel_bas DATE,
    k_bel_bit DATE,
    CONSTRAINT pk_ders_programi_new_direksiyon PRIMARY KEY (id)
);

-- Table: ders_programi_new_mebbis
CREATE TABLE IF NOT EXISTS ders_programi_new_mebbis (
    id SERIAL,
    ge_prg_no INTEGER,
    ge_id_kurs INTEGER,
    ge_id_pers INTEGER,
    ge_id_grup INTEGER,
    ge_id_arac INTEGER,
    ge_aday_no INTEGER,
    ge_durumu INTEGER,
    CONSTRAINT pk_ders_programi_new_mebbis PRIMARY KEY (id)
);

-- Table: ders_programi_new_temp
CREATE TABLE IF NOT EXISTS ders_programi_new_temp (
    id SERIAL,
    id_direksiyon INTEGER,
    gun INTEGER,
    id_kursiyer INTEGER,
    id_personel INTEGER,
    id_arac INTEGER,
    tarih DATE,
    tarih_hafta INTEGER,
    hafta_max INTEGER,
    hafta_kac_saat INTEGER,
    CONSTRAINT pk_ders_programi_new_temp PRIMARY KEY (id)
);

-- Table: ders_programi_ozeldireksiyon
CREATE TABLE IF NOT EXISTS ders_programi_ozeldireksiyon (
    id SERIAL,
    tarih DATE,
    hafta INTEGER,
    id_kursiyer1 INTEGER,
    id_kursiyer2 INTEGER,
    id_kursiyer3 INTEGER,
    id_kursiyer4 INTEGER,
    id_kursiyer5 INTEGER,
    id_kursiyer6 INTEGER,
    id_kursiyer7 INTEGER,
    id_kursiyer8 INTEGER,
    renkler1 INTEGER,
    renkler2 INTEGER,
    renkler3 INTEGER,
    renkler4 INTEGER,
    renkler5 INTEGER,
    renkler6 INTEGER,
    renkler7 INTEGER,
    renkler8 INTEGER,
    id_kursiyer9 INTEGER,
    id_kursiyer10 INTEGER,
    id_kursiyer11 INTEGER,
    id_kursiyer12 INTEGER,
    renkler9 INTEGER,
    renkler10 INTEGER,
    renkler11 INTEGER,
    renkler12 INTEGER,
    CONSTRAINT pk_ders_programi_ozeldireksiyon PRIMARY KEY (id)
);

-- Table: ders_programi_ozeldireksiyon_raportemp
CREATE TABLE IF NOT EXISTS ders_programi_ozeldireksiyon_raportemp (
    id SERIAL,
    tarih DATE,
    hafta INTEGER,
    CONSTRAINT pk_ders_programi_ozeldireksiyon_raportemp PRIMARY KEY (id)
);

-- Table: ders_programi_teori
CREATE TABLE IF NOT EXISTS ders_programi_teori (
    id SERIAL,
    id_grup_karti INTEGER,
    hafta INTEGER,
    CONSTRAINT pk_ders_programi_teori PRIMARY KEY (id)
);

-- Table: ders_programi_teori_mebbis
CREATE TABLE IF NOT EXISTS ders_programi_teori_mebbis (
    id SERIAL,
    id_grup INTEGER,
    id_personel INTEGER,
    aktarim_durumu BOOLEAN,
    CONSTRAINT pk_ders_programi_teori_mebbis PRIMARY KEY (id)
);

-- Table: ders_programi_teori_tarih
CREATE TABLE IF NOT EXISTS ders_programi_teori_tarih (
    id SERIAL,
    id_grup_karti INTEGER,
    tarih1 DATE,
    tarih2 DATE,
    tarih3 DATE,
    tarih4 DATE,
    tarih5 DATE,
    tarih6 DATE,
    tarih7 DATE,
    tarih8 DATE,
    tarih9 DATE,
    tarih10 DATE,
    tarih11 DATE,
    tarih12 DATE,
    tarih13 DATE,
    tarih14 DATE,
    tarih15 DATE,
    tarih16 DATE,
    tarih17 DATE,
    tarih18 DATE,
    tarih19 DATE,
    tarih20 DATE,
    tarih21 DATE,
    tarih22 DATE,
    tarih23 DATE,
    tarih24 DATE,
    tarih25 DATE,
    tarih26 DATE,
    tarih27 DATE,
    tarih28 DATE,
    tarih29 DATE,
    tarih30 DATE,
    tarih31 DATE,
    tarih32 DATE,
    tarih33 DATE,
    tarih34 DATE,
    tarih35 DATE,
    bilgi_durumu INTEGER,
    haf1_top_t INTEGER,
    haf1_top_m INTEGER,
    haf1_top_i INTEGER,
    haf2_top_t INTEGER,
    haf2_top_m INTEGER,
    haf2_top_i INTEGER,
    haf3_top_t INTEGER,
    haf3_top_m INTEGER,
    haf3_top_i INTEGER,
    haf1_top_a INTEGER,
    haf2_top_a INTEGER,
    haf3_top_a INTEGER,
    CONSTRAINT pk_ders_programi_teori_tarih PRIMARY KEY (id)
);

-- Table: ders_programi_teori_temp
CREATE TABLE IF NOT EXISTS ders_programi_teori_temp (
    id SERIAL,
    id_grup_karti INTEGER,
    t_tarih1 DATE,
    t_tarih2 DATE,
    t_tarih3 DATE,
    t_tarih4 DATE,
    t_tarih5 DATE,
    t_tarih6 DATE,
    t_tarih7 DATE,
    t_tarih8 DATE,
    t_tarih9 DATE,
    t_tarih10 DATE,
    t_tarih11 DATE,
    t_tarih12 DATE,
    t_tarih13 DATE,
    t_tarih14 DATE,
    t_tarih15 DATE,
    t_tarih16 DATE,
    t_tarih17 DATE,
    t_tarih18 DATE,
    t_tarih19 DATE,
    t_tarih20 DATE,
    m_tarih1 DATE,
    m_tarih2 DATE,
    m_tarih3 DATE,
    m_tarih4 DATE,
    m_tarih5 DATE,
    m_tarih6 DATE,
    m_tarih7 DATE,
    m_tarih8 DATE,
    m_tarih9 DATE,
    m_tarih10 DATE,
    i_tarih1 DATE,
    i_tarih2 DATE,
    i_tarih3 DATE,
    i_tarih4 DATE,
    i_tarih5 DATE,
    i_tarih6 DATE,
    i_tarih7 DATE,
    i_tarih8 DATE,
    i_tarih9 DATE,
    i_tarih10 DATE,
    ta_tarih1 DATE,
    ta_tarih2 DATE,
    ta_tarih3 DATE,
    ta_tarih4 DATE,
    ta_tarih5 DATE,
    ta_tarih6 DATE,
    ta_tarih7 DATE,
    ta_tarih8 DATE,
    ta_tarih9 DATE,
    ta_tarih10 DATE,
    CONSTRAINT pk_ders_programi_teori_temp PRIMARY KEY (id)
);

-- Table: ders_programi_wenntec
CREATE TABLE IF NOT EXISTS ders_programi_wenntec (
    id SERIAL,
    yil INTEGER,
    hafta INTEGER,
    pzt_tar DATE,
    pzt_prs_1 INTEGER,
    pzt_prs_2 INTEGER,
    pzt_prs_3 INTEGER,
    pzt_prs_4 INTEGER,
    pzt_prs_5 INTEGER,
    pzt_prs_6 INTEGER,
    pzt_prs_7 INTEGER,
    pzt_prs_8 INTEGER,
    pzt_prs_9 INTEGER,
    pzt_prs_10 INTEGER,
    pzt_prs_11 INTEGER,
    pzt_prs_12 INTEGER,
    pzt_prs_13 INTEGER,
    pzt_prs_14 INTEGER,
    pzt_prs_15 INTEGER,
    pzt_arc_1 INTEGER,
    pzt_arc_2 INTEGER,
    pzt_arc_3 INTEGER,
    pzt_arc_4 INTEGER,
    pzt_arc_5 INTEGER,
    pzt_arc_6 INTEGER,
    pzt_arc_7 INTEGER,
    pzt_arc_8 INTEGER,
    pzt_arc_9 INTEGER,
    pzt_arc_10 INTEGER,
    pzt_arc_11 INTEGER,
    pzt_arc_12 INTEGER,
    pzt_arc_13 INTEGER,
    pzt_arc_14 INTEGER,
    pzt_arc_15 INTEGER,
    pzt_krs_1 INTEGER,
    pzt_krs_2 INTEGER,
    pzt_krs_3 INTEGER,
    pzt_krs_4 INTEGER,
    pzt_krs_5 INTEGER,
    pzt_krs_6 INTEGER,
    pzt_krs_7 INTEGER,
    pzt_krs_8 INTEGER,
    pzt_krs_9 INTEGER,
    pzt_krs_10 INTEGER,
    pzt_krs_11 INTEGER,
    pzt_krs_12 INTEGER,
    pzt_krs_13 INTEGER,
    pzt_krs_14 INTEGER,
    pzt_krs_15 INTEGER,
    sali_tar DATE,
    sali_prs_1 INTEGER,
    sali_prs_2 INTEGER,
    sali_prs_3 INTEGER,
    sali_prs_4 INTEGER,
    sali_prs_5 INTEGER,
    sali_prs_6 INTEGER,
    sali_prs_7 INTEGER,
    sali_prs_8 INTEGER,
    sali_prs_9 INTEGER,
    sali_prs_10 INTEGER,
    sali_prs_11 INTEGER,
    sali_prs_12 INTEGER,
    sali_prs_13 INTEGER,
    sali_prs_14 INTEGER,
    sali_prs_15 INTEGER,
    sali_arc_1 INTEGER,
    sali_arc_2 INTEGER,
    sali_arc_3 INTEGER,
    sali_arc_4 INTEGER,
    sali_arc_5 INTEGER,
    sali_arc_6 INTEGER,
    sali_arc_7 INTEGER,
    sali_arc_8 INTEGER,
    sali_arc_9 INTEGER,
    sali_arc_10 INTEGER,
    sali_arc_11 INTEGER,
    sali_arc_12 INTEGER,
    sali_arc_13 INTEGER,
    sali_arc_14 INTEGER,
    sali_arc_15 INTEGER,
    sali_krs_1 INTEGER,
    sali_krs_2 INTEGER,
    sali_krs_3 INTEGER,
    sali_krs_4 INTEGER,
    sali_krs_5 INTEGER,
    sali_krs_6 INTEGER,
    sali_krs_7 INTEGER,
    sali_krs_8 INTEGER,
    sali_krs_9 INTEGER,
    sali_krs_10 INTEGER,
    sali_krs_11 INTEGER,
    sali_krs_12 INTEGER,
    sali_krs_13 INTEGER,
    sali_krs_14 INTEGER,
    sali_krs_15 INTEGER,
    crs_tar DATE,
    crs_prs_1 INTEGER,
    crs_prs_2 INTEGER,
    crs_prs_3 INTEGER,
    crs_prs_4 INTEGER,
    crs_prs_5 INTEGER,
    crs_prs_6 INTEGER,
    crs_prs_7 INTEGER,
    crs_prs_8 INTEGER,
    crs_prs_9 INTEGER,
    crs_prs_10 INTEGER,
    crs_prs_11 INTEGER,
    crs_prs_12 INTEGER,
    crs_prs_13 INTEGER,
    crs_prs_14 INTEGER,
    crs_prs_15 INTEGER,
    crs_arc_1 INTEGER,
    crs_arc_2 INTEGER,
    crs_arc_3 INTEGER,
    crs_arc_4 INTEGER,
    crs_arc_5 INTEGER,
    crs_arc_6 INTEGER,
    crs_arc_7 INTEGER,
    crs_arc_8 INTEGER,
    crs_arc_9 INTEGER,
    crs_arc_10 INTEGER,
    crs_arc_11 INTEGER,
    crs_arc_12 INTEGER,
    crs_arc_13 INTEGER,
    crs_arc_14 INTEGER,
    crs_arc_15 INTEGER,
    crs_krs_1 INTEGER,
    crs_krs_2 INTEGER,
    crs_krs_3 INTEGER,
    crs_krs_4 INTEGER,
    crs_krs_5 INTEGER,
    crs_krs_6 INTEGER,
    crs_krs_7 INTEGER,
    crs_krs_8 INTEGER,
    crs_krs_9 INTEGER,
    crs_krs_10 INTEGER,
    crs_krs_11 INTEGER,
    crs_krs_12 INTEGER,
    crs_krs_13 INTEGER,
    crs_krs_14 INTEGER,
    crs_krs_15 INTEGER,
    prs_tar DATE,
    prs_prs_1 INTEGER,
    prs_prs_2 INTEGER,
    prs_prs_3 INTEGER,
    prs_prs_4 INTEGER,
    prs_prs_5 INTEGER,
    prs_prs_6 INTEGER,
    prs_prs_7 INTEGER,
    prs_prs_8 INTEGER,
    prs_prs_9 INTEGER,
    prs_prs_10 INTEGER,
    prs_prs_11 INTEGER,
    prs_prs_12 INTEGER,
    prs_prs_13 INTEGER,
    prs_prs_14 INTEGER,
    prs_prs_15 INTEGER,
    prs_arc_1 INTEGER,
    prs_arc_2 INTEGER,
    prs_arc_3 INTEGER,
    prs_arc_4 INTEGER,
    prs_arc_5 INTEGER,
    prs_arc_6 INTEGER,
    prs_arc_7 INTEGER,
    prs_arc_8 INTEGER,
    prs_arc_9 INTEGER,
    prs_arc_10 INTEGER,
    prs_arc_11 INTEGER,
    prs_arc_12 INTEGER,
    prs_arc_13 INTEGER,
    prs_arc_14 INTEGER,
    prs_arc_15 INTEGER,
    prs_krs_1 INTEGER,
    prs_krs_2 INTEGER,
    prs_krs_3 INTEGER,
    prs_krs_4 INTEGER,
    prs_krs_5 INTEGER,
    prs_krs_6 INTEGER,
    prs_krs_7 INTEGER,
    prs_krs_8 INTEGER,
    prs_krs_9 INTEGER,
    prs_krs_10 INTEGER,
    prs_krs_11 INTEGER,
    prs_krs_12 INTEGER,
    prs_krs_13 INTEGER,
    prs_krs_14 INTEGER,
    prs_krs_15 INTEGER,
    cuma_tar DATE,
    cuma_prs_1 INTEGER,
    cuma_prs_2 INTEGER,
    cuma_prs_3 INTEGER,
    cuma_prs_4 INTEGER,
    cuma_prs_5 INTEGER,
    cuma_prs_6 INTEGER,
    cuma_prs_7 INTEGER,
    cuma_prs_8 INTEGER,
    cuma_prs_9 INTEGER,
    cuma_prs_10 INTEGER,
    cuma_prs_11 INTEGER,
    cuma_prs_12 INTEGER,
    cuma_prs_13 INTEGER,
    cuma_prs_14 INTEGER,
    cuma_prs_15 INTEGER,
    cuma_arc_1 INTEGER,
    cuma_arc_2 INTEGER,
    cuma_arc_3 INTEGER,
    cuma_arc_4 INTEGER,
    cuma_arc_5 INTEGER,
    cuma_arc_6 INTEGER,
    cuma_arc_7 INTEGER,
    cuma_arc_8 INTEGER,
    cuma_arc_9 INTEGER,
    cuma_arc_10 INTEGER,
    cuma_arc_11 INTEGER,
    cuma_arc_12 INTEGER,
    cuma_arc_13 INTEGER,
    cuma_arc_14 INTEGER,
    cuma_arc_15 INTEGER,
    cuma_krs_1 INTEGER,
    cuma_krs_2 INTEGER,
    cuma_krs_3 INTEGER,
    cuma_krs_4 INTEGER,
    cuma_krs_5 INTEGER,
    cuma_krs_6 INTEGER,
    cuma_krs_7 INTEGER,
    cuma_krs_8 INTEGER,
    cuma_krs_9 INTEGER,
    cuma_krs_10 INTEGER,
    cuma_krs_11 INTEGER,
    cuma_krs_12 INTEGER,
    cuma_krs_13 INTEGER,
    cuma_krs_14 INTEGER,
    cuma_krs_15 INTEGER,
    cmrts_tar DATE,
    cmrts_prs_1 INTEGER,
    cmrts_prs_2 INTEGER,
    cmrts_prs_3 INTEGER,
    cmrts_prs_4 INTEGER,
    cmrts_prs_5 INTEGER,
    cmrts_prs_6 INTEGER,
    cmrts_prs_7 INTEGER,
    cmrts_prs_8 INTEGER,
    cmrts_prs_9 INTEGER,
    cmrts_prs_10 INTEGER,
    cmrts_prs_11 INTEGER,
    cmrts_prs_12 INTEGER,
    cmrts_prs_13 INTEGER,
    cmrts_prs_14 INTEGER,
    cmrts_prs_15 INTEGER,
    cmrts_arc_1 INTEGER,
    cmrts_arc_2 INTEGER,
    cmrts_arc_3 INTEGER,
    cmrts_arc_4 INTEGER,
    cmrts_arc_5 INTEGER,
    cmrts_arc_6 INTEGER,
    cmrts_arc_7 INTEGER,
    cmrts_arc_8 INTEGER,
    cmrts_arc_9 INTEGER,
    cmrts_arc_10 INTEGER,
    cmrts_arc_11 INTEGER,
    cmrts_arc_12 INTEGER,
    cmrts_arc_13 INTEGER,
    cmrts_arc_14 INTEGER,
    cmrts_arc_15 INTEGER,
    cmrts_krs_1 INTEGER,
    cmrts_krs_2 INTEGER,
    cmrts_krs_3 INTEGER,
    cmrts_krs_4 INTEGER,
    cmrts_krs_5 INTEGER,
    cmrts_krs_6 INTEGER,
    cmrts_krs_7 INTEGER,
    cmrts_krs_8 INTEGER,
    cmrts_krs_9 INTEGER,
    cmrts_krs_10 INTEGER,
    cmrts_krs_11 INTEGER,
    cmrts_krs_12 INTEGER,
    cmrts_krs_13 INTEGER,
    cmrts_krs_14 INTEGER,
    cmrts_krs_15 INTEGER,
    pazar_tar DATE,
    pazar_prs_1 INTEGER,
    pazar_prs_2 INTEGER,
    pazar_prs_3 INTEGER,
    pazar_prs_4 INTEGER,
    pazar_prs_5 INTEGER,
    pazar_prs_6 INTEGER,
    pazar_prs_7 INTEGER,
    pazar_prs_8 INTEGER,
    pazar_prs_9 INTEGER,
    pazar_prs_10 INTEGER,
    pazar_prs_11 INTEGER,
    pazar_prs_12 INTEGER,
    pazar_prs_13 INTEGER,
    pazar_prs_14 INTEGER,
    pazar_prs_15 INTEGER,
    pazar_arc_1 INTEGER,
    pazar_arc_2 INTEGER,
    pazar_arc_3 INTEGER,
    pazar_arc_4 INTEGER,
    pazar_arc_5 INTEGER,
    pazar_arc_6 INTEGER,
    pazar_arc_7 INTEGER,
    pazar_arc_8 INTEGER,
    pazar_arc_9 INTEGER,
    pazar_arc_10 INTEGER,
    pazar_arc_11 INTEGER,
    pazar_arc_12 INTEGER,
    pazar_arc_13 INTEGER,
    pazar_arc_14 INTEGER,
    pazar_arc_15 INTEGER,
    pazar_krs_1 INTEGER,
    pazar_krs_2 INTEGER,
    pazar_krs_3 INTEGER,
    pazar_krs_4 INTEGER,
    pazar_krs_5 INTEGER,
    pazar_krs_6 INTEGER,
    pazar_krs_7 INTEGER,
    pazar_krs_8 INTEGER,
    pazar_krs_9 INTEGER,
    pazar_krs_10 INTEGER,
    pazar_krs_11 INTEGER,
    pazar_krs_12 INTEGER,
    pazar_krs_13 INTEGER,
    pazar_krs_14 INTEGER,
    pazar_krs_15 INTEGER,
    CONSTRAINT pk_ders_programi_wenntec PRIMARY KEY (id)
);

-- Table: grup_karti
CREATE TABLE IF NOT EXISTS grup_karti (
    id SERIAL,
    bas_tar DATE,
    bit_tar DATE,
    kapasite INTEGER,
    mevcut INTEGER,
    grup_durumu BOOLEAN,
    akt INTEGER,
    CONSTRAINT pk_grup_karti PRIMARY KEY (id)
);

-- Table: gunluk_islemler
CREATE TABLE IF NOT EXISTS gunluk_islemler (
    id SERIAL,
    tarih DATE,
    CONSTRAINT pk_gunluk_islemler PRIMARY KEY (id)
);

-- Table: gunluk_islemler_ajanda
CREATE TABLE IF NOT EXISTS gunluk_islemler_ajanda (
    id SERIAL,
    gorev_tarih DATE,
    gorev_kullanici INTEGER,
    CONSTRAINT pk_gunluk_islemler_ajanda PRIMARY KEY (id)
);

-- Table: gunluk_islemler_log
CREATE TABLE IF NOT EXISTS gunluk_islemler_log (
    id SERIAL,
    islem_tarihi DATE,
    CONSTRAINT pk_gunluk_islemler_log PRIMARY KEY (id)
);

-- Table: kullanici
CREATE TABLE IF NOT EXISTS kullanici (
    id SERIAL,
    kayit_tarihi DATE,
    durumu INTEGER,
    kod INTEGER,
    izin_mtsk BOOLEAN,
    izin_src BOOLEAN,
    izin_ismak BOOLEAN,
    izin_psiko BOOLEAN,
    izin_kasa BOOLEAN,
    izin_gvnlk BOOLEAN,
    CONSTRAINT pk_kullanici PRIMARY KEY (id)
);

-- Table: kullanici_yetkileri
CREATE TABLE IF NOT EXISTS kullanici_yetkileri (
    id_yetki SERIAL,
    id INTEGER NOT NULL,
    parentid INTEGER NOT NULL,
    yetki BOOLEAN,
    kod INTEGER,
    CONSTRAINT pk_kullanici_yetkileri PRIMARY KEY (id_yetki)
);

-- Table: kursiyer
CREATE TABLE IF NOT EXISTS kursiyer (
    id SERIAL,
    id_egitim_araci INTEGER,
    id_grup_karti INTEGER,
    id_personel INTEGER,
    id_referans INTEGER,
    id_ozel_kod1 INTEGER,
    id_ozel_kod2 INTEGER,
    id_sinav_tarihi2 INTEGER,
    kayit_tarihi DATE,
    aday_no INTEGER,
    dogum_tarihi DATE,
    kursiyer_durumu INTEGER,
    once_sert_ver_tar DATE,
    once_mtsk_tarih DATE,
    riskli_kursiyer BOOLEAN,
    resim TEXT,
    resim_tump TEXT,
    kim_verilis_tarihi DATE,
    yuz_ceza_tarihi DATE,
    yuz_ceza_belge_tarihi DATE,
    k_belgesi_bas_tarihi DATE,
    k_belgesi_bit_tarihi DATE,
    teori_hak INTEGER,
    direksiyon_hak INTEGER,
    srt_ver_tar DATE,
    srt_seri_no INTEGER,
    srt_no INTEGER,
    srt_teslim_tarihi DATE,
    srt_ver_tar_ge DATE,
    sert_bas_tar DATE,
    sert_bit_tar DATE,
    e_sinav_knt INTEGER,
    sozlesme_tarihi DATE,
    alinan_ds INTEGER,
    kutuk_def_durumu BOOLEAN,
    kut_t_tar1 DATE,
    kut_t_tar2 DATE,
    kut_t_tar3 DATE,
    kut_t_tar4 DATE,
    kut_t_tar5 DATE,
    kut_t_tar6 DATE,
    kut_t_tar7 DATE,
    kut_t_tar8 DATE,
    kut_d_tar1 DATE,
    kut_d_tar2 DATE,
    kut_d_tar3 DATE,
    kut_d_tar4 DATE,
    kut_d_tar5 DATE,
    kut_d_tar6 DATE,
    kut_d_tar7 DATE,
    kut_d_tar8 DATE,
    arsiv BOOLEAN,
    akt INTEGER,
    e_sinav_gecici_tarih DATE,
    once_sert_2016_oncesi BOOLEAN,
    hes_kodu_tarihi DATE,
    toplam_borc TEXT,
    toplam_odenen TEXT,
    kurumsal_tarih DATE,
    kurumsal_saat INTEGER,
    direksiyon_bitis DATE,
    direksiyon_saat INTEGER,
    yuz_yirmi_bes_cc BOOLEAN,
    resim_webcam TEXT,
    simulator_notu INTEGER,
    CONSTRAINT pk_kursiyer PRIMARY KEY (id)
);

-- Table: kursiyer_direksiyon
CREATE TABLE IF NOT EXISTS kursiyer_direksiyon (
    id SERIAL,
    id_kursiyer INTEGER,
    id_personel INTEGER,
    id_arac INTEGER,
    id_grup INTEGER,
    tarih DATE,
    hafta INTEGER,
    CONSTRAINT pk_kursiyer_direksiyon PRIMARY KEY (id)
);

-- Table: kursiyer_evrak
CREATE TABLE IF NOT EXISTS kursiyer_evrak (
    id SERIAL,
    id_kursiyer INTEGER,
    ogr_bel_tarihi DATE,
    sag_rapor_tarihi DATE,
    savcilik_bel_tarihi DATE,
    img_nuf_cuz_on TEXT,
    img_nuf_cuz_arka TEXT,
    img_sur_bel_on TEXT,
    img_sur_bel_arka TEXT,
    img_ogrnim_bel TEXT,
    img_saglik TEXT,
    img_savcilik TEXT,
    img_mtsk_sertifika TEXT,
    img_muracaat TEXT,
    img_sozlesme_on TEXT,
    img_sozlesme_arka TEXT,
    img_diger1 TEXT,
    img_diger2 TEXT,
    img_diger3 TEXT,
    img_imza TEXT,
    okutman BOOLEAN,
    tercuman BOOLEAN,
    fatura_tarihi DATE,
    fatura_tutari TEXT,
    img_fatura TEXT,
    CONSTRAINT pk_kursiyer_evrak PRIMARY KEY (id)
);

-- Table: kursiyer_evrak_temp
CREATE TABLE IF NOT EXISTS kursiyer_evrak_temp (
    id SERIAL,
    id_kursiyer INTEGER,
    ogr_bel_tarihi DATE,
    sag_rapor_tarihi DATE,
    savcilik_bel_tarihi DATE,
    img_nuf_cuz_on TEXT,
    img_nuf_cuz_arka TEXT,
    img_sur_bel_on TEXT,
    img_sur_bel_arka TEXT,
    img_ogrnim_bel TEXT,
    img_saglik TEXT,
    img_savcilik TEXT,
    img_mtsk_sertifika TEXT,
    img_muracaat TEXT,
    img_sozlesme_on TEXT,
    img_sozlesme_arka TEXT,
    img_diger1 TEXT,
    img_diger2 TEXT,
    img_diger3 TEXT,
    img_imza TEXT,
    okutman BOOLEAN,
    tercuman BOOLEAN,
    fatura_tarihi DATE,
    fatura_tutari TEXT,
    img_fatura TEXT,
    CONSTRAINT pk_kursiyer_evrak_temp PRIMARY KEY (id)
);

-- Table: kursiyer_fatura
CREATE TABLE IF NOT EXISTS kursiyer_fatura (
    id SERIAL,
    id_kursiyer INTEGER,
    id_referans INTEGER,
    fatura_tarihi DATE,
    fatura_kdv_hesabi BOOLEAN,
    fatura_no BIGINT,
    fatura_yekun TEXT,
    fatura_isk_orani INTEGER,
    fatura_isk_tutari TEXT,
    fatura_ara_toplam TEXT,
    fatura_kdv_orani INTEGER,
    fatura_kdv_tutari TEXT,
    fatura_toplam TEXT,
    CONSTRAINT pk_kursiyer_fatura PRIMARY KEY (id)
);

-- Table: kursiyer_fatura_detay
CREATE TABLE IF NOT EXISTS kursiyer_fatura_detay (
    id SERIAL,
    id_fatura INTEGER,
    fatura_miktar INTEGER,
    fatura_fiyat TEXT,
    fatura_tutar TEXT,
    CONSTRAINT pk_kursiyer_fatura_detay PRIMARY KEY (id)
);

-- Table: kursiyer_gorusmeleri
CREATE TABLE IF NOT EXISTS kursiyer_gorusmeleri (
    id SERIAL,
    id_kursiyer INTEGER,
    id_gorusen_personel INTEGER,
    tarih DATE,
    personel_kod INTEGER,
    CONSTRAINT pk_kursiyer_gorusmeleri PRIMARY KEY (id)
);

-- Table: kursiyer_hizli_kayit
CREATE TABLE IF NOT EXISTS kursiyer_hizli_kayit (
    id SERIAL,
    sira_no INTEGER,
    gizlilik BOOLEAN,
    CONSTRAINT pk_kursiyer_hizli_kayit PRIMARY KEY (id)
);

-- Table: kursiyer_on_kayit (Pre-registration)
CREATE TABLE IF NOT EXISTS kursiyer_on_kayit (
    id SERIAL,
    adi VARCHAR(255) NOT NULL,
    soyadi VARCHAR(255) NOT NULL,
    tc_kimlik VARCHAR(11),
    telefon VARCHAR(20),
    email VARCHAR(255),
    adres TEXT,
    dogum_tarihi DATE,
    gorusme_tarihi DATE NOT NULL,
    id_gorusen_personel INTEGER,
    durum INTEGER DEFAULT 0, -- 0: Ön Kayıt, 1: Kesin Kayda Aktarıldı, 2: İptal
    notlar TEXT,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_kursiyer_on_kayit PRIMARY KEY (id)
);

-- Table: kullanici_mesajlari (User Messages)
CREATE TABLE IF NOT EXISTS kullanici_mesajlari (
    id SERIAL,
    id_gonderen INTEGER NOT NULL, -- Kullanıcı ID
    id_alici INTEGER, -- null = Tüm kullanıcılara (broadcast)
    baslik VARCHAR(255) NOT NULL,
    mesaj TEXT NOT NULL,
    okundu BOOLEAN DEFAULT FALSE,
    okunma_tarihi TIMESTAMP,
    gonderim_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    silindi BOOLEAN DEFAULT FALSE,
    CONSTRAINT pk_kullanici_mesajlari PRIMARY KEY (id)
);

-- Table: yedekleme_gecmisi (Backup History)
CREATE TABLE IF NOT EXISTS yedekleme_gecmisi (
    id SERIAL,
    yedekleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    yedekleme_tipi VARCHAR(50), -- 'full', 'incremental'
    dosya_yolu TEXT,
    dosya_boyutu BIGINT, -- Bytes
    durum VARCHAR(50), -- 'basarili', 'basarisiz', 'devam_ediyor'
    hata_mesaji TEXT,
    CONSTRAINT pk_yedekleme_gecmisi PRIMARY KEY (id)
);

-- Table: yedekleme_ayarlari (Backup Settings - 7 days)
CREATE TABLE IF NOT EXISTS yedekleme_ayarlari (
    id SERIAL,
    gun INTEGER NOT NULL, -- 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
    saat VARCHAR(5) NOT NULL, -- HH:mm formatında
    aktif BOOLEAN DEFAULT FALSE,
    yedekleme_tipi VARCHAR(50) DEFAULT 'full',
    saklama_suresi INTEGER DEFAULT 30, -- Gün cinsinden
    CONSTRAINT pk_yedekleme_ayarlari PRIMARY KEY (id),
    CONSTRAINT uq_yedekleme_ayarlari_gun UNIQUE (gun)
);

-- Table: zamanlanmis_gorevler (Scheduled Tasks)
CREATE TABLE IF NOT EXISTS zamanlanmis_gorevler (
    id SERIAL,
    gorev_adi VARCHAR(255) NOT NULL,
    gorev_tipi VARCHAR(50) NOT NULL, -- 'yedekleme', 'sms', 'rapor', vb.
    zamanlama VARCHAR(255) NOT NULL, -- Cron expression veya 'daily', 'weekly', vb.
    aktif BOOLEAN DEFAULT TRUE,
    son_calistirma TIMESTAMP,
    sonraki_calistirma TIMESTAMP,
    parametreler JSONB, -- Flexible parameters
    CONSTRAINT pk_zamanlanmis_gorevler PRIMARY KEY (id)
);

-- Table: arac_yakit (Vehicle Fuel Tracking)
-- NOT: takip_yakit tablosu zaten mevcut (satır 1967), bu tablo daha detaylı yakıt takibi için
CREATE TABLE IF NOT EXISTS arac_yakit (
    id SERIAL,
    id_arac INTEGER NOT NULL,
    yakit_tarihi DATE NOT NULL,
    yakit_tutari DECIMAL(10, 2) NOT NULL,
    yakit_miktari DECIMAL(10, 2) NOT NULL, -- Litre
    yakit_tipi VARCHAR(50), -- Benzin, Dizel, LPG, Elektrik
    km_baslangic INTEGER,
    km_bitis INTEGER,
    km_fark INTEGER, -- km_bitis - km_baslangic
    litre_basina_km DECIMAL(10, 2), -- km_fark / yakit_miktari
    yakit_istasyonu VARCHAR(255),
    faturano VARCHAR(100),
    id_personel INTEGER, -- Yakıt alan personel
    notlar TEXT,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_arac_yakit PRIMARY KEY (id)
);

-- Table: kursiyer_odeme_kefil
CREATE TABLE IF NOT EXISTS kursiyer_odeme_kefil (
    id SERIAL,
    id_kursiyer INTEGER,
    CONSTRAINT pk_kursiyer_odeme_kefil PRIMARY KEY (id)
);

-- Table: linkler
CREATE TABLE IF NOT EXISTS linkler (
    id SERIAL,
    sira INTEGER,
    CONSTRAINT pk_linkler PRIMARY KEY (id)
);

-- Table: muhasebe
CREATE TABLE IF NOT EXISTS muhasebe (
    id SERIAL,
    id_kursiyer INTEGER,
    id_personel INTEGER,
    id_referans INTEGER,
    kasa INTEGER,
    vade_tarihi DATE,
    tutar TEXT,
    odeme_tarihi DATE,
    kul_tarih DATE,
    durum_kendisi BOOLEAN,
    kayit_durumu INTEGER,
    akt INTEGER,
    personel_yil INTEGER
);

-- Table: muhasebe_temp
CREATE TABLE IF NOT EXISTS muhasebe_temp (
    id SERIAL,
    gelir_kurs_ucreti TEXT,
    gelir_harclar TEXT,
    gelir_dosyamasrafi TEXT,
    gelir_kitapcd TEXT,
    gelir_referans TEXT,
    gelir_danismanlik TEXT,
    gelir_psikoteknik TEXT,
    gelir_muafiyet TEXT,
    gelir_ozelders TEXT,
    gelir_gelir TEXT,
    gelir_gelir_diger TEXT,
    gelir_toplam TEXT,
    tur_pesinat TEXT,
    tur_nakit TEXT,
    tur_banka_pos TEXT,
    tur_banka_havale TEXT,
    tur_postaptt TEXT,
    tur_cek TEXT,
    tur_toplam TEXT,
    gider_personel TEXT,
    gider_iade TEXT,
    gider_banka_komisyon TEXT,
    gider_diger_giderler TEXT,
    gider_kurs_yatirdi TEXT,
    gider_toplam TEXT,
    devir_dun_nakit TEXT,
    devir_dun_banka TEXT,
    devir_dun_posta TEXT,
    bugun_nakit TEXT,
    bugun_banka TEXT,
    bugun_posta TEXT,
    bugun_cek TEXT,
    devir_yarin_nakit TEXT,
    devir_yarin_banka TEXT,
    devir_yarin_posta TEXT,
    devir_yarin TEXT,
    fatura_acik TEXT,
    fatura_kapali TEXT,
    fatura_iptal TEXT,
    takip_takip TEXT,
    takip_avukatta TEXT,
    takip_cekler TEXT,
    gunu_gecmis_alacaklar TEXT,
    gelecek_alacaklar TEXT,
    genel_alacak_toplami TEXT,
    CONSTRAINT pk_muhasebe_temp PRIMARY KEY (id)
);

-- Table: new_direksiyon_kontrol
CREATE TABLE IF NOT EXISTS new_direksiyon_kontrol (
    id SERIAL,
    id_direksiyon_no INTEGER,
    id_kursiyer INTEGER,
    id_personel INTEGER,
    id_arac INTEGER,
    egitim_hafta INTEGER,
    egitim_tarihi DATE,
    yil INTEGER
);

-- Table: new_direksiyon_mebbis
CREATE TABLE IF NOT EXISTS new_direksiyon_mebbis (
    id SERIAL,
    id_direksiyon_no INTEGER,
    id_kursiyer INTEGER,
    id_personel INTEGER,
    id_arac INTEGER,
    ge_aday_no INTEGER,
    ge_durumu INTEGER
);

-- Table: new_direksiyon_muaf
CREATE TABLE IF NOT EXISTS new_direksiyon_muaf (
    id SERIAL,
    sec BOOLEAN,
    id_personel INTEGER,
    id_arac INTEGER,
    egitim_tarihi DATE
);

-- Table: new_direksiyon_programi
CREATE TABLE IF NOT EXISTS new_direksiyon_programi (
    id SERIAL,
    id_direksiyon_no INTEGER,
    id_kursiyer INTEGER,
    t1_simulator DATE,
    p1_simulator INTEGER,
    a1_simulator INTEGER,
    t2_simulator DATE,
    p2_simulator INTEGER,
    a2_simulator INTEGER,
    t1_dir_egt_yeri DATE,
    p1_dir_egt_yeri INTEGER,
    a1_dir_egt_yeri INTEGER,
    t2_dir_egt_yeri DATE,
    p2_dir_egt_yeri INTEGER,
    a2_dir_egt_yeri INTEGER,
    t1 DATE,
    t2 DATE,
    t3 DATE,
    t4 DATE,
    t5 DATE,
    t6 DATE,
    t7 DATE,
    t8 DATE,
    t9 DATE,
    t10 DATE,
    t11 DATE,
    t12 DATE,
    t13 DATE,
    t14 DATE,
    t15 DATE,
    t16 DATE,
    t17 DATE,
    t18 DATE,
    t19 DATE,
    t20 DATE,
    t21 DATE,
    t22 DATE,
    t23 DATE,
    t24 DATE,
    t25 DATE,
    id_per_1 INTEGER,
    id_per_2 INTEGER,
    id_per_3 INTEGER,
    id_per_4 INTEGER,
    id_per_5 INTEGER,
    id_per_6 INTEGER,
    id_per_7 INTEGER,
    id_per_8 INTEGER,
    id_per_9 INTEGER,
    id_per_10 INTEGER,
    id_per_11 INTEGER,
    id_per_12 INTEGER,
    id_per_13 INTEGER,
    id_per_14 INTEGER,
    id_per_15 INTEGER,
    id_per_16 INTEGER,
    id_per_17 INTEGER,
    id_per_18 INTEGER,
    id_per_19 INTEGER,
    id_per_20 INTEGER,
    id_per_21 INTEGER,
    id_per_22 INTEGER,
    id_per_23 INTEGER,
    id_per_24 INTEGER,
    id_per_25 INTEGER,
    id_arac1 INTEGER,
    id_arac2 INTEGER,
    id_arac3 INTEGER,
    id_arac4 INTEGER,
    id_arac5 INTEGER,
    id_arac6 INTEGER,
    id_arac7 INTEGER,
    id_arac8 INTEGER,
    id_arac9 INTEGER,
    id_arac10 INTEGER,
    id_arac11 INTEGER,
    id_arac12 INTEGER,
    id_arac13 INTEGER,
    id_arac14 INTEGER,
    id_arac15 INTEGER,
    id_arac16 INTEGER,
    id_arac17 INTEGER,
    id_arac18 INTEGER,
    id_arac19 INTEGER,
    id_arac20 INTEGER,
    id_arac21 INTEGER,
    id_arac22 INTEGER,
    id_arac23 INTEGER,
    id_arac24 INTEGER,
    id_arac25 INTEGER,
    toplam_saat INTEGER
);

-- Table: new_direksiyon_yazici
CREATE TABLE IF NOT EXISTS new_direksiyon_yazici (
    id SERIAL,
    id_direksiyon_no INTEGER,
    id_kursiyer INTEGER,
    t1_simulator DATE,
    p1_simulator INTEGER,
    a1_simulator INTEGER,
    t2_simulator DATE,
    p2_simulator INTEGER,
    a2_simulator INTEGER,
    t1_dir_egt_yeri DATE,
    p1_dir_egt_yeri INTEGER,
    a1_dir_egt_yeri INTEGER,
    t2_dir_egt_yeri DATE,
    p2_dir_egt_yeri INTEGER,
    a2_dir_egt_yeri INTEGER,
    t1 DATE,
    t2 DATE,
    t3 DATE,
    t4 DATE,
    t5 DATE,
    t6 DATE,
    t7 DATE,
    t8 DATE,
    t9 DATE,
    t10 DATE,
    t11 DATE,
    t12 DATE,
    t13 DATE,
    t14 DATE,
    t15 DATE,
    t16 DATE,
    t17 DATE,
    t18 DATE,
    t19 DATE,
    t20 DATE,
    t21 DATE,
    t22 DATE,
    t23 DATE,
    t24 DATE,
    t25 DATE,
    id_per_1 INTEGER,
    id_per_2 INTEGER,
    id_per_3 INTEGER,
    id_per_4 INTEGER,
    id_per_5 INTEGER,
    id_per_6 INTEGER,
    id_per_7 INTEGER,
    id_per_8 INTEGER,
    id_per_9 INTEGER,
    id_per_10 INTEGER,
    id_per_11 INTEGER,
    id_per_12 INTEGER,
    id_per_13 INTEGER,
    id_per_14 INTEGER,
    id_per_15 INTEGER,
    id_per_16 INTEGER,
    id_per_17 INTEGER,
    id_per_18 INTEGER,
    id_per_19 INTEGER,
    id_per_20 INTEGER,
    id_per_21 INTEGER,
    id_per_22 INTEGER,
    id_per_23 INTEGER,
    id_per_24 INTEGER,
    id_per_25 INTEGER,
    id_arac1 INTEGER,
    id_arac2 INTEGER,
    id_arac3 INTEGER,
    id_arac4 INTEGER,
    id_arac5 INTEGER,
    id_arac6 INTEGER,
    id_arac7 INTEGER,
    id_arac8 INTEGER,
    id_arac9 INTEGER,
    id_arac10 INTEGER,
    id_arac11 INTEGER,
    id_arac12 INTEGER,
    id_arac13 INTEGER,
    id_arac14 INTEGER,
    id_arac15 INTEGER,
    id_arac16 INTEGER,
    id_arac17 INTEGER,
    id_arac18 INTEGER,
    id_arac19 INTEGER,
    id_arac20 INTEGER,
    id_arac21 INTEGER,
    id_arac22 INTEGER,
    id_arac23 INTEGER,
    id_arac24 INTEGER,
    id_arac25 INTEGER,
    toplam_saat INTEGER
);

-- Table: new_teorik_program
CREATE TABLE IF NOT EXISTS new_teorik_program (
    id SERIAL,
    id_direksiyon_no INTEGER,
    id_grup INTEGER,
    tarih DATE,
    id_personel_1 INTEGER,
    id_personel_2 INTEGER,
    id_personel_3 INTEGER,
    id_personel_4 INTEGER,
    id_personel_5 INTEGER,
    id_personel_6 INTEGER,
    id_personel_7 INTEGER,
    id_personel_8 INTEGER
);

-- Table: new_teorik_program_konular
CREATE TABLE IF NOT EXISTS new_teorik_program_konular (
    id SERIAL,
    ders_sirasi INTEGER
);

-- Table: new_teorik_program_mebbis
CREATE TABLE IF NOT EXISTS new_teorik_program_mebbis (
    id SERIAL,
    id_grup INTEGER,
    id_personel INTEGER,
    aktarim_durumu BOOLEAN
);

-- Table: new_teorik_program_temp
CREATE TABLE IF NOT EXISTS new_teorik_program_temp (
    id SERIAL,
    id_grup INTEGER,
    donem_baslama DATE,
    donem_bitis DATE,
    egitim_tarihi DATE,
    egitim_saat_toplam INTEGER,
    CONSTRAINT pk_new_teorik_program_temp PRIMARY KEY (id)
);

-- Table: on_gorusme
CREATE TABLE IF NOT EXISTS on_gorusme (
    id SERIAL,
    id_gorusen_personel INTEGER,
    tarih DATE,
    dogum_tarihi DATE,
    kurs_ucreti TEXT,
    t_sinav_harci TEXT,
    kitap_ucreti TEXT,
    d_sinav_harci TEXT,
    CONSTRAINT pk_on_gorusme PRIMARY KEY (id)
);

-- Table: param_arac_bakim
CREATE TABLE IF NOT EXISTS param_arac_bakim (
    id SERIAL,
    bakim_tarihi DATE,
    bakim_tutari TEXT
);

-- Table: param_arac_bakim_listesi
CREATE TABLE IF NOT EXISTS param_arac_bakim_listesi (
    id SERIAL
);

-- Table: param_arac_ceza
CREATE TABLE IF NOT EXISTS param_arac_ceza (
    id SERIAL,
    ceza_tarihi DATE,
    ceza_teblig_tarihi DATE,
    ceza_tutari TEXT,
    ceza_odeme_tarihi DATE,
    ceza_odeme_tutari TEXT
);

-- Table: param_arac_tanimlari
CREATE TABLE IF NOT EXISTS param_arac_tanimlari (
    id SERIAL,
    arac_tescil_tar DATE,
    hiz_bas_tar DATE,
    muhayene_tar DATE,
    sigorta_bas_tar DATE,
    kasko_bas_tar DATE,
    kasko_bit_tar DATE,
    kasko_isl_bedeli TEXT,
    sigorta_bit_tar DATE,
    akt INTEGER,
    CONSTRAINT pk_param_arac_tanimlari PRIMARY KEY (id)
);

-- Table: param_banka_tanimlari
CREATE TABLE IF NOT EXISTS param_banka_tanimlari (
    id SERIAL,
    durumu BOOLEAN,
    CONSTRAINT pk_param_banka_tanimlari PRIMARY KEY (id)
);

-- Table: param_direksiyon_saat
CREATE TABLE IF NOT EXISTS param_direksiyon_saat (
    id SERIAL,
    CONSTRAINT pk_param_direksiyon_saat PRIMARY KEY (id)
);

-- Table: param_durum
CREATE TABLE IF NOT EXISTS param_durum (
    id SERIAL,
    kod INTEGER NOT NULL,
    CONSTRAINT pk_param_durum PRIMARY KEY (id)
);

-- Table: param_excel_alanlari
CREATE TABLE IF NOT EXISTS param_excel_alanlari (
    id SERIAL,
    CONSTRAINT pk_param_excel_alanlari PRIMARY KEY (id)
);

-- Table: param_genel_parametreler
CREATE TABLE IF NOT EXISTS param_genel_parametreler (
    id SERIAL,
    son_refno INTEGER,
    check_minimum BOOLEAN,
    minimum_tutar TEXT,
    check_maksimum_taksit_say BOOLEAN,
    maksimum_taksit_say INTEGER,
    ref_varsayilan_kdv INTEGER,
    ref_varsayilan_isk INTEGER,
    kurs_varsayilan_kdv INTEGER,
    kurs_varsayilan_isk INTEGER,
    CONSTRAINT pk_param_genel_parametreler PRIMARY KEY (id)
);

-- Table: param_hesap_plani
CREATE TABLE IF NOT EXISTS param_hesap_plani (
    id SERIAL,
    CONSTRAINT pk_param_hesap_plani PRIMARY KEY (id)
);

-- Table: param_il
CREATE TABLE IF NOT EXISTS param_il (
    id SERIAL,
    il_kodu INTEGER,
    CONSTRAINT pk_param_il PRIMARY KEY (id)
);

-- Table: param_ilce
CREATE TABLE IF NOT EXISTS param_ilce (
    id SERIAL,
    il_kodu INTEGER,
    CONSTRAINT pk_param_ilce PRIMARY KEY (id)
);

-- Table: param_ilce_milliegitim
CREATE TABLE IF NOT EXISTS param_ilce_milliegitim (
    id SERIAL,
    CONSTRAINT pk_param_ilce_milliegitim PRIMARY KEY (id)
);

-- Table: param_kasa_ozel_alanlar
CREATE TABLE IF NOT EXISTS param_kasa_ozel_alanlar (
    id SERIAL,
    alan_kodu INTEGER,
    CONSTRAINT pk_param_kasa_ozel_alanlar PRIMARY KEY (id)
);

-- Table: param_kursbilgileri
CREATE TABLE IF NOT EXISTS param_kursbilgileri (
    id SERIAL,
    kurs_izin_tarihi DATE,
    egitime_bas_tar DATE,
    CONSTRAINT pk_param_kursbilgileri PRIMARY KEY (id)
);

-- Table: param_oto_sms
CREATE TABLE IF NOT EXISTS param_oto_sms (
    id SERIAL,
    vadesi_gelenler BOOLEAN,
    personel_sozlesme BOOLEAN,
    dogum_kursiyer BOOLEAN,
    durum_kursiyer BOOLEAN,
    dogum_personel BOOLEAN,
    durum_personel BOOLEAN,
    sms_1_karak BOOLEAN,
    sms_2_karak BOOLEAN,
    sms_3_karak BOOLEAN,
    sms_4_karak BOOLEAN,
    CONSTRAINT pk_param_oto_sms PRIMARY KEY (id)
);

-- Table: param_ozel_kodlar
CREATE TABLE IF NOT EXISTS param_ozel_kodlar (
    id SERIAL,
    kod_durumu INTEGER,
    CONSTRAINT pk_param_ozel_kodlar PRIMARY KEY (id)
);

-- Table: param_ozeldireksiyon_saatler
CREATE TABLE IF NOT EXISTS param_ozeldireksiyon_saatler (
    id SERIAL,
    CONSTRAINT pk_param_ozeldireksiyon_saatler PRIMARY KEY (id)
);

-- Table: param_settings
CREATE TABLE IF NOT EXISTS param_settings (
    id SERIAL,
    ara_tcno_gizle BOOLEAN,
    ara_baba_gizle BOOLEAN,
    ara_borc_gizle BOOLEAN,
    ara_onse_gizle BOOLEAN,
    ara_sert_gizle BOOLEAN,
    ara_grup_gizle BOOLEAN,
    ara_kayi_gizle BOOLEAN,
    ara_gsm_gizle BOOLEAN,
    ara_ozk1_gizle BOOLEAN,
    ara_ozk2_gizle BOOLEAN,
    ara_risk_gizle BOOLEAN,
    tum_kursiyerler BOOLEAN,
    arsiv_kursiyerler BOOLEAN,
    gelir_gider_makbuzkes BOOLEAN,
    gelir_gider_devir_hesapla BOOLEAN,
    kasa_devir_tarihi DATE,
    makbuz_kes BOOLEAN,
    bank_odeme_oto_faturano BOOLEAN,
    banka_mahsup_durumu BOOLEAN,
    odemelerde_sms_gonder BOOLEAN,
    dir_gece_egitimi_durumu BOOLEAN,
    dir_pazartesi BOOLEAN,
    dir_sali BOOLEAN,
    dir_carsamba BOOLEAN,
    dir_persembe BOOLEAN,
    dir_cuma BOOLEAN,
    dir_cumartesi BOOLEAN,
    dir_pazar BOOLEAN,
    dir_simulator BOOLEAN,
    dir_egitimala BOOLEAN,
    dir_tarih1 DATE,
    dir_tarih2 DATE,
    dir_prg_tatil BOOLEAN,
    dir_1gunde_1personel INTEGER,
    dir_1gunde_1arac INTEGER,
    dir_ders_prg_knt_limit INTEGER,
    plaka_gizle_1 BOOLEAN,
    plaka_gizle_2 BOOLEAN,
    plaka_gizle_3 BOOLEAN,
    plaka_gizle_4 BOOLEAN,
    plaka_gizle_5 BOOLEAN,
    plaka_gizle_6 BOOLEAN,
    plaka_gizle_7 BOOLEAN,
    plaka_gizle_8 BOOLEAN,
    plaka_gizle_9 BOOLEAN,
    plaka_gizle_10 BOOLEAN,
    plaka_gizle_11 BOOLEAN,
    plaka_gizle_12 BOOLEAN,
    plaka_gizle_13 BOOLEAN,
    plaka_gizle_14 BOOLEAN,
    plaka_gizle_15 BOOLEAN,
    on_grs_kesin_kayitlar BOOLEAN,
    ozel_dir_der_egitimi_bitenler BOOLEAN,
    aday_no_hemen_ver BOOLEAN,
    web_gunun_tarihi DATE,
    knt_guncellemeler BOOLEAN,
    program_kullanilmadiginda BOOLEAN,
    program_kullanilmadiginda_dak INTEGER,
    r_durumu INTEGER,
    karsilama_sms_durumu BOOLEAN,
    sinav_notlarini_gosterme BOOLEAN,
    pers_soz_uyari_gunu INTEGER,
    acilista_gunluk_islemler_durumu BOOLEAN,
    son_dir_ders INTEGER,
    hizli_kayit_dur BOOLEAN,
    rapor_durumu BOOLEAN,
    evraklarda_resim_onizleme BOOLEAN,
    ozel_pers BOOLEAN,
    ozel_arac BOOLEAN,
    ozel_aciklama BOOLEAN,
    ozel_gecmisigizle BOOLEAN,
    ikinci_gsm_durumu BOOLEAN,
    snv_list_odeme_durumu BOOLEAN,
    ozel_tarih1 DATE,
    ozel_tarih2 DATE,
    ara_referans_gizle BOOLEAN,
    oto_borc_ekle BOOLEAN,
    mebresak BOOLEAN,
    maas_tar1 DATE,
    maas_tar2 DATE,
    sube_tahsilat_durumu BOOLEAN,
    otom_sms_esinav_durumu BOOLEAN,
    kasa_gelir_sms_gonder BOOLEAN,
    kasa_gider_sms_gonder BOOLEAN,
    referans_odemeleri_sms_gonder BOOLEAN,
    knt_kurumsal_borclar BOOLEAN,
    mrs_oto_adres_drm BOOLEAN,
    bilgiledirme_durumu BOOLEAN,
    arama_kriter_durumu BOOLEAN,
    knt_15_gun_basvuru BOOLEAN,
    knt_45_gun_hak_yak BOOLEAN,
    knt_45_gune_yaklasan BOOLEAN,
    knt_45_gune_yaklasan_gunsayisi INTEGER,
    knt_5_gun_yapilmayan BOOLEAN,
    knt_5_gun_yapilmayan_gunsayisi INTEGER,
    knt_esinava_yakin BOOLEAN,
    knt_esinava_yakin_gunsayisi INTEGER,
    knt_drksinava_yakin BOOLEAN,
    knt_drksinava_yakin_gunsayisi INTEGER,
    knt_dersprg_bittiginde BOOLEAN,
    knt_pers_sozlesme BOOLEAN,
    knt_pers_sozlesme_gunsayisi INTEGER,
    knt_arac_sigorta BOOLEAN,
    knt_arac_sigorta_gunsayisi INTEGER,
    ara_odenen_gizle BOOLEAN,
    ara_kalan_gizle BOOLEAN,
    ara_sinavasama_gizle BOOLEAN,
    hsp_dosya_masrafi BOOLEAN,
    hsp_psikoteknik BOOLEAN,
    hsp_danismanlik BOOLEAN,
    hsp_ozel_ders BOOLEAN,
    hsp_muafiyet BOOLEAN,
    hsp_kitapcd BOOLEAN,
    hsp_t_harc BOOLEAN,
    hsp_u_harc BOOLEAN,
    hsp_ikinci_drks BOOLEAN,
    hsp_basarisiz_egt BOOLEAN,
    hsp_diger BOOLEAN,
    pers_devir_knt BOOLEAN,
    ara_subeler_gizle INTEGER,
    mebbis_ucret_durumu BOOLEAN,
    CONSTRAINT pk_param_settings PRIMARY KEY (id)
);

-- Table: param_simulator_tanimlari
CREATE TABLE IF NOT EXISTS param_simulator_tanimlari (
    id SERIAL,
    CONSTRAINT pk_param_simulator_tanimlari PRIMARY KEY (id)
);

-- Table: param_siniflar
CREATE TABLE IF NOT EXISTS param_siniflar (
    id SERIAL,
    sinif_durumu BOOLEAN,
    sinif_kurs_ucreti TEXT,
    sinif_teori_ucreti TEXT,
    sinif_drks_ucreti TEXT,
    sinif_teori_1saat_ucreti TEXT,
    sinif_teori_top_ucreti TEXT,
    sinif_drks_1saat_ucreti TEXT,
    sinif_drks_top_ucreti TEXT,
    sinif_taban_fiyat TEXT,
    sert_2016_oncesi BOOLEAN,
    yuz_yirmi_bes_cc BOOLEAN,
    e_sinav_muaf BOOLEAN,
    CONSTRAINT pk_param_siniflar PRIMARY KEY (id)
);

-- Table: param_sms_ayarlari
CREATE TABLE IF NOT EXISTS param_sms_ayarlari (
    id SERIAL,
    sms_bil_yeni_kayit BOOLEAN,
    sms_bil_kursiyer_odeme BOOLEAN,
    sms_bil_referans_odeme BOOLEAN,
    sms_bil_gelir BOOLEAN,
    sms_bil_gider BOOLEAN,
    sms_bil_odeme_degisiklik BOOLEAN,
    sms_kur_karsilama_sms_durumu BOOLEAN,
    sms_kur_odeme_durumu BOOLEAN,
    sms_kur_dogum_gunu_pazar_durumu BOOLEAN,
    sms_kur_e_sinav_bil_durumu BOOLEAN,
    sms_kur_e_sinav_giris_bel_durumu BOOLEAN,
    sms_kur_drks_sinav_giris_bel_durumu BOOLEAN,
    sms_kur_gsm_2_durumu BOOLEAN,
    CONSTRAINT pk_param_sms_ayarlari PRIMARY KEY (id)
);

-- Table: param_sms_basliklari
CREATE TABLE IF NOT EXISTS param_sms_basliklari (
    id SERIAL,
    CONSTRAINT pk_param_sms_basliklari PRIMARY KEY (id)
);

-- Table: param_sms_gonderilmis
CREATE TABLE IF NOT EXISTS param_sms_gonderilmis (
    id SERIAL,
    id_kursiyer INTEGER,
    id_referans INTEGER,
    id_personel INTEGER,
    sec BOOLEAN,
    mesaj_tarihi DATE,
    CONSTRAINT pk_param_sms_gonderilmis PRIMARY KEY (id)
);

-- Table: param_sms_grup
CREATE TABLE IF NOT EXISTS param_sms_grup (
    id SERIAL,
    id_kursiyer INTEGER,
    id_referans INTEGER,
    id_personel INTEGER,
    grup_mesajtarihi DATE,
    CONSTRAINT pk_param_sms_grup PRIMARY KEY (id)
);

-- Table: param_sms_sablonlar
CREATE TABLE IF NOT EXISTS param_sms_sablonlar (
    id SERIAL,
    CONSTRAINT pk_param_sms_sablonlar PRIMARY KEY (id)
);

-- Table: param_tatil_tanimlari
CREATE TABLE IF NOT EXISTS param_tatil_tanimlari (
    id SERIAL,
    baslangic_tarihi DATE,
    CONSTRAINT pk_param_tatil_tanimlari PRIMARY KEY (id)
);

-- Table: param_teori_ders_onaylayan
CREATE TABLE IF NOT EXISTS param_teori_ders_onaylayan (
    id SERIAL,
    CONSTRAINT pk_param_teori_ders_onaylayan PRIMARY KEY (id)
);

-- Table: param_vtsube
CREATE TABLE IF NOT EXISTS param_vtsube (
    id SERIAL,
    kontrol_user BOOLEAN,
    sec BOOLEAN,
    CONSTRAINT pk_param_vtsube PRIMARY KEY (id)
);

-- Table: param_yedek
CREATE TABLE IF NOT EXISTS param_yedek (
    id SERIAL,
    pazartesi INTEGER,
    sali INTEGER,
    carsamba INTEGER,
    persembe INTEGER,
    cuma INTEGER,
    cumartesi INTEGER,
    pazar INTEGER,
    son_kac_yedek INTEGER,
    CONSTRAINT pk_param_yedek PRIMARY KEY (id)
);

-- Table: personel
CREATE TABLE IF NOT EXISTS personel (
    id SERIAL,
    id_egitim_araci INTEGER,
    kayit_tarihi DATE,
    personel_no INTEGER,
    dogum_tarihi DATE,
    resim TEXT,
    kim_verilis_tarihi DATE,
    bir_ders_saat_uc TEXT,
    aylik_ucret TEXT,
    yonetici_ucreti TEXT,
    is_gucu_zammi TEXT,
    ek_odeme TEXT,
    brut_odemeler_top TEXT,
    net_odemeler_top TEXT,
    calisma_izin_tar DATE,
    gorev_bas_tarihi DATE,
    calisma_izin_uz_tar DATE,
    soz_tanzim_tar DATE,
    soz_baslama_tar DATE,
    soz_bitis_tar DATE,
    ehliyet_ver_tarihi DATE,
    gorevli_saatlik_ucret_1 TEXT,
    gorevli_aylik_ucret_1 TEXT,
    gorevli_saatlik_ucret_2 TEXT,
    gorevli_aylik_ucret_2 TEXT,
    ayrilmis_tarihi DATE,
    emekli_tarihi DATE,
    hizmet_bas_tar_1 DATE,
    hizmet_bas_tar_2 DATE,
    hizmet_bas_tar_3 DATE,
    hizmet_bit_tar_1 DATE,
    hizmet_bit_tar_2 DATE,
    hizmet_bit_tar_3 DATE,
    oncelik INTEGER,
    heray_date1 DATE,
    heray_date2 DATE,
    pers_izin_tarihi1 DATE,
    pers_izin_tarihi2 DATE,
    pers_izin_tarihi3 DATE,
    pers_izin_tarihi4 DATE,
    pers_izin_tarihi5 DATE,
    pers_izin_tarihi6 DATE,
    pers_izin_tarihi7 DATE,
    maas TEXT,
    haftalik_ders_saati_verdigi INTEGER,
    renk INTEGER,
    akt INTEGER,
    maas_onceki_ay TEXT,
    CONSTRAINT pk_personel PRIMARY KEY (id)
);

-- Table: rapor_listesi
CREATE TABLE IF NOT EXISTS rapor_listesi (
    id SERIAL,
    rapor_sira INTEGER,
    rapor_tipi BOOLEAN,
    renk INTEGER,
    CONSTRAINT pk_rapor_listesi PRIMARY KEY (id)
);

-- Table: referans_kart
CREATE TABLE IF NOT EXISTS referans_kart (
    id SERIAL,
    ref_sec BOOLEAN,
    ref_kayit_tarihi DATE,
    ref_kod INTEGER,
    CONSTRAINT pk_referans_kart PRIMARY KEY (id)
);

-- Table: resources
CREATE TABLE IF NOT EXISTS resources (
    uniqueid SERIAL,
    resourceid INTEGER NOT NULL,
    color INTEGER,
    image TEXT,
    CONSTRAINT pk_resources PRIMARY KEY (uniqueid)
);

-- Table: sinav_liste_direksiyon
CREATE TABLE IF NOT EXISTS sinav_liste_direksiyon (
    id SERIAL,
    id_sinav_tarihi INTEGER,
    id_kursiyer INTEGER,
    dir_hak INTEGER,
    id_personel INTEGER,
    dir_harc_tutari TEXT,
    borc_bakiye TEXT,
    id_arac INTEGER,
    dir_giris_teslim_tarh DATE,
    CONSTRAINT pk_sinav_liste_direksiyon PRIMARY KEY (id)
);

-- Table: sinav_liste_teori
CREATE TABLE IF NOT EXISTS sinav_liste_teori (
    id SERIAL,
    id_sinav_tarihi INTEGER,
    id_kursiyer INTEGER,
    teo_hak INTEGER,
    teo_harc_tutari TEXT,
    borc_bakiye TEXT,
    e_sinav_tarihi DATE,
    teo_giris_teslim_tarh DATE,
    CONSTRAINT pk_sinav_liste_teori PRIMARY KEY (id)
);

-- Table: sinav_tarihleri
CREATE TABLE IF NOT EXISTS sinav_tarihleri (
    id SERIAL,
    sinav_tarihi DATE,
    akt INTEGER,
    CONSTRAINT pk_sinav_tarihleri PRIMARY KEY (id)
);

-- Table: sinav_yerleri
CREATE TABLE IF NOT EXISTS sinav_yerleri (
    id SERIAL,
    CONSTRAINT pk_sinav_yerleri PRIMARY KEY (id)
);

-- Table: takip_yakit
CREATE TABLE IF NOT EXISTS takip_yakit (
    id SERIAL,
    id_arac INTEGER,
    id_personel INTEGER,
    islem_tarihi DATE,
    islem_tutari TEXT,
    CONSTRAINT pk_takip_yakit PRIMARY KEY (id)
);

-- Table: cari_firma
CREATE TABLE IF NOT EXISTS cari_firma (
    id SERIAL,
    firma_adi VARCHAR(255) NOT NULL,
    yetkili_kisi VARCHAR(255),
    telefon VARCHAR(50),
    email VARCHAR(255),
    adres TEXT,
    vergi_no VARCHAR(50),
    vergi_dairesi VARCHAR(255),
    notlar TEXT,
    akt INTEGER DEFAULT 1,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_cari_firma PRIMARY KEY (id)
);

-- Table: banka_hesabi
CREATE TABLE IF NOT EXISTS banka_hesabi (
    id SERIAL,
    banka_adi VARCHAR(255) NOT NULL,
    hesap_adi VARCHAR(255),
    hesap_no VARCHAR(100),
    iban VARCHAR(34),
    sube_adi VARCHAR(255),
    sube_kodu VARCHAR(50),
    bakiye DECIMAL(15, 2) DEFAULT 0,
    notlar TEXT,
    akt INTEGER DEFAULT 1,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_banka_hesabi PRIMARY KEY (id)
);

-- Table: banka_islemi
CREATE TABLE IF NOT EXISTS banka_islemi (
    id SERIAL,
    id_banka_hesabi INTEGER NOT NULL,
    islem_tarihi DATE NOT NULL,
    islem_tipi VARCHAR(10) NOT NULL CHECK (islem_tipi IN ('giris', 'cikis')),
    tutar DECIMAL(15, 2) NOT NULL,
    aciklama TEXT,
    id_kursiyer INTEGER,
    id_fatura INTEGER,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_banka_islemi PRIMARY KEY (id),
    CONSTRAINT fk_banka_islemi_hesap FOREIGN KEY (id_banka_hesabi) REFERENCES banka_hesabi(id)
);

-- Table: hizmet
CREATE TABLE IF NOT EXISTS hizmet (
    id SERIAL,
    hizmet_adi VARCHAR(255) NOT NULL,
    hizmet_tipi VARCHAR(100),
    birim_fiyat DECIMAL(15, 2),
    aciklama TEXT,
    akt INTEGER DEFAULT 1,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_hizmet PRIMARY KEY (id)
);

-- Table: not_defteri (User Notes)
CREATE TABLE IF NOT EXISTS not_defteri (
    id SERIAL,
    id_kullanici INTEGER NOT NULL,
    not_baslik VARCHAR(255),
    not_icerik TEXT NOT NULL,
    aciklama TEXT,
    alarm_tarihi DATE,
    sabitli BOOLEAN DEFAULT FALSE,
    tamamlandi BOOLEAN DEFAULT FALSE,
    sira INTEGER DEFAULT 0,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP,
    CONSTRAINT pk_not_defteri PRIMARY KEY (id)
);

-- Table: vade_tarihi (Due Date Tracking)
CREATE TABLE IF NOT EXISTS vade_tarihi (
    id SERIAL,
    id_kursiyer INTEGER,
    id_muhasebe INTEGER,
    vade_tarihi DATE NOT NULL,
    tutar DECIMAL(15, 2),
    aciklama TEXT,
    odendi BOOLEAN DEFAULT FALSE,
    odeme_tarihi DATE,
    hatirlatma_gonderildi BOOLEAN DEFAULT FALSE,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_vade_tarihi PRIMARY KEY (id)
);

-- Table: gorusme_kontrol (Meeting Control)
CREATE TABLE IF NOT EXISTS gorusme_kontrol (
    id SERIAL,
    id_kursiyer INTEGER,
    id_personel INTEGER,
    gorusme_tarihi DATE NOT NULL,
    gorusme_saati TIME,
    gorusme_konusu VARCHAR(255),
    gorusme_notlari TEXT,
    sonuc VARCHAR(100), -- 'olumlu', 'olumsuz', 'beklemede'
    sonraki_gorusme_tarihi DATE,
    tamamlandi BOOLEAN DEFAULT FALSE,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_gorusme_kontrol PRIMARY KEY (id)
);

-- Eksik Tablolar - Modül Tamamlama İçin
-- Bu dosya supabase_migration.sql'e eklenecek

-- Table: sinav_notlari (Exam Grades)
CREATE TABLE IF NOT EXISTS sinav_notlari (
    id SERIAL,
    id_kursiyer INTEGER NOT NULL,
    id_sinav_tarihi INTEGER,
    sinav_turu VARCHAR(20) NOT NULL CHECK (sinav_turu IN ('teorik', 'uygulama', 'direksiyon')),
    sinav_notu INTEGER,
    sinav_durumu VARCHAR(20) CHECK (sinav_durumu IN ('gecti', 'kaldi', 'beklemede')),
    sinav_tarihi DATE NOT NULL,
    kaynak VARCHAR(20) CHECK (kaynak IN ('mebbisten', 'sistemden')),
    aciklama TEXT,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP,
    CONSTRAINT pk_sinav_notlari PRIMARY KEY (id),
    CONSTRAINT fk_sinav_notlari_kursiyer FOREIGN KEY (id_kursiyer) REFERENCES kursiyer(id)
);

-- Table: kasa (Cash Register)
CREATE TABLE IF NOT EXISTS kasa (
    id SERIAL,
    kasa_adi VARCHAR(255) NOT NULL,
    kasa_kodu VARCHAR(50),
    bakiye DECIMAL(15, 2) DEFAULT 0,
    aciklama TEXT,
    akt INTEGER DEFAULT 1,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_kasa PRIMARY KEY (id)
);

-- Table: kasa_islemi (Cash Register Transactions)
CREATE TABLE IF NOT EXISTS kasa_islemi (
    id SERIAL,
    id_kasa INTEGER NOT NULL,
    islem_tarihi DATE NOT NULL,
    islem_tipi VARCHAR(10) NOT NULL CHECK (islem_tipi IN ('giris', 'cikis')),
    tutar DECIMAL(15, 2) NOT NULL,
    aciklama TEXT,
    id_kursiyer INTEGER,
    id_fatura INTEGER,
    id_personel INTEGER,
    odeme_yontemi VARCHAR(50), -- 'nakit', 'kredi_karti', 'banka', 'havale', 'cek'
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_kasa_islemi PRIMARY KEY (id),
    CONSTRAINT fk_kasa_islemi_kasa FOREIGN KEY (id_kasa) REFERENCES kasa(id)
);

-- Table: kasa_transfer (Cash Transfer Between Registers)
CREATE TABLE IF NOT EXISTS kasa_transfer (
    id SERIAL,
    id_kaynak_kasa INTEGER NOT NULL,
    id_hedef_kasa INTEGER NOT NULL,
    transfer_tarihi DATE NOT NULL,
    tutar DECIMAL(15, 2) NOT NULL,
    aciklama TEXT,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_kasa_transfer PRIMARY KEY (id),
    CONSTRAINT fk_kasa_transfer_kaynak FOREIGN KEY (id_kaynak_kasa) REFERENCES kasa(id),
    CONSTRAINT fk_kasa_transfer_hedef FOREIGN KEY (id_hedef_kasa) REFERENCES kasa(id)
);

-- Table: fatura (General Invoice)
CREATE TABLE IF NOT EXISTS fatura (
    id SERIAL,
    fatura_no VARCHAR(50) UNIQUE NOT NULL,
    fatura_tipi VARCHAR(20) NOT NULL CHECK (fatura_tipi IN ('satis', 'alis', 'satis_iade', 'alis_iade')),
    fatura_tarihi DATE NOT NULL,
    id_cari_firma INTEGER,
    id_kursiyer INTEGER,
    toplam_tutar DECIMAL(15, 2) NOT NULL,
    kdv_orani INTEGER DEFAULT 18,
    kdv_tutari DECIMAL(15, 2) DEFAULT 0,
    iskonto_orani INTEGER DEFAULT 0,
    iskonto_tutari DECIMAL(15, 2) DEFAULT 0,
    genel_toplam DECIMAL(15, 2) NOT NULL,
    durum VARCHAR(20) DEFAULT 'acik' CHECK (durum IN ('acik', 'kapali', 'iptal')),
    e_fatura_durumu VARCHAR(20) DEFAULT 'beklemede' CHECK (e_fatura_durumu IN ('beklemede', 'gonderildi', 'hata')),
    e_fatura_uuid VARCHAR(100),
    aciklama TEXT,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guncelleme_tarihi TIMESTAMP,
    CONSTRAINT pk_fatura PRIMARY KEY (id),
    CONSTRAINT fk_fatura_cari FOREIGN KEY (id_cari_firma) REFERENCES cari_firma(id),
    CONSTRAINT fk_fatura_kursiyer FOREIGN KEY (id_kursiyer) REFERENCES kursiyer(id)
);

-- Table: fatura_detay (Invoice Details)
CREATE TABLE IF NOT EXISTS fatura_detay (
    id SERIAL,
    id_fatura INTEGER NOT NULL,
    id_hizmet INTEGER,
    hizmet_adi VARCHAR(255),
    miktar INTEGER DEFAULT 1,
    birim_fiyat DECIMAL(15, 2) NOT NULL,
    tutar DECIMAL(15, 2) NOT NULL,
    kdv_orani INTEGER DEFAULT 18,
    kdv_tutari DECIMAL(15, 2) DEFAULT 0,
    aciklama TEXT,
    CONSTRAINT pk_fatura_detay PRIMARY KEY (id),
    CONSTRAINT fk_fatura_detay_fatura FOREIGN KEY (id_fatura) REFERENCES fatura(id) ON DELETE CASCADE,
    CONSTRAINT fk_fatura_detay_hizmet FOREIGN KEY (id_hizmet) REFERENCES hizmet(id)
);

-- Table: e_fatura_log (E-Invoice Logs)
CREATE TABLE IF NOT EXISTS e_fatura_log (
    id SERIAL,
    id_fatura INTEGER NOT NULL,
    islem_tipi VARCHAR(50), -- 'gonderim', 'iptal', 'guncelleme'
    durum VARCHAR(20), -- 'basarili', 'hata', 'beklemede'
    hata_mesaji TEXT,
    yanit_xml TEXT,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_e_fatura_log PRIMARY KEY (id),
    CONSTRAINT fk_e_fatura_log_fatura FOREIGN KEY (id_fatura) REFERENCES fatura(id)
);

-- Table: odeme_plani (Payment Plan)
CREATE TABLE IF NOT EXISTS odeme_plani (
    id SERIAL,
    id_kursiyer INTEGER NOT NULL,
    taksit_no INTEGER NOT NULL,
    taksit_adi VARCHAR(100),
    son_odeme_tarihi DATE NOT NULL,
    tutar DECIMAL(15, 2) NOT NULL,
    odeme_yontemi VARCHAR(50),
    durum VARCHAR(20) DEFAULT 'beklemede' CHECK (durum IN ('odendi', 'beklemede', 'gecikti')),
    odeme_tarihi DATE,
    id_kasa INTEGER,
    id_banka INTEGER,
    aciklama TEXT,
    kayit_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_odeme_plani PRIMARY KEY (id),
    CONSTRAINT fk_odeme_plani_kursiyer FOREIGN KEY (id_kursiyer) REFERENCES kursiyer(id)
);

-- Table: kursiyer_bakiye (Student Balance)
CREATE TABLE IF NOT EXISTS kursiyer_bakiye (
    id SERIAL,
    id_kursiyer INTEGER NOT NULL UNIQUE,
    borc DECIMAL(15, 2) DEFAULT 0,
    alacak DECIMAL(15, 2) DEFAULT 0,
    bakiye DECIMAL(15, 2) GENERATED ALWAYS AS (alacak - borc) STORED,
    hesap_turu VARCHAR(50), -- 'Kurs Ücreti', 'Teorik Sınav Ücreti', 'Uygulama Sınav Ücreti', 'Diğer'
    bakiye_turu VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN (alacak - borc) > 0 THEN 'alacak'
            WHEN (alacak - borc) < 0 THEN 'borc'
            ELSE 'sifir'
        END
    ) STORED,
    guncelleme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_kursiyer_bakiye PRIMARY KEY (id),
    CONSTRAINT fk_kursiyer_bakiye_kursiyer FOREIGN KEY (id_kursiyer) REFERENCES kursiyer(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sinav_notlari_kursiyer ON sinav_notlari(id_kursiyer);
CREATE INDEX IF NOT EXISTS idx_sinav_notlari_tarih ON sinav_notlari(sinav_tarihi);
CREATE INDEX IF NOT EXISTS idx_kasa_islemi_kasa ON kasa_islemi(id_kasa);
CREATE INDEX IF NOT EXISTS idx_kasa_islemi_tarih ON kasa_islemi(islem_tarihi);
CREATE INDEX IF NOT EXISTS idx_fatura_tarih ON fatura(fatura_tarihi);
CREATE INDEX IF NOT EXISTS idx_fatura_durum ON fatura(durum);
CREATE INDEX IF NOT EXISTS idx_odeme_plani_kursiyer ON odeme_plani(id_kursiyer);
CREATE INDEX IF NOT EXISTS idx_odeme_plani_durum ON odeme_plani(durum);

