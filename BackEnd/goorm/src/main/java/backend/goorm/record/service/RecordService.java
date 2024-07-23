package backend.goorm.record.service;

import backend.goorm.record.dto.EditRecordRequest;
import backend.goorm.record.entity.Record;
import backend.goorm.record.repository.RecordRepository;
import backend.goorm.record.dto.AddCardioRecordRequest;
import backend.goorm.record.dto.AddStrengthRecordRequest;
import backend.goorm.record.dto.RecordDto;
import backend.goorm.member.model.entity.Member;
import backend.goorm.training.model.entity.Training;
import backend.goorm.training.repository.TrainingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final TrainingRepository trainingRepository;

    @Transactional
    public RecordDto addCardioRecord(Long trainingId, AddCardioRecordRequest request, Member member) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        Record record = AddCardioRecordRequest.toEntity(request, training);
        Record saved = recordRepository.save(record);

        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public RecordDto addStrengthRecord(Long trainingId, AddStrengthRecordRequest request, Member member) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        Record record = AddStrengthRecordRequest.toEntity(request, training);
        Record saved = recordRepository.save(record);

        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public RecordDto editRecord(Long recordId, EditRecordRequest request, Member member) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));

        Record updatedRecord = EditRecordRequest.updateRecord(record, request);
        Record saved = recordRepository.save(updatedRecord);
        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public void deleteRecord(Long recordId, Member member) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));

        recordRepository.delete(record);
    }

    @Transactional(readOnly = true)
    public List<RecordDto> getAllRecords(Member member) {
        List<Record> records = recordRepository.findAll();
        return records.stream().map(RecordDto::fromEntity).collect(Collectors.toList());
    }
}
