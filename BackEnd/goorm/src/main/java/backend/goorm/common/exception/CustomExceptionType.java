package backend.goorm.common.exception;

import org.springframework.http.HttpStatus;

public enum CustomExceptionType {
    RUNTIME_EXCEPTION(HttpStatus.BAD_REQUEST, "E001", "잘못된 요청입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E002", "서버 오류 입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "E003", "사용자 정보가 존재하지 않습니다."),
    DUPLICATE_INFORMATION(HttpStatus.BAD_REQUEST, "E004", "중복된 사용자 정보가 존재합니다 중복체크를 진행해주세요"),
    ALREADY_REG_INFO(HttpStatus.BAD_REQUEST, "E004", "이미 사용자 정보가 등록된 사용자입니다"),
    PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST, "E005", "사용하던 비빌번호가 일치하지 않습니다"),
    CHAT_ROOM_NOT_FOUND(HttpStatus.BAD_REQUEST, "E006", "참여중인 채팅방이 존재하지 않습니다"),

    ;


    private final HttpStatus httpStatus;
    private final String code;
    private String message;

    CustomExceptionType(HttpStatus httpStatus, String code) {
        this.httpStatus = httpStatus;
        this.code = code;
    }

    CustomExceptionType(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
