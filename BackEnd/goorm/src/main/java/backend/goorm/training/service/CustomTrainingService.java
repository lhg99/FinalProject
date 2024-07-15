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
        Training training = trainingRepository.findById(input.getId()).orElseThrow();
        // For simplicity, assuming the user is always authorized
        training.setTrainingName(input.getTrainingName());
        training.setCategory(input.getCategory());
        Training saved = trainingRepository.save(training);
        return TrainingDto.fromEntity(saved);
    }

    public TrainingDto deleteCustomTraining(Long trainingId) {
        Training training = trainingRepository.findById(trainingId).orElseThrow();
        // For simplicity, assuming the user is always authorized
        trainingRepository.delete(training);
        return TrainingDto.fromEntity(training);
    }

    public List<TrainingDto> customTrainingList() {
        List<Training> list = trainingRepository.findAll(); // Simplified for testing
        return list.stream().map(TrainingDto::fromEntity).collect(Collectors.toList());
    }
}