package backend.goorm.training.service;

import backend.goorm.training.dto.AddTrainingInput;
import backend.goorm.training.dto.TrainingDto;
import backend.goorm.training.model.entity.Training;
import backend.goorm.training.repository.TrainingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class BasicTrainingService {

    private final TrainingRepository trainingRepository;

    public TrainingDto addBasicTraining(AddTrainingInput input) {
        Training training = AddTrainingInput.toEntity(input);
        training.setUserCustom(false); // 기본 운동이므로 userCustom을 false로 설정
        Training saved = trainingRepository.save(training);
        return TrainingDto.fromEntity(saved);
    }

    public List<TrainingDto> getAllTrainings() {
        List<Training> trainings = trainingRepository.findAll();
        return trainings.stream().map(TrainingDto::fromEntity).collect(Collectors.toList());
    }
}
