package backend.goorm.member.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/board")
public class BoardController {

    @Value("${max.size}")
    private int maxSize;

    @GetMapping("/test")
    public String testAPI(){
        return maxSize+"입니다";
    }

}
