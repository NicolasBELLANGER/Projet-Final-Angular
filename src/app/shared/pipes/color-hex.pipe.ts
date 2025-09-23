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
        return '#cb8e63ff';
      case 'Green':
        return '#5eba5eff';
      case 'Grey':
        return '#808080';
      case 'Orange':
        return '#ff7300ff';
      case 'Pink':
        return '#FFC0CB';
      case 'Purple':
        return '#a85ba8ff';
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
