package backend.goorm.training.service;

import backend.goorm.training.dto.TrainingDto;
import backend.goorm.training.model.entity.Training;
import backend.goorm.training.dto.AddTrainingRequest;
import backend.goorm.training.dto.EditTrainingRequest;
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
public class CustomTrainingService {

    private final TrainingRepository trainingRepository;
    private final TrainingCategoryRepository trainingCategoryRepository;

    public TrainingDto addCustomTraining(AddTrainingRequest input) {
        TrainingCategory category = input.getCategory();

        if (category == null) {
            throw new IllegalArgumentException("카테고리가 제공되지 않았습니다.");
        }

        Optional<TrainingCategory> optionalCategory = trainingCategoryRepository.findById(category.getCategoryId());

        if (!optionalCategory.isPresent()) {
            throw new IllegalArgumentException("카테고리 ID가 존재하지 않습니다.");
        }

        TrainingCategory actualCategory = optionalCategory.get();
        if (!actualCategory.getCategoryName().equals(category.getCategoryName())) {
            throw new IllegalArgumentException("카테고리 ID와 이름이 일치하지 않습니다.");
        }

        Training training = AddTrainingRequest.toEntity(input, actualCategory);
        Training saved = trainingRepository.save(training);
        return TrainingDto.fromEntity(saved);
    }

    public TrainingDto editCustomTraining(EditTrainingRequest input) {
        Training training = trainingRepository.findById(input.getId())
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + input.getId()));

        training.setTrainingName(input.getTrainingName());
        training.setCategory(input.getCategory());
        Training saved = trainingRepository.save(training);
        return TrainingDto.fromEntity(saved);
    }

    public TrainingDto deleteCustomTraining(Long trainingId) {
        Training training = trainingRepository.findById(trainingId).orElseThrow();
        // 기본 운동은 삭제 불가, 유저 커스텀 운동만 삭제 가능
        if (Boolean.TRUE.equals(training.getUserCustom())) {
            trainingRepository.delete(training);
            return TrainingDto.fromEntity(training);
        } else {
            throw new IllegalArgumentException("기본 운동은 삭제할 수 없습니다.");
        }
    }

    public List<TrainingDto> customTrainingList() {
        List<Training> list = trainingRepository.findAll(); // Simplified for testing
        return list.stream().map(TrainingDto::fromEntity).collect(Collectors.toList());
    }
}
