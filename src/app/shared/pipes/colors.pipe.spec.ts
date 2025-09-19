import { ColorsPipe } from './colors.pipe';

describe('ColorsPipe', () => {
  let pipe: ColorsPipe;

  beforeEach(() => {
    pipe = new ColorsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "red" to "rouge"', () => {
    expect(pipe.transform('Black')).toBe('Noir');
  });

  it('should transform "blue" to "bleu"', () => {
    expect(pipe.transform('Blue')).toBe('Bleu');
  });

  it('should transform "green" to "vert"', () => {
    expect(pipe.transform('Brown')).toBe('Marron');
  });

  it('should transform "red" to "rouge"', () => {
    expect(pipe.transform('Green')).toBe('Vert');
  });

  it('should transform "blue" to "bleu"', () => {
    expect(pipe.transform('Grey')).toBe('Gris');
  });

  it('should transform "green" to "vert"', () => {
    expect(pipe.transform('Orange')).toBe('Orange');
  });

  it('should transform "red" to "rouge"', () => {
    expect(pipe.transform('Pink')).toBe('Rose');
  });

  it('should transform "blue" to "bleu"', () => {
    expect(pipe.transform('Purple')).toBe('Violet');
  });

  it('should transform "green" to "vert"', () => {
    expect(pipe.transform('Red')).toBe('Rouge');
  });

  it('should transform "blue" to "bleu"', () => {
    expect(pipe.transform('Yellow')).toBe('Jaune');
  });

  it('should transform "green" to "vert"', () => {
    expect(pipe.transform('White')).toBe('Blanc');
  });

   it('should return input for unknown color', () => {
    expect(pipe.transform('Cyan')).toBe('Cyan');
  });

});