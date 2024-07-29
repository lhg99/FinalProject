package backend.goorm.training.controller;

import backend.goorm.training.dto.AddTrainingRequest;
import backend.goorm.training.dto.EditTrainingRequest;
import backend.goorm.training.dto.TrainingDto;
import backend.goorm.training.service.CustomTrainingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user/custom-trainings")
public class CustomTrainingController {

    private final CustomTrainingService customTrainingService;

    @PostMapping
    public ResponseEntity<TrainingDto> addCustomTraining(@RequestBody AddTrainingRequest input) {
        TrainingDto result = customTrainingService.addCustomTraining(input);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<TrainingDto> editCustomTraining(@RequestBody EditTrainingRequest input) {
        TrainingDto result = customTrainingService.editCustomTraining(input);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public ResponseEntity<TrainingDto> deleteCustomTraining(@RequestParam(name = "id") Long id) {
        TrainingDto result = customTrainingService.deleteCustomTraining(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<TrainingDto>> customTrainingList() {
        List<TrainingDto> customTrainingList = customTrainingService.customTrainingList();
        return ResponseEntity.ok(customTrainingList);
    }
}
