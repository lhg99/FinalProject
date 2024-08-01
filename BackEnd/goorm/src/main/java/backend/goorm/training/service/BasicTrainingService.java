package backend.goorm.training.service;

import backend.goorm.training.dto.AddTrainingRequest;
import backend.goorm.training.dto.TrainingDto;
import backend.goorm.training.model.entity.Training;
import backend.goorm.training.model.entity.TrainingCategory;
import backend.goorm.training.repository.TrainingCategoryRepository;
import backend.goorm.training.repository.TrainingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class BasicTrainingService {

    private final TrainingRepository trainingRepository;
    private final TrainingCategoryRepository trainingCategoryRepository;

    public TrainingDto addBasicTraining(AddTrainingRequest input) {
        Long categoryId = input.getCategory().getCategoryId();
        Optional<TrainingCategory> optionalCategory = trainingCategoryRepository.findById(categoryId);

        if (!optionalCategory.isPresent()) {
            throw new IllegalArgumentException("카테고리 ID가 존재하지 않습니다.");
        }

        TrainingCategory category = optionalCategory.get();
        if (!category.getCategoryName().equals(input.getCategory().getCategoryName())) {
            throw new IllegalArgumentException("카테고리 ID와 이름이 일치하지 않습니다.");
        }

        Training training = AddTrainingRequest.toEntity(input, category);
        training.setUserCustom(false); // 기본 운동이므로 userCustom을 false로 설정
        Training saved = trainingRepository.save(training);
        return TrainingDto.fromEntity(saved);
    }

    public List<TrainingDto> getAllTrainings() {
        List<Training> trainings = trainingRepository.findAll();
        return trainings.stream().map(TrainingDto::fromEntity).collect(Collectors.toList());
    }
}
