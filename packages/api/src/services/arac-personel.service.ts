import { Arac, Personel, AracBakim, AracDurumRaporu } from '@mtsk/shared';
import {
  AracRepository,
  PersonelRepository,
  AracBakimRepository,
} from '../repositories/arac-personel.repository';

export class AracService {
  private aracRepo: AracRepository;
  private bakimRepo: AracBakimRepository;

  constructor() {
    this.aracRepo = new AracRepository();
    this.bakimRepo = new AracBakimRepository();
  }

  /**
   * Get all vehicles
   */
  async getAllVehicles(filters?: {
    plaka?: string;
    marka?: string;
    model?: string;
    arac_durumu?: string;
    durum?: string;
  }): Promise<Arac[]> {
    if (filters) {
      return this.aracRepo.findAll(filters);
    }
    return this.aracRepo.findAll();
  }

  /**
   * Get vehicle by ID
   */
  async getVehicleById(id: number): Promise<Arac | null> {
    return this.aracRepo.findById(id);
  }

  /**
   * Get vehicle by plaka
   */
  async getVehicleByPlaka(plaka: string): Promise<Arac | null> {
    return this.aracRepo.findByPlaka(plaka);
  }

  /**
   * Create new vehicle
   */
  async createVehicle(vehicle: Partial<Arac>): Promise<Arac> {
    return this.aracRepo.create(vehicle);
  }

  /**
   * Update vehicle
   */
  async updateVehicle(id: number, updates: Partial<Arac>): Promise<Arac> {
    return this.aracRepo.update(id, updates);
  }

  /**
   * Delete vehicle (soft delete - set akt = 0)
   */
  async deleteVehicle(id: number): Promise<void> {
    await this.aracRepo.update(id, { akt: 0 } as Partial<Arac>);
  }

  /**
   * Get vehicles needing maintenance
   */
  async getMaintenanceDue(daysAhead: number = 30): Promise<Arac[]> {
    return this.aracRepo.findMaintenanceDue(daysAhead);
  }

  /**
   * Get vehicles with insurance expiring
   */
  async getInsuranceExpiring(daysAhead: number = 30): Promise<Arac[]> {
    return this.aracRepo.findInsuranceExpiring(daysAhead);
  }

  /**
   * Get vehicle status report
   */
  async getVehicleStatusReport(): Promise<AracDurumRaporu[]> {
    return this.aracRepo.getStatusReport();
  }

  /**
   * Get maintenance history for vehicle
   */
  async getMaintenanceHistory(idArac: number): Promise<AracBakim[]> {
    return this.bakimRepo.findByArac(idArac);
  }

  /**
   * Add maintenance record
   */
  async addMaintenance(bakim: Partial<AracBakim>): Promise<AracBakim> {
    return this.bakimRepo.create(bakim);
  }

  /**
   * Get upcoming maintenance
   */
  async getUpcomingMaintenance(daysAhead: number = 30): Promise<AracBakim[]> {
    return this.bakimRepo.findUpcoming(daysAhead);
  }
}

export class PersonelService {
  private personelRepo: PersonelRepository;

  constructor() {
    this.personelRepo = new PersonelRepository();
  }

  /**
   * Get all personnel
   */
  async getAllPersonnel(filters?: {
    adi?: string;
    soyadi?: string;
    personel_no?: number;
    gorev?: string;
    durum?: string;
  }): Promise<Personel[]> {
    if (filters) {
      return this.personelRepo.findAll(filters);
    }
    return this.personelRepo.findAll();
  }

  /**
   * Get personnel by ID
   */
  async getPersonnelById(id: number): Promise<Personel | null> {
    return this.personelRepo.findById(id);
  }

  /**
   * Get personnel by personel_no
   */
  async getPersonnelByNo(personelNo: number): Promise<Personel | null> {
    return this.personelRepo.findByPersonelNo(personelNo);
  }

  /**
   * Search personnel by name
   */
  async searchPersonnel(searchTerm: string): Promise<Personel[]> {
    return this.personelRepo.searchByName(searchTerm);
  }

  /**
   * Create new personnel
   */
  async createPersonnel(personel: Partial<Personel>): Promise<Personel> {
    return this.personelRepo.create(personel);
  }

  /**
   * Update personnel
   */
  async updatePersonnel(id: number, updates: Partial<Personel>): Promise<Personel> {
    return this.personelRepo.update(id, updates);
  }

  /**
   * Delete personnel (soft delete - set akt = 0)
   */
  async deletePersonnel(id: number): Promise<void> {
    await this.personelRepo.update(id, { akt: 0 } as Partial<Personel>);
  }

  /**
   * Get active personnel
   */
  async getActivePersonnel(): Promise<Personel[]> {
    return this.personelRepo.findActive();
  }

  /**
   * Get personnel by gorev
   */
  async getPersonnelByGorev(gorev: string): Promise<Personel[]> {
    return this.personelRepo.findByGorev(gorev);
  }
}

