import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyService } from './pharmacy.service';
import { PharmacyRepository } from '../repositories/pharmacy.repository';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';

describe('PharmacyService', () => {
  let service: PharmacyService;
  let repository: PharmacyRepository;

  const mockPharmacyRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmacyService,
        {
          provide: PharmacyRepository,
          useValue: mockPharmacyRepository,
        },
      ],
    }).compile();

    service = module.get<PharmacyService>(PharmacyService);
    repository = module.get<PharmacyRepository>(PharmacyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPharmacy', () => {
    it('should create a new pharmacy', async () => {
      const createPharmacyDto: CreatePharmacyDto = {
        name: 'Test Pharmacy',
        address: '123 Test Street',
        phone: '1234567890',
        location: { lat: 10, lng: 20 },
        openingHours: { open_at: '08:00', close_at: '18:00' },
        is_guard: true,
      };

      mockPharmacyRepository.create.mockResolvedValue('12345');

      const result = await service.createPharmacy(createPharmacyDto);
      expect(result).toBe('12345');
      expect(mockPharmacyRepository.create).toHaveBeenCalledWith(createPharmacyDto);
    });
  });

  describe('getAllPharmacies', () => {
    it('should return an array of pharmacies', async () => {
      const pharmacies = [
        { id: '1', name: 'Pharmacy 1', location: { lat: 10, lng: 20 } },
        { id: '2', name: 'Pharmacy 2', location: { lat: 15, lng: 25 } },
      ];
      mockPharmacyRepository.findAll.mockResolvedValue(pharmacies);

      const result = await service.getAllPharmacies();
      expect(result).toEqual(pharmacies);
      expect(mockPharmacyRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getPharmacyById', () => {
    it('should return a pharmacy by id', async () => {
      const pharmacy = { id: '1', name: 'Pharmacy 1', location: { lat: 10, lng: 20 } };
      mockPharmacyRepository.findById.mockResolvedValue(pharmacy);

      const result = await service.getPharmacyById('1');
      expect(result).toEqual(pharmacy);
      expect(mockPharmacyRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if pharmacy not found', async () => {
      mockPharmacyRepository.findById.mockResolvedValue(null);

      const result = await service.getPharmacyById('1');
      expect(result).toBeNull();
    });
  });

  describe('updatePharmacy', () => {
    it('should update and return the updated pharmacy', async () => {
      const updatePharmacyDto: UpdatePharmacyDto = { name: 'Updated Pharmacy' };
      const updatedPharmacy = { id: '1', name: 'Updated Pharmacy', location: { lat: 10, lng: 20 } };

      mockPharmacyRepository.update.mockResolvedValue(updatedPharmacy);
      mockPharmacyRepository.findById.mockResolvedValue(updatedPharmacy);

      const result = await service.updatePharmacy('1', updatePharmacyDto);
      expect(result).toEqual(updatedPharmacy);
      expect(mockPharmacyRepository.update).toHaveBeenCalledWith('1', updatePharmacyDto);
    });
  });

  describe('deletePharmacy', () => {
    it('should delete a pharmacy', async () => {
      mockPharmacyRepository.delete.mockResolvedValue(undefined);

      await service.deletePharmacy('1');
      expect(mockPharmacyRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('getNearbyGuardPharmacies', () => {
    it('should return nearby pharmacies within 10 km', async () => {
      const pharmacies = [
        { id: '1', name: 'Pharmacy 1', location: { lat: 10, lng: 20 }, is_guard: true },
        { id: '2', name: 'Pharmacy 2', location: { lat: 10, lng: 20 }, is_guard: true },
        { id: '3', name: 'Pharmacy 3', location: { lat: 30, lng: 40 }, is_guard: false }, 
      ];
  
      const calculateDistance = jest.fn()
        .mockReturnValueOnce(5)  
        .mockReturnValueOnce(5)  
        .mockReturnValueOnce(20); 
  
      mockPharmacyRepository.findAll.mockResolvedValue(pharmacies);
      const result = await service.getNearbyGuardPharmacies(10, 20);
      const filteredPharmacies = pharmacies.filter(pharmacy => {
        const distance = calculateDistance(10, 20, pharmacy.location.lat, pharmacy.location.lng);
        return pharmacy.is_guard && distance <= 10;
      });
  
      expect(result).toEqual(filteredPharmacies);
      expect(calculateDistance).toHaveBeenCalledTimes(3);
      expect(calculateDistance).toHaveBeenCalledWith(10, 20, 10, 20); // For Pharmacy 1
      expect(calculateDistance).toHaveBeenCalledWith(10, 20, 10, 20); // For Pharmacy 2
      expect(calculateDistance).toHaveBeenCalledWith(10, 20, 30, 40); // For Pharmacy 3
    });
  });
  

  
});
