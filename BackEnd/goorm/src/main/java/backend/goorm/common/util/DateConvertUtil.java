package backend.goorm.common.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DateConvertUtil {

    public String convertDateToString(LocalDateTime date) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String regDate = date.format(formatter);

        return regDate;
    }

    public String convertDateToStringWithTime(LocalDateTime date) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");
        String regDate = date.format(formatter);
        return regDate;

    }

    public String convertDateToString(LocalDate date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        return date.format(formatter);
    }

}
