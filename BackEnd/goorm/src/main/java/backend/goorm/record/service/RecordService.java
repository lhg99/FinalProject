package backend.goorm.record.service;

import backend.goorm.record.dto.EditRecordRequest;
import backend.goorm.record.dto.RecordDto;
import backend.goorm.record.entity.Record;
import backend.goorm.record.entity.RecordImages;
import backend.goorm.record.repository.RecordRepository;
import backend.goorm.record.dto.AddCardioRecordRequest;
import backend.goorm.record.dto.AddStrengthRecordRequest;
import backend.goorm.member.model.entity.Member;
import backend.goorm.training.model.entity.Training;
import backend.goorm.training.repository.TrainingRepository;
import backend.goorm.s3.service.S3ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final TrainingRepository trainingRepository;
    private final S3ImageService s3ImageService;

    @Transactional
    public RecordDto addCardioRecord(Long trainingId, AddCardioRecordRequest request, Member member, MultipartFile[] images) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        List<String> imageUrls = new ArrayList<>();
        if (images != null && images.length > 0) {
            log.info("images : {}", (Object) images);
            imageUrls = s3ImageService.uploadMulti(images);
        }

        Record record = AddCardioRecordRequest.toEntity(request, training);
        if (!imageUrls.isEmpty()) {
            List<RecordImages> recordImages = imageUrls.stream()
                    .map(url -> RecordImages.builder().record(record).imageUrl(url).build())
                    .collect(Collectors.toList());
            record.setRecordImages(recordImages);
        } else {
            record.setRecordImages(new ArrayList<>()); // 빈 리스트로 설정
        }

        Record saved = recordRepository.save(record);
        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public RecordDto addStrengthRecord(Long trainingId, AddStrengthRecordRequest request, Member member, MultipartFile[] images) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        List<String> imageUrls = new ArrayList<>();
        if (images != null && images.length > 0) {
            log.info("images : {}", (Object) images);
            imageUrls = s3ImageService.uploadMulti(images);
        }

        Record record = AddStrengthRecordRequest.toEntity(request, training);
        if (!imageUrls.isEmpty()) {
            List<RecordImages> recordImages = imageUrls.stream()
                    .map(url -> RecordImages.builder().record(record).imageUrl(url).build())
                    .collect(Collectors.toList());
            record.setRecordImages(recordImages);
        } else {
            record.setRecordImages(new ArrayList<>()); // 빈 리스트로 설정
        }

        Record saved = recordRepository.save(record);
        return RecordDto.fromEntity(saved);
    }


    @Transactional
    public RecordDto editRecord(Long recordId, EditRecordRequest request, Member member, MultipartFile[] images) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));

        List<String> imageUrls = new ArrayList<>();
        if (images != null && images.length > 0) {
            imageUrls = s3ImageService.uploadMulti(images);
        }

        Training training = record.getTraining();
        String categoryName = String.valueOf(training.getCategory().getCategoryName());

        if ("유산소".equalsIgnoreCase(categoryName)) {
            EditRecordRequest.updateCardioRecord(record, request);
        } else {
            EditRecordRequest.updateStrengthRecord(record, request);
        }

        // 기존 이미지 삭제 및 S3에서 제거
        if (record.getRecordImages() != null) {
            record.getRecordImages().forEach(image -> s3ImageService.deleteImageFromS3(image.getImageUrl()));
            record.getRecordImages().clear();
        }

        if (!imageUrls.isEmpty()) {
            List<RecordImages> newImages = imageUrls.stream()
                    .map(url -> RecordImages.builder().record(record).imageUrl(url).build())
                    .collect(Collectors.toList());
            record.getRecordImages().addAll(newImages);
        } else {
            record.setRecordImages(new ArrayList<>()); // 빈 리스트로 설정
        }

        Record saved = recordRepository.save(record);
        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public void deleteRecord(Long recordId, Member member) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));

        if (record.getRecordImages() != null) {
            record.getRecordImages().forEach(image -> s3ImageService.deleteImageFromS3(image.getImageUrl()));
        }

        recordRepository.delete(record);
    }

    @Transactional(readOnly = true)
    public List<RecordDto> getAllRecords(Member member) {
        List<Record> records = recordRepository.findAll();
        return records.stream().map(RecordDto::fromEntity).collect(Collectors.toList());
    }
}
