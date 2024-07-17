package backend.goorm.training.service;

import backend.goorm.training.dto.TrainingDto;
import backend.goorm.training.model.entity.Training;
import backend.goorm.training.dto.AddTrainingInput;
import backend.goorm.training.dto.EditTrainingInput;
import backend.goorm.training.repository.TrainingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class CustomTrainingService {

    private final TrainingRepository trainingRepository;

    public TrainingDto addCustomTraining(AddTrainingInput input) {
        Training training = AddTrainingInput.toEntity(input);
        training.setUserCustom(true);
        Training saved = trainingRepository.save(training);
        return TrainingDto.fromEntity(saved);
    }

    public TrainingDto editCustomTraining(EditTrainingInput input) {
        Training training = trainingRepository.findById(input.getId()).orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + input.getId()));
        // For simplicity, assuming the user is always authorized
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