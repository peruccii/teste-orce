export class DateUtils {
    static formatDate(date: Date, locale: string = 'pt-BR'): string {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    static isOverdue(date: Date): boolean {
        return date.getTime() < new Date().getTime();
    }

    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static getDaysDifference(date1: Date, date2: Date): number {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    }

    static startOfDay(date: Date): Date {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }

    static endOfDay(date: Date): Date {
        const newDate = new Date(date);
        newDate.setHours(23, 59, 59, 999);
        return newDate;
    }
}
