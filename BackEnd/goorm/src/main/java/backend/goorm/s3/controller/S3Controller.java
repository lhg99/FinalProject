package backend.goorm.s3.controller;

import backend.goorm.s3.service.S3ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/s3")
public class S3Controller {

    private final S3ImageService s3ImageService;

    public S3Controller(S3ImageService s3ImageService) {
        this.s3ImageService = s3ImageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> s3Upload(@RequestPart(value = "image", required = false)MultipartFile image) {
        String profileImage = s3ImageService.upload(image);
        return ResponseEntity.ok(profileImage);
    }

    @PostMapping("/upload/multi")
    public ResponseEntity<?> s3UploadMulti(@RequestPart(value = "image", required = false)MultipartFile[] image) {
        String profileImage = s3ImageService.uploadMulti(image);
        return ResponseEntity.ok(profileImage);
    }



    @GetMapping("/delete")
    public ResponseEntity<?> s3delete(@RequestParam String addr) {
        s3ImageService.deleteImageFromS3(addr);
        return ResponseEntity.ok(null);
    }
}