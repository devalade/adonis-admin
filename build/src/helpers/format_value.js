import { DateTime } from 'luxon';
export function formatColumnValue(value, type) {
    if (value === null || value === undefined) {
        return null;
    }
    if (type === 'boolean') {
        return Boolean(value);
    }
    if (type === 'date') {
        if (DateTime.isDateTime(value)) {
            return value.setLocale('fr').toFormat('d MMM yyyy HH:mm');
        }
        if (value instanceof Date) {
            return DateTime.fromJSDate(value).setLocale('fr').toFormat('d MMM yyyy HH:mm');
        }
        return String(value);
    }
    return String(value);
}
