import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { CalendarIcon } from '../../../../image/CalendarIcon';
import { ko } from 'date-fns/locale';

interface DateSelectorProps {
    startDate: Date;
    endDate: Date;
    onHandleStartDate: (date: Date) => void;
    onHandleEndDate: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ startDate, endDate, onHandleStartDate, onHandleEndDate }) => {

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            if (endDate && (endDate.getTime() - date.getTime()) > 90 * 24 * 60 * 60 * 1000) {
                alert('The end date must be within 90 days of the start date.');
            }
            onHandleStartDate(date);
        } else {
            onHandleStartDate(new Date());
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            if (startDate && (date.getTime() - startDate.getTime()) > 90 * 24 * 60 * 60 * 1000) {
                alert('90일 이내의 날짜만 선택할 수 있습니다');
                onHandleEndDate(new Date());
            } else {
                onHandleEndDate(date);
            }
        } else {
            onHandleEndDate(new Date());
        }
    };

    const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => (
        <CustomInputContainer>
            <StyledInput ref={ref} {...props} />
            <CalendarIcon />
        </CustomInputContainer>
    ));

    return (
        <DateSelectorContainer>
            <DateInputContainer>
                <Label>
                    시작 날짜
                </Label>
                <DateInput>
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        dateFormat="yyyy/MM/dd (EEE)"
                        locale={ko}
                        customInput={<CustomInput />}
                    />
                </DateInput>
            </DateInputContainer>
            <DateInputContainer>
                <Label>
                    종료 날짜
                </Label>
                <DateInput>
                    <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        dateFormat="yyyy/MM/dd (EEE)"
                        minDate={startDate || undefined}
                        locale={ko}
                        customInput={<CustomInput />}
                    />
                </DateInput>
            </DateInputContainer>
        </DateSelectorContainer>
    );
};

export default DateSelector;

const DateSelectorContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    gap: 1.875rem;
    margin-top: 1.25rem;
`;

const DateInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 9.375rem;
`;

const DateInput = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.3125rem;
`;

const Label = styled.span`
    font-size: 0.875rem;
    color: #A5896F;
    text-align: left;
`;

const CustomInputContainer = styled.div`
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input`
    border: none;
    background: none;
    font-size: 0.875rem;
    width: 8.125rem;
    cursor: pointer;
    &:focus {
        outline: none;
    }
`;
