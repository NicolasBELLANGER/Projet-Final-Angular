import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colors',
  standalone: true,
})
export class ColorsPipe implements PipeTransform {
  transform(colors: string): string {
    switch (colors) {
      case 'Black':
        return 'Noir';
      case 'Blue':
        return 'Bleu';
      case 'Brown':
        return 'Marron';
      case 'Green':
        return 'Vert';
      case 'Grey':
        return 'Gris';
      case 'Orange':
        return 'Orange';
      case 'Pink':
        return 'Rose';
      case 'Purple':
        return 'Violet';
      case 'Red':
        return 'Rouge';
      case 'White':
        return 'Blanc';
      case 'Yellow':
        return 'Jaune';
      default:
        return colors;
    }
  }
}
