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

        String imageUrl = s3ImageService.upload(image);

        Record record = AddCardioRecordRequest.toEntity(request, training);
        record.setImageUrl(imageUrl); // 이미지 URL 설정
        Record saved = recordRepository.save(record);

        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public RecordDto addStrengthRecord(Long trainingId, AddStrengthRecordRequest request, Member member, MultipartFile image) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        String imageUrl = s3ImageService.upload(image);

        Record record = AddStrengthRecordRequest.toEntity(request, training);
        record.setImageUrl(imageUrl); // 이미지 URL 설정
        Record saved = recordRepository.save(record);

        return RecordDto.fromEntity(saved);
    }


    @Transactional
    public RecordDto editRecord(Long recordId, EditRecordRequest request, Member member, MultipartFile image) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));

        String imageUrl = record.getImageUrl();
        if (image != null && !image.isEmpty()) {
            // 기존 이미지가 있다면 삭제
            if (imageUrl != null && !imageUrl.isEmpty()) {
                s3ImageService.deleteImageFromS3(imageUrl);
            }
            // 새 이미지 업로드
            imageUrl = s3ImageService.upload(image);
        }

        Record updatedRecord = EditRecordRequest.updateRecord(record, request, imageUrl);
        Record saved = recordRepository.save(updatedRecord);
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
