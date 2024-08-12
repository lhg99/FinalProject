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
import backend.goorm.record.util.ExerciseCalculator;
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
    private final ExerciseCalculator exerciseCalculator;

    @Transactional
    public RecordDto addCardioRecord(Long trainingId, AddCardioRecordRequest request, Member member, MultipartFile[] images) {
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        // 러닝인지 확인하고, 러닝일 경우 칼로리 계산
        Float caloriesBurned = null;
        if (training.getTrainingName().toLowerCase().contains("러닝")) {
            caloriesBurned = exerciseCalculator.calculateCaloriesForRunning(member, String.valueOf(request.getIntensity()), request.getDurationMinutes().floatValue());
        } else if (training.getTrainingName().toLowerCase().contains("걷기")){
            caloriesBurned = exerciseCalculator.calculateCaloriesForWalking(member, String.valueOf(request.getIntensity()), request.getDurationMinutes().floatValue());
        } else if (training.getTrainingName().toLowerCase().contains("자전거 타기")) {
            caloriesBurned = exerciseCalculator.calculateCaloriesForCycling(member, String.valueOf(request.getIntensity()), request.getDurationMinutes().floatValue());
        } else if (training.getTrainingName().toLowerCase().contains("계단 오르기")) {
            caloriesBurned = exerciseCalculator.calculateCaloriesForStairClimbing(member, String.valueOf(request.getIntensity()), request.getDurationMinutes().floatValue());
        }
        Record record = AddCardioRecordRequest.toEntity(request, training, caloriesBurned);
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
                    .orElseThrow(() -> new IllegalArgumentException("해당하는 id의 운동기록을 찾지 못했습니다." + request.getRecordId()));

            // 권한 확인: 기록의 소유자가 현재 사용자와 일치하는지 확인
            if (!record.getMember().getMemberId().equals(member.getMemberId())) {
                throw new IllegalArgumentException("자신의 운동 기록만 수정할 수 있습니다.");
            }

            Training training = record.getTraining();
            String categoryName = String.valueOf(training.getCategory().getCategoryName());

            // 유산소 운동인지 판단하여 해당 메서드에 전달
            boolean isCardio = "유산소".equalsIgnoreCase(categoryName);
            Float calculatedCalories = null;

            if (isCardio) {
                // 칼로리 재계산
                calculatedCalories = exerciseCalculator.calculateCaloriesForRunning(member, request.getIntensity().name(), request.getDurationMinutes().floatValue());
            }

            EditRecordRequest.updateRecord(record, request, isCardio, calculatedCalories);

            // 메모 업데이트 또는 추가
            Optional<Memo> existingMemoOpt = memoRepository.findByMemberAndDate(member, record.getExerciseDate());

            if (existingMemoOpt.isPresent()) {
                Memo existingMemo = existingMemoOpt.get();
                existingMemo.setContent(request.getMemo()); // 기존 메모 업데이트
                memoRepository.save(existingMemo);
            } else {
                // 새로운 메모 생성
                Memo newMemo = Memo.builder()
                        .member(member)
                        .content(request.getMemo()) // 메모가 비어있거나 null일 수 있음
                        .date(record.getExerciseDate())
                        .build();
                memoRepository.save(newMemo);
            }

            Record saved = recordRepository.save(record);
            String memoContent = request.getMemo() != null && !request.getMemo().isEmpty() ? request.getMemo() : null;

            updatedRecords.add(RecordDto.fromEntity(saved, memoContent));
        }

        return updatedRecords;
    }


    @Transactional
    public void deleteRecord(Long recordId, Member member) {
        Record record = recordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 id의 운동기록을 찾지 못했습니다."  + recordId));

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

    public List<RecordDto> getAllRecords(Member member) {
        List<Record> records = recordRepository.findAllByMember(member);

        return records.stream().map(record -> {
            // 메모를 해당 기록 날짜에 맞춰 조회
            Optional<Memo> memoOpt = memoRepository.findByMemberAndDate(member, record.getExerciseDate());
            String memoContent = memoOpt.map(Memo::getContent).orElse(null);

            // 총 칼로리 계산
            Float totalCaloriesBurned = records.stream()
                    .map(Record::getCaloriesBurned)
                    .reduce(0f, Float::sum);

            // RecordDto로 변환하여 메모 내용 포함
            return RecordDto.fromEntity(record, memoContent,totalCaloriesBurned);
        }).collect(Collectors.toList());
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
