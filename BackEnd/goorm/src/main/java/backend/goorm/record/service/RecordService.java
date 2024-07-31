package backend.goorm.record.service;

import backend.goorm.record.dto.EditRecordRequest;
import backend.goorm.record.dto.RecordDto;
import backend.goorm.record.entity.Record;
import backend.goorm.record.repository.RecordRepository;
import backend.goorm.record.dto.AddCardioRecordRequest;
import backend.goorm.record.dto.AddStrengthRecordRequest;

import backend.goorm.member.model.entity.Member;
import backend.goorm.training.model.entity.Training;
import backend.goorm.training.repository.TrainingRepository;
import backend.goorm.s3.service.S3ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final TrainingRepository trainingRepository;
    private final S3ImageService s3ImageService;

    @Transactional
    public RecordDto addCardioRecord(Long trainingId, AddCardioRecordRequest request, Member member, MultipartFile image) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = s3ImageService.upload(image);
        }

        Record record = AddCardioRecordRequest.toEntity(request, training);
        record.setImageUrl(imageUrl); // 이미지 URL 설정
        Record saved = recordRepository.save(record);

        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public RecordDto addStrengthRecord(Long trainingId, AddStrengthRecordRequest request, Member member, MultipartFile image) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = s3ImageService.upload(image);
        }

        Record record = AddStrengthRecordRequest.toEntity(request, training);
        record.setImageUrl(imageUrl); // 이미지 URL 설정
        record.setCaloriesBurned(0f); // Set default value for caloriesBurned
        Record saved = recordRepository.save(record);

        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public RecordDto editRecord(Long recordId, EditRecordRequest request, Member member, MultipartFile image) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));

        String imageUrl = record.getImageUrl();
        if (image != null && !image.isEmpty()) {
            imageUrl = s3ImageService.upload(image);
            record.setImageUrl(imageUrl); // 이미지 URL 설정
        }

        Training training = record.getTraining();
        String categoryName = String.valueOf(training.getCategory().getCategoryName()); // 카테고리명 가져오기

        if ("유산소".equalsIgnoreCase(categoryName)) {
            EditRecordRequest.updateCardioRecord(record, request, imageUrl);
        } else {
            EditRecordRequest.updateStrengthRecord(record, request, imageUrl);
            record.setCaloriesBurned(0f); // Set default value for caloriesBurned
        }

        Record saved = recordRepository.save(record);
        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public void deleteRecord(Long recordId, Member member) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));

        if (record.getImageUrl() != null) {
            s3ImageService.deleteImageFromS3(record.getImageUrl());
        }

        recordRepository.delete(record);
    }

    @Transactional(readOnly = true)
    public List<RecordDto> getAllRecords(Member member) {
        List<Record> records = recordRepository.findAll();
        return records.stream().map(RecordDto::fromEntity).collect(Collectors.toList());
    }
}
