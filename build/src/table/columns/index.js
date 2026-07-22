import { Column } from '../column.js';
export class TextColumn extends Column {
    type = 'text';
    static make(name) {
        return new TextColumn(name);
    }
}
export class BadgeColumn extends Column {
    type = 'badge';
    static make(name) {
        return new BadgeColumn(name);
    }
}
export class DateColumn extends Column {
    type = 'date';
    static make(name) {
        return new DateColumn(name);
    }
}
export class BooleanColumn extends Column {
    type = 'boolean';
    static make(name) {
        return new BooleanColumn(name);
    }
}
