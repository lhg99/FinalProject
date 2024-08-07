package backend.goorm.record.service;

import backend.goorm.record.dto.EditRecordRequest;
import backend.goorm.record.dto.RecordDto;
import backend.goorm.record.entity.Memo;
import backend.goorm.record.entity.Record;
import backend.goorm.record.repository.MemoRepository;
import backend.goorm.record.repository.RecordRepository;
import backend.goorm.record.dto.AddCardioRecordRequest;
import backend.goorm.record.dto.AddStrengthRecordRequest;
import backend.goorm.member.model.entity.Member;
import backend.goorm.training.model.entity.Training;
import backend.goorm.training.repository.TrainingRepository;
import backend.goorm.s3.service.S3ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecordService {

    private final RecordRepository recordRepository;
    private final TrainingRepository trainingRepository;
    private final MemoRepository memoRepository;
    private final S3ImageService s3ImageService;

    @Transactional
    public RecordDto addCardioRecord(Long trainingId, AddCardioRecordRequest request, Member member, MultipartFile[] images) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        Record record = AddCardioRecordRequest.toEntity(request, training);
        record.setMember(member); // Member 설정

        Record saved = recordRepository.save(record);
        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public RecordDto addStrengthRecord(Long trainingId, AddStrengthRecordRequest request, Member member, MultipartFile[] images) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        Record record = AddStrengthRecordRequest.toEntity(request, training);
        record.setMember(member); // Member 설정

        Record saved = recordRepository.save(record);
        return RecordDto.fromEntity(saved);
    }

    @Transactional
    public List<RecordDto> editRecords(List<EditRecordRequest> requests, Member member) {
        List<RecordDto> updatedRecords = new ArrayList<>();

        for (EditRecordRequest request : requests) {
            Record record = recordRepository.findById(request.getRecordId())
                    .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + request.getRecordId()));

            // 권한 확인: 기록의 소유자가 현재 사용자와 일치하는지 확인
            if (!record.getMember().getMemberId().equals(member.getMemberId())) {
                throw new IllegalArgumentException("You do not have permission to edit this record.");
            }

            Training training = record.getTraining();
            String categoryName = String.valueOf(training.getCategory().getCategoryName());


            // 유산소 운동인지 판단하여 해당 메서드에 전달
            boolean isCardio = "유산소".equalsIgnoreCase(categoryName);

            EditRecordRequest.updateRecord(record, request, isCardio);


            Record saved = recordRepository.save(record);
            updatedRecords.add(RecordDto.fromEntity(saved));
        }

        return updatedRecords;
    }


    @Transactional
    public void deleteRecord(Long recordId, Member member) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + recordId));

        // 추가: Record의 소유자 확인
        if (!record.getMember().getMemberId().equals(member.getMemberId())) {
            throw new IllegalArgumentException("해당 기록을 삭제할 권한이 없습니다.");
        }


        recordRepository.delete(record);
    }

    @Transactional(readOnly = true)
    public Page<RecordDto> getPagedRecords(Member member, Pageable pageable) {
        Page<Record> records = recordRepository.findAllByMember(member, pageable);

        return records.map(record -> {
            Optional<Memo> memoOpt = memoRepository.findByMemberAndDate(member, record.getExerciseDate());
            String memoContent = memoOpt.map(Memo::getContent).orElse(null);
            return RecordDto.fromEntity(record, memoContent);
        });
    }

    public int getTotalCaloriesBurnedByDateAndMember(LocalDate date, Member member) {
        return recordRepository.findAllByExerciseDateAndMember(date, member).stream()
                .mapToInt(record -> record.getCaloriesBurned() != null ? record.getCaloriesBurned().intValue() : 0)
                .sum();
    }

    public int getTotalDurationByDateAndMember(LocalDate date, Member member) {
        return recordRepository.findAllByExerciseDateAndMember(date, member).stream()
                .mapToInt(record -> record.getDurationMinutes() != null ? record.getDurationMinutes().intValue() : 0)
                .sum();
    }


}
