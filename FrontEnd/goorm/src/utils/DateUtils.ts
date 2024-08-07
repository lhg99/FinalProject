export const formatDateData = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatDateInfo = (info: { year: number; month: number; day: number; weekday: string }): string => {
    const year = info.year;
    const month = String(info.month).padStart(2, '0');
    const day = String(info.day).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
};

export const formatDate = (date: Date) => {
    // 'yyyy-MM-dd' 형식으로 날짜를 포맷
    return date.toISOString().split('T')[0];
}