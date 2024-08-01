package backend.goorm.record.service;

import backend.goorm.record.entity.Record;
import backend.goorm.record.entity.WeeklyRecord;
import backend.goorm.record.repository.BodyPartCountRecordRepository;
import backend.goorm.record.repository.RecordRepository;
import backend.goorm.training.model.enums.TrainingCategoryType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class BodyPartCountRecordService {

    private final RecordRepository recordRepository;
    private final BodyPartCountRecordRepository bodyPartCountRecordRepository;

    public int executeBodyPartCountRecordProcess(List<Record> records) {
        for (Record record : records) {
            this.saveOrUpdateBodyPartCountRecord(record);
        }
        return records.size();
    }

    private void saveOrUpdateBodyPartCountRecord(Record record) {
        WeeklyRecord existingRecord = bodyPartCountRecordRepository.findAllByStartDateAndEndDate(
                        record.getExerciseDate().withDayOfMonth(1), record.getExerciseDate().withDayOfMonth(record.getExerciseDate().lengthOfMonth()))
                .stream().findFirst().orElse(null);

        Map<TrainingCategoryType, Double> countMap = getCountMapByRecords(List.of(record));

        if (existingRecord != null) {
            setBodyPartCountRecordFieldsFromMap(existingRecord, countMap);
            bodyPartCountRecordRepository.save(existingRecord);
        } else {
            WeeklyRecord newRecord = new WeeklyRecord();
            setBodyPartCountRecordFieldsFromMap(newRecord, countMap);
            newRecord.setStartDate(record.getExerciseDate().withDayOfMonth(1));
            newRecord.setEndDate(record.getExerciseDate().withDayOfMonth(record.getExerciseDate().lengthOfMonth()));
            bodyPartCountRecordRepository.save(newRecord);
        }

        log.info("Body part count record saved or updated for record: {}", record.getRecordId());
    }

    public Map<TrainingCategoryType, BodyPartCountInfo> getBodyPartCountInfoMap(List<Record> records) {
        Map<TrainingCategoryType, Double> countMap = getCountMapByRecords(records);
        double totalExercises = records.size();

        Map<TrainingCategoryType, BodyPartCountInfo> infoMap = new HashMap<>();
        for (Map.Entry<TrainingCategoryType, Double> entry : countMap.entrySet()) {
            double percentage = (entry.getValue() / totalExercises) * 100;
            infoMap.put(entry.getKey(), new BodyPartCountInfo(entry.getValue(), percentage));
        }

        return infoMap;
    }

    public Map<TrainingCategoryType, Double> getCountMapByRecords(List<Record> records) {
        Map<TrainingCategoryType, Double> countMap = new HashMap<>();
        for (Record record : records) {
            TrainingCategoryType category = record.getTraining().getCategory().getCategoryName();
            countMap.put(category, countMap.getOrDefault(category, 0.0) + 1);
        }
        return countMap;
    }

    public List<Record> getRecordsByDate(LocalDate date) {
        return recordRepository.findAll().stream()
                .filter(record -> record.getExerciseDate().equals(date))
                .collect(Collectors.toList());
    }

    public List<Record> getRecordsByDateRange(LocalDate start, LocalDate end) {
        return recordRepository.findAll().stream()
                .filter(record -> !record.getExerciseDate().isBefore(start) && !record.getExerciseDate().isAfter(end))
                .collect(Collectors.toList());
    }

    private void setBodyPartCountRecordFieldsFromMap(WeeklyRecord weeklyRecord, Map<TrainingCategoryType, Double> countMap) {
        weeklyRecord.setCardio(countMap.getOrDefault(TrainingCategoryType.유산소, 0.0));
        weeklyRecord.setChest(countMap.getOrDefault(TrainingCategoryType.가슴, 0.0));
        weeklyRecord.setBack(countMap.getOrDefault(TrainingCategoryType.등, 0.0));
        weeklyRecord.setLegs(countMap.getOrDefault(TrainingCategoryType.하체, 0.0));
        weeklyRecord.setShoulder(countMap.getOrDefault(TrainingCategoryType.어깨, 0.0));
        weeklyRecord.setBiceps(countMap.getOrDefault(TrainingCategoryType.이두, 0.0));
        weeklyRecord.setTriceps(countMap.getOrDefault(TrainingCategoryType.삼두, 0.0));
        weeklyRecord.setAbs(countMap.getOrDefault(TrainingCategoryType.복근, 0.0));
        weeklyRecord.setEtc(countMap.getOrDefault(TrainingCategoryType.기타, 0.0));
    }


    public static class BodyPartCountInfo {
        private double count;
        private double percentage;

        public BodyPartCountInfo(double count, double percentage) {
            this.count = count;
            this.percentage = percentage;
        }

        public double getCount() {
            return count;
        }

        public double getPercentage() {
            return percentage;
        }
    }
}
