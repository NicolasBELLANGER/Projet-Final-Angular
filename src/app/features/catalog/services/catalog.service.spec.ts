import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CatalogService } from './catalog.service';
import { Product } from '../models/catalog.model';

describe('CatalogService', () => {
  let service: CatalogService;

  const mock: Product[] = [
    {
      id: 1,
      name: 'Air Force 1',
      brand: 'Nike',
      price: 120,
      sizes: [40, 41],
      colors: ['Black'],
      image1: 'a1.jpg',
      image2: 'a2.jpg',
      description: 'Air Force 1 shoe',
    },
    {
      id: 2,
      name: '740',
      brand: 'New Balance',
      price: 200,
      sizes: [42],
      colors: ['Blue'],
      image1: 'b1.jpg',
      image2: 'b2.jpg',
      description: '740 shoe',
    },
  ];

  let store: Record<string, string>;

  function mockLocalStorage() {
    store = {};
    spyOn(localStorage, 'getItem').and.callFake((k: string) => store[k] ?? null);
    spyOn(localStorage, 'setItem').and.callFake((k: string, v: string) => { store[k] = v; });
    spyOn(localStorage, 'removeItem').and.callFake((k: string) => { delete store[k]; });
    spyOn(localStorage, 'clear').and.callFake(() => { store = {}; });
  }

  beforeEach(() => {
    mockLocalStorage();
    store['products'] = JSON.stringify(mock);

    TestBed.configureTestingModule({
      providers: [CatalogService],
    });

    service = TestBed.inject(CatalogService);
  });

  it('getAllProducts retourne la liste courante', fakeAsync(async () => {
    const p = service.getAllProducts();
    tick(300);
    const all = await p;
    expect(all.length).toBe(2);
    expect(all.map(x => x.id)).toEqual([1, 2]);
  }));

  it('getProductById retourne le bon produit', fakeAsync(async () => {
    const p = service.getProductById(2);
    tick(200);
    expect(await p).toEqual(jasmine.objectContaining({ id: 2, name: '740' }));
  }));
});


