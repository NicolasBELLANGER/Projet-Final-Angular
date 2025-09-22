import { TestBed } from '@angular/core/testing';
import { CatalogService } from './catalog.service';
import { CreateProductRequest } from '../models/catalog.model';

describe('CatalogService (intégration simple)', () => {
  let service: CatalogService;

  const store = new Map<string, string>();
  const mockGetItem = (key: string) => store.get(key) ?? null;
  const mockSetItem = (key: string, value: string) => { store.set(key, value); };

  beforeEach(() => {
    store.clear();
    spyOn(window.localStorage, 'getItem').and.callFake(mockGetItem);
    spyOn(window.localStorage, 'setItem').and.callFake(mockSetItem);

    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogService);
  });

  it('getAllProducts() retourne une liste', async () => {
    const all = await service.getAllProducts();
    expect(Array.isArray(all)).toBeTrue();
    expect(all.length).toBeGreaterThan(0);
  });

  it('createProduct() ajoute un produit et persiste dans localStorage', async () => {
    const before = (await service.getAllProducts()).length;

    const data: CreateProductRequest = {
      name: 'Test Shoe',
      brand: 'TestBrand',
      price: 99.9,
      sizes: [40, 41],
      colors: ['black'],
      image1: 'img1.jpg',
      image2: 'img2.jpg',
      description: 'Nice pair',
    };

    const created = await service.createProduct(data);
    expect(created.id).toBeTruthy();

    const after = (await service.getAllProducts()).length;
    expect(after).toBe(before + 1);

    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it('updateProduct() modifie un produit existant', async () => {
    const first = (await service.getAllProducts())[0];
    const newPrice = first.price + 10;

    const updated = await service.updateProduct(first.id, { price: newPrice });
    expect(updated).toBeTruthy();
    expect(updated!.price).toBe(newPrice);

    const after = await service.getAllProducts();
    const same = after.find(p => p.id === first.id)!;
    expect(same.price).toBe(newPrice);
  });

  it('deleteProduct() supprime un produit par id', async () => {
    const all = await service.getAllProducts();
    const target = all[0];

    const ok = await service.deleteProduct(target.id);
    expect(ok).toBeTrue();

    const after = await service.getAllProducts();
    expect(after.find(p => p.id === target.id)).toBeUndefined();
  });
});
