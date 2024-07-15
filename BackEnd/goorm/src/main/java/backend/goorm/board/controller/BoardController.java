package backend.goorm.board.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    @Value("${max.size}")
    private int maxSize;

    @GetMapping
    public String testApi(){

        log.info("testAPI {}", maxSize);

        return maxSize + "입니다";
    }
}
