import { Pipe, PipeTransform } from '@angular/core';

const JAKARTA_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

@Pipe({
  name: 'jakartaDate',
})
export class JakartaDatePipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const parsedDate = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    const parts = JAKARTA_DATE_FORMATTER.formatToParts(parsedDate);
    const partMap = new Map(parts.map((part) => [part.type, part.value]));

    const day = partMap.get('day') ?? '';
    const month = partMap.get('month') ?? '';
    const year = partMap.get('year') ?? '';
    const hour = partMap.get('hour') ?? '';
    const minute = partMap.get('minute') ?? '';

    return `${day} ${month} ${year}, ${hour}:${minute} WIB`;
  }
}
