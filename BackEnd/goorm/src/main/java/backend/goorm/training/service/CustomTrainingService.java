package backend.goorm.training.service;

import backend.goorm.member.model.entity.Member;
import backend.goorm.member.repository.MemberRepository;
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

    private final MemberRepository memberRepository;
    private final TrainingRepository trainingRepository;
    private final TrainingCategoryRepository trainingCategoryRepository;

    public TrainingDto addCustomTraining(AddTrainingRequest input, Member member) {
        // Validate if category is provided
        TrainingCategory category = input.getCategory();
        if (category == null) {
            throw new IllegalArgumentException("카테고리가 제공되지 않았습니다.");
        }

        // Find the category in the database
        TrainingCategory actualCategory = trainingCategoryRepository.findById(category.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리 ID가 존재하지 않습니다."));

        // Ensure the category name matches
        if (!actualCategory.getCategoryName().equals(category.getCategoryName())) {
            throw new IllegalArgumentException("카테고리 ID와 이름이 일치하지 않습니다.");
        }

        // Create and save the training entity
        Training training = AddTrainingRequest.toEntity(input, actualCategory);
        training.setMember(member);  // Set the current authenticated user
        Training saved = trainingRepository.save(training);
        return TrainingDto.fromEntity(saved);
    }

    public TrainingDto editCustomTraining(EditTrainingRequest input, Member member) {
        // Find the training by ID
        Training training = trainingRepository.findById(input.getId())
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + input.getId()));

        // Ensure the training belongs to the current user
        if (!training.getMember().getMemberId().equals(member.getMemberId())) {
            throw new IllegalArgumentException("이 훈련은 현재 사용자와 관련이 없습니다.");
        }

        // Update and save the training entity
        training.setTrainingName(input.getTrainingName());
        training.setCategory(input.getCategory());
        Training saved = trainingRepository.save(training);
        return TrainingDto.fromEntity(saved);
    }

    public TrainingDto deleteCustomTraining(Long trainingId, Member member) {
        // Find the training by ID
        Training training = trainingRepository.findById(trainingId)
                .orElseThrow(() -> new IllegalArgumentException("Training not found with id: " + trainingId));

        // Ensure the training belongs to the current user
        if (!training.getMember().getMemberId().equals(member.getMemberId())) {
            throw new IllegalArgumentException("이 훈련은 현재 사용자와 관련이 없습니다.");
        }

        // Delete the training if it is a custom training
        if (Boolean.TRUE.equals(training.getUserCustom())) {
            trainingRepository.delete(training);
            return TrainingDto.fromEntity(training);
        } else {
            throw new IllegalArgumentException("기본 운동은 삭제할 수 없습니다.");
        }
    }

    public List<TrainingDto> customTrainingList(Member member) {
        // Get the custom trainings for the current user
        List<Training> list = trainingRepository.findByMember_MemberId(member.getMemberId());
        return list.stream().map(TrainingDto::fromEntity).collect(Collectors.toList());
    }
}
