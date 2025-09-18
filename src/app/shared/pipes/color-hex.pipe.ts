import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorHex',
  standalone: true,
})
export class ColorHexPipe implements PipeTransform {
  transform(color: string): string {
    switch (color) {
      case 'Black':
        return '#000000';
      case 'Blue':
        return '#0000FF';
      case 'Brown':
        return '#A52A2A';
      case 'Green':
        return '#008000';
      case 'Grey':
        return '#808080';
      case 'Orange':
        return '#FFA500';
      case 'Pink':
        return '#FFC0CB';
      case 'Purple':
        return '#800080';
      case 'Red':
        return '#FF0000';
      case 'White':
        return '#FFFFFF';
      case 'Yellow':
        return '#FFFF00';
      default:
        return color;
    }
  }
}
