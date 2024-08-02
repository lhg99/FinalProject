package backend.goorm.training.controller;

import backend.goorm.member.oauth.PrincipalDetails;
import backend.goorm.training.dto.AddTrainingRequest;
import backend.goorm.training.dto.EditTrainingRequest;
import backend.goorm.training.dto.TrainingDto;
import backend.goorm.training.service.CustomTrainingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user/custom-trainings")
public class CustomTrainingController {

    private final CustomTrainingService customTrainingService;

    @PostMapping
    public ResponseEntity<TrainingDto> addCustomTraining(@RequestBody AddTrainingRequest input,
                                                         @AuthenticationPrincipal PrincipalDetails principalDetails) {
        TrainingDto result = customTrainingService.addCustomTraining(input, principalDetails.member());
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<TrainingDto> editCustomTraining(@RequestBody EditTrainingRequest input,
                                                          @AuthenticationPrincipal PrincipalDetails principalDetails) {
        TrainingDto result = customTrainingService.editCustomTraining(input, principalDetails.member());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public ResponseEntity<TrainingDto> deleteCustomTraining(@RequestParam(name = "id") Long id,
                                                            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        TrainingDto result = customTrainingService.deleteCustomTraining(id, principalDetails.member());
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<TrainingDto>> customTrainingList(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<TrainingDto> customTrainingList = customTrainingService.customTrainingList(principalDetails.member());
        return ResponseEntity.ok(customTrainingList);
    }
}
