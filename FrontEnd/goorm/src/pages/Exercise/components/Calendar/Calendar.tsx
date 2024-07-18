import React, { useState, useEffect } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.scss';

interface MyCalendarProps {
  onDateChange: (dateInfo: { year: number, month: number, day: number, weekday: string }) => void;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (selectedDate) {
      const getData = async () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
        const day = selectedDate.getDate();
        const weekday = selectedDate.toLocaleDateString('ko-KR', { weekday: 'long' });

        onDateChange({year, month, day, weekday});
      };
      getData();
    }
  }, [selectedDate, onDateChange]);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  return (
    <div className="calendar-page">
      <Calendar 
      onChange={handleDateChange} 
      value={selectedDate}
      locale="ko-KR" 
      calendarType="gregory"
      />
    </div>
  );
};

export default MyCalendar;
