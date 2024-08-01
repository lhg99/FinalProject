package backend.goorm.diet.api;

import backend.goorm.diet.entity.Food;
import com.fasterxml.jackson.databind.JsonNode;

public class FoodDataMapper {
    public static Food mapJsonToFoodEntity(JsonNode foodJson) {
        Food food = new Food();
        food.setFoodName(foodJson.get("DESC_KOR").asText());
        food.setGram(parseFloatOrNull(foodJson.get("SERVING_WT").asText()));
        food.setCalories(parseFloatOrNull(foodJson.get("NUTR_CONT1").asText()));
        food.setCarbohydrate(parseFloatOrNull(foodJson.get("NUTR_CONT2").asText()));
        food.setProtein(parseFloatOrNull(foodJson.get("NUTR_CONT3").asText()));
        food.setFat(parseFloatOrNull(foodJson.get("NUTR_CONT4").asText()));
        food.setSugar(parseFloatOrNull(foodJson.get("NUTR_CONT5").asText()));
        food.setSalt(parseFloatOrNull(foodJson.get("NUTR_CONT6").asText()));
        food.setCholesterol(parseFloatOrNull(foodJson.get("NUTR_CONT7").asText()));
        food.setSaturatedFat(parseFloatOrNull(foodJson.get("NUTR_CONT8").asText()));
        food.setTransFat(parseFloatOrNull(foodJson.get("NUTR_CONT9").asText()));

        return food;
    }

    private static Float parseFloatOrNull(String value) {
        try {
            return value.equals("N/A") ? null : Float.parseFloat(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
