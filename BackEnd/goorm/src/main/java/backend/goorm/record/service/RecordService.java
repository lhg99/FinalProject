//package backend.goorm.record.service;
//
//import backend.goorm.record.entity.Record;
//import backend.goorm.record.repository.RecordRepository;
//import backend.goorm.record.dto.AddRecordRequest;
//import backend.goorm.record.dto.EditRecordRequest;
//import backend.goorm.record.dto.RecordDto;
//import backend.goorm.member.model.entity.Member;
//import backend.goorm.training.model.entity.Training;
//import backend.goorm.training.repository.TrainingRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@RequiredArgsConstructor
//@Service
//public class RecordService {
//
//    private final RecordRepository recordRepository;
//    private final TrainingRepository trainingRepository;
//
//    @Transactional
//    public RecordDto addRecord(Long trainingId, AddRecordRequest input, Member member) {
//        Training training = trainingRepository.findById(trainingId)
//                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));
//
//        Record record = AddRecordRequest.toEntity(input, training);
//        Record saved = recordRepository.save(record);
//
//        return RecordDto.fromEntity(saved);
//    }
//
//    @Transactional
//    public RecordDto editRecord(Long recordId, EditRecordRequest input, Member member) {
//        Record record = recordRepository.findById(recordId)
//                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));
//
//        if (!record.getTraining().getMember().equals(member)) {
//            throw new IllegalArgumentException("No authority to edit this record");
//        }
//
//        Record updatedRecord = EditRecordRequest.updateRecord(record, input);
//        Record saved = recordRepository.save(updatedRecord);
//        return RecordDto.fromEntity(saved);
//    }
//
//    @Transactional
//    public void deleteRecord(Long recordId, Member member) {
//        Record record = recordRepository.findById(recordId)
//                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));
//
//        if (!record.getTraining().getMember().equals(member)) {
//            throw new IllegalArgumentException("No authority to delete this record");
//        }
//
//        recordRepository.delete(record);
//    }
//
//    @Transactional(readOnly = true)
//    public List<RecordDto> getAllRecords(Member member) {
//        List<Record> records = recordRepository.findAllByMember(member);
//        return records.stream().map(RecordDto::fromEntity).collect(Collectors.toList());
//    }
//}
