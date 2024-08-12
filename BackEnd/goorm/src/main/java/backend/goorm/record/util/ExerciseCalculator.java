package backend.goorm.record.util;

import backend.goorm.member.model.entity.Member;
import backend.goorm.member.model.entity.MemberInfo;
import backend.goorm.member.model.enums.Gender;
import backend.goorm.member.repository.MemberInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ExerciseCalculator {

    private final MemberInfoRepository memberInfoRepository;

    @Autowired
    public ExerciseCalculator(MemberInfoRepository memberInfoRepository) {
        this.memberInfoRepository = memberInfoRepository;
    }

    public Float calculateRMR(Member member) {
        // RMR 계산 로직
        MemberInfo memberInfo = memberInfoRepository.findByMemberId(member)
                .orElseThrow(() -> new IllegalArgumentException("Member information not found for member id: " + member.getMemberId()));

        Float weight = memberInfo.getMemberWeight();
        Float height = memberInfo.getMemberHeight();
        Integer age = memberInfo.getMemberAge();
        Gender gender = memberInfo.getMemberGender();

        if ("male".equalsIgnoreCase(String.valueOf(gender))) {
            return 66.47f + (13.75f * weight) + (5.003f * height) - (6.755f * age);
        } else {
            return 655.1f + (9.563f * weight) + (1.850f * height) - (4.676f * age);
        }
    }

    public Float calculateCaloriesBurned(Member member, Float metValue, Float durationInMinutes) {
        // RMR을 사용해 소모된 칼로리를 계산하는 로직
        MemberInfo memberInfo = memberInfoRepository.findByMemberId(member)
                .orElseThrow(() -> new IllegalArgumentException("Member information not found for member id: " + member.getMemberId()));

        Float rmrKcalPerDay = calculateRMR(member);
        Float rmrMlKgMin = (rmrKcalPerDay / 1440) / 5 * 1000 / memberInfo.getMemberWeight();
        Float correctedMET = metValue * (3.5f / rmrMlKgMin);
        return correctedMET * memberInfo.getMemberWeight() * (durationInMinutes / 60);
    }

    public Float calculateCaloriesForRunning(Member member, String intensity, Float durationInMinutes) {
        // 강도에 따른 러닝 MET 값을 설정하고, 소모된 칼로리를 계산하는 로직
        Float metValue;
        switch (intensity.toLowerCase()) {
            case "low":
                metValue = 7.0f;
                break;
            case "middle":
                metValue = 11.5f;
                break;
            case "high":
                metValue = 16.0f;
                break;
            default:
                throw new IllegalArgumentException("Invalid intensity level: " + intensity);
        }
        return calculateCaloriesBurned(member, metValue, durationInMinutes);
    }

    public Float calculateCaloriesForWalking(Member member, String intensity, Float durationInMinutes) {
        // 강도에 따른 걷기 MET 값을 설정하고, 소모된 칼로리를 계산하는 로직
        Float metValue;
        switch (intensity.toLowerCase()) {
            case "low":
                metValue = 2.5f;
                break;
            case "middle":
                metValue = 3.5f;
                break;
            case "high":
                metValue = 5.5f;
                break;
            default:
                throw new IllegalArgumentException("Invalid intensity level: " + intensity);
        }
        return calculateCaloriesBurned(member, metValue, durationInMinutes);
    }
    public Float calculateCaloriesForCycling(Member member, String intensity, Float durationInMinutes) {
        // 강도에 따른 자전거 타기 MET 값을 설정하고, 소모된 칼로리를 계산하는 로직
        Float metValue;
        switch (intensity.toLowerCase()) {
            case "low":
                metValue = 4.3f;
                break;
            case "middle":
                metValue = 7.0f;
                break;
            case "high":
                metValue = 9.0f;
                break;
            default:
                throw new IllegalArgumentException("Invalid intensity level: " + intensity);
        }
        return calculateCaloriesBurned(member, metValue, durationInMinutes);
    }

    public Float calculateCaloriesForStairClimbing(Member member, String intensity, Float durationInMinutes) {
        // 강도에 따른 자전거 타기 MET 값을 설정하고, 소모된 칼로리를 계산하는 로직
        Float metValue;
        switch (intensity.toLowerCase()) {
            case "low":
                metValue = 4.5f;
                break;
            case "middle":
                metValue = 6.8f;
                break;
            case "high":
                metValue = 9.3f;
                break;
            default:
                throw new IllegalArgumentException("Invalid intensity level: " + intensity);
        }
        return calculateCaloriesBurned(member, metValue, durationInMinutes);
    }
}
