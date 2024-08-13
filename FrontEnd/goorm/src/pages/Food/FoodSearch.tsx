import React, { useEffect, useState } from 'react';
import { FoodData, FoodCategory } from './FoodTypes';
import styled from 'styled-components';
import { SearchIcon } from '../../image/Icon/SearchIcon';
import { useFood } from '../../contexts/foodContext';
import CustomFoodModal from '../../components/Modal/Food/CustomFoodModal';
import { getFoodByName, getFoodData } from '../../api/Food/foodApi';
import { ModalStore } from '../../store/store';
import { MEAL_TIMES } from '../../constants/Food/MealTime';

interface FoodSearchProps {
    onAddFood: (food: FoodData) => void;
    onAddCustomFood: (food: FoodData, MealTime: string) => void;
}

const FoodSearch = ({ onAddFood, onAddCustomFood } : FoodSearchProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredData, setFilteredData] = useState<FoodData[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const { state: { food, selectedFood, foodCategories, mealTime }, setFoodCategories, setFood, setMealTime, addSelectedFood } = useFood();
    const { modals, openModal, closeModal } = ModalStore();

    const [nutritionDetails, setNutritionDetails] = useState<Omit<FoodData, 'foodId' | 'foodName'>>({
        amount: 0,
        calories: 0,
        carbohydrate: 0,
        protein: 0,
        fat: 0,
        cholesterol: 0,
        sugar: 0,
        salt: 0,
        saturatedFat: 0,
        transFat: 0,
    });

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const foodData = await getFoodData();
                console.log("음식 가져오기", foodData);
                setFood(foodData);
                setFilteredData(foodData);
                const categories: FoodCategory[] = [
                    { categoryName: "아침" }, // mealTime: BREAKFAST
                    { categoryName: "점심" }, // mealTime: LUNCH
                    { categoryName: "저녁" }, // mealTime: DINNER
                    { categoryName: "간식" } // mealTime: SNACK
                ];
                setFoodCategories(categories);
            } catch (error) {
                throw error;
            } finally {
                setLoading(false);
            }
        }
        fetchdata();
    }, []);

    useEffect(() => {
        if (selectedCategories.length > 0) {
            const lastCategory = selectedCategories[selectedCategories.length - 1];
            switch (lastCategory) {
                case '아침':
                    setMealTime(MEAL_TIMES.BREAKFAST);
                    break;
                case '점심':
                    setMealTime(MEAL_TIMES.LUNCH);
                    break;
                case '저녁':
                    setMealTime(MEAL_TIMES.DINNER);
                    break;
                case '간식':
                    setMealTime(MEAL_TIMES.SNACK);
                    break;
                default:
                    setMealTime(MEAL_TIMES.OTHER);
            }
        }
    }, [selectedCategories]);

    const handleCategoryChange = (categoryName: string) => {
        console.log("Selected category:", categoryName); // 선택된 카테고리 확인
        const newSelectedCategories = selectedCategories.includes(categoryName)
            ? selectedCategories.filter(name => name !== categoryName)
            : [...selectedCategories, categoryName];

        if (newSelectedCategories.length > 1) {
            alert("카테고리는 하나만 선택하세요");
            return;
        }
            
        setSelectedCategories(newSelectedCategories);
    };

    const handleSearchClick = async () => {
        if (searchQuery.trim() === "") {
            setFilteredData(food); // 검색어가 없을 경우 모든 데이터를 표시
            return;
        }
        try {
            const response = await getFoodByName(searchQuery);
            if (response) {
                setFilteredData(response); // 검색 결과로 filteredData 업데이트
                console.log("handleSearch 결과: ", response);
            }
        } catch (error) {
            console.error("검색 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        handleSearchClick();
    }, [searchQuery]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }

    const handleAddFoodClick = (food: FoodData) => {
        if (selectedCategories.length === 0) {
            alert("카테고리를 선택하세요");
            return;
        }
    
        const isFoodSelected = selectedFood.some(selected => selected.foodName.toLowerCase() === food.foodName.toLowerCase());
        if (!isFoodSelected) {
            addSelectedFood(food, mealTime);
        }
    };

    const handleModalClose = () => {
        closeModal("customFoodModal");
    };

    const handleModalSave = (foodName: string) => {
        if (selectedCategories.length === 0) {
            alert("카테고리를 선택해주세요");
            return;
        }

        const category = foodCategories.find(cat => cat.categoryName === selectedCategories[0]);

        if (!category) {
            alert("유효한 카테고리를 선택해주세요");
            return;
        }

        const maxId = Math.max(0, ...food.map(f => f.foodId));

        const newCustomFood: FoodData = {
            foodId: maxId + 1,
            foodName,
            ...nutritionDetails // 영양소 정보 추가
        };

        onAddCustomFood(newCustomFood, mealTime); // 선택된 MealTime을 함께 전달
        console.log("newCustomFood: ", newCustomFood);
    };

    return (
        <FoodSearchContainer>
            <CategoriesContainer>
                {foodCategories.map((option, index) => (
                    <CategoryText key={index}>
                        <input 
                            type='checkbox' 
                            checked={selectedCategories.includes(option.categoryName)}
                            onChange={() => handleCategoryChange(option.categoryName)} 
                        />
                        {option.categoryName}
                    </CategoryText>
                ))}
            </CategoriesContainer>
            <SearchForm onSubmit={(e) => {
                e.preventDefault();
            }}>
                <SearchInput 
                    type="text" 
                    placeholder='식단 검색' 
                    value={searchQuery}
                    onChange={handleSearchChange} 
                />
                <SearchButton type='submit'>
                    <SearchIcon />
                </SearchButton>
            </SearchForm>
            <FoodListContainer>
                <FoodItemButton onClick={() => openModal("customFoodModal")}>직접 입력하기</FoodItemButton>
                {filteredData.map(data => (
                    <FoodItemButton key={data.foodId} onClick={() => handleAddFoodClick(data)}>
                        {data.foodName}
                    </FoodItemButton>
                ))}
            </FoodListContainer>
            <CustomFoodModal
                isOpen={modals.customFoodModal?.isOpen}
                onClose={handleModalClose}
                onSave={handleModalSave}
            />
        </FoodSearchContainer>
    );
}

export default FoodSearch;

const FoodSearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.625rem;
    width: 17.5rem;
    max-height: 36.25rem;
    overflow-y: auto;
    border-radius: 5px;

    &::-webkit-scrollbar {
        width: 12px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 0.9375rem;
        margin-right: 0.625rem;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 0.9375rem;
        border: 1px solid #f1f1f1;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

const CategoriesContainer = styled.div`
    margin-top: .625rem;
    font-size: 0.875rem;
    display: flex;
`;

const CategoryText = styled.label`
    margin-right: 5px;

    input {
        margin-right: 5px; /* 간격 조정 */
    }
`

const SearchForm = styled.form`
    margin-top: .625rem;
    width: 100%;
    display: flex;
`;

const SearchInput = styled.input`
    width: 72%;
    padding: 8px;
    display: flex;
`;

const SearchButton = styled.button`
    padding: 10px;
    border: 1px solid black;
    background-color: white;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-left: 0.625rem;

    svg {
        width: 20px;
        height: 20px;
    }

    &:hover {
        background-color: #f0f0f0;
    }
`;

const FoodListContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 1.875rem;
    margin-top: 0.625rem;
    margin-bottom: 1.25rem;
`;

const FoodItemButton = styled.button`
    width: 100%;
    height: 2.1875rem;
    justify-content: center;
    align-items: center;
    border-radius: 0.9375rem;
    font-size: 0.875rem;
    border: 1px solid #AFAFAF;
    border-radius: 0;
    background-color: white;

    &:hover {
        background-color: #f0f0f0;
    }
`;
