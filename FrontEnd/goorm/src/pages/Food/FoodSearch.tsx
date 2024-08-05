import React, { useCallback, useEffect, useState } from 'react'
import { FoodData, FoodCategory } from './FoodTypes';
import styled from 'styled-components';
import { SearchIcon } from '../../image/SearchIcon';
// import { getDietRecord, getFoodData, postSearhFood } from './api/foodApi';
import { useFood } from '../../contexts/foodContext';
import CustomFoodModal from './components/Modal/CustomFoodModal';

interface FoodSearchProps {
    onAddFood: (food: FoodData) => void;
    onAddCustomFood: (food: FoodData) => void;
}

const FoodSearch : React.FC<FoodSearchProps> = ({onAddFood, onAddCustomFood}) => {
    // const [loading, setLoading] = useState<boolean>(true);
    // const [searchQuery, setSearchQuery] = useState<string>("");
    // const [filteredData, setFilteredData] = useState<FoodData[]>([]);
    // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // const { state: {food, selectedFood, foodCategories}, setFoodCategories, setFood} = useFood();

    // useEffect(() => {
    //     const fetchdata = async() => {
    //         try {
    //             const foodData = await getFoodData();
    //             setFood(foodData);
    //             setFilteredData(foodData);
    //             const categories: FoodCategory[] = [
    //                 { categoryName: "전체" },
    //                 { categoryName: "아침" }, // mealTime: BREAKFAST
    //                 { categoryName: "점심" }, // mealTime: LUNCH
    //                 { categoryName: "저녁" }, // mealTime: DINNER
    //                 { categoryName: "간식" } // mealTime: SNACK
    //             ];
    //             setFoodCategories(categories);
    //         } catch (error) {
    //             throw error;
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     fetchdata();
    // }, []);

    // const handleCategoryChange = (categoryName: string) => {
    //     if (categoryName === "전체") {
    //         if (selectedCategories.includes("전체")) {
    //             setSelectedCategories([]);
    //         } else {
    //             setSelectedCategories(["전체"]);
    //         }
    //     } else {
    //         const newSelectedCategories = selectedCategories.includes(categoryName)
    //             ? selectedCategories.filter(name => name !== categoryName) 
    //             : [...selectedCategories, categoryName];
    //         setSelectedCategories(newSelectedCategories);
    //     }
    // };

    // const handleSearchClick = async(searchQuery: string) => {
    //     const response = await postSearhFood(searchQuery);
    // }

    // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchQuery(event.target.value);
    // }

    // const handleAddFoodClick = (food: FoodData) => {
    //     const isFoodSelected = selectedFood.some(selected => selected.foodName.toLowerCase() === food.foodName.toLowerCase());
    //     if (!isFoodSelected) {
    //         onAddFood(food);
    //     }
    // }

    // const handleModalClose = () => {
    //     setIsModalOpen(false);
    // };

    // const handleModalSave = (name: string) => {
    //     if (selectedCategories.length === 0) {
    //         alert("카테고리를 선택해주세요");
    //         return;
    //     }

    //     const category = foodCategories.find(cat => cat.categoryName === selectedCategories[0]);

    //     if (!category) {
    //         alert("유효한 카테고리를 선택해주세요");
    //         return;
    //     }

    //     const maxId = Math.max(0, ...food.map(food => food.foodId));

    //     const newCustomFood: FoodData = { 
    //         foodId: maxId + 1,
    //         foodName: name,
    //         amount: selectedFood,
    //         calories: selectedFood,
    //         carbohydrate: selectedFood,
    //         protein: selectedFood,
    //         fat: selectedFood,
    //     };

    //     onAddCustomFood(newCustomFood);
    //     console.log("newCustomFood: ", newCustomFood);
    // };

    return (
        <FoodSearchContainer>
            {/* <CategoriesContainer>
                {foodCategories.map((option, index) => (
                    <label key={index}>
                        <input 
                            type='checkbox' 
                            checked={selectedCategories.includes(option.categoryName)}
                            onChange={() => handleCategoryChange(option.categoryName)} 
                        />
                        {option.categoryName}
                    </label>
                ))}
            </CategoriesContainer>
            <SearchForm onSubmit={() => handleSearchClick(searchQuery)}>
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
                <FoodItemButton onClick={() => setIsModalOpen(true)}>직접 입력하기</FoodItemButton>
                {filteredData.map(data => (
                    <FoodItemButton key={data.foodId} onClick={() => handleAddFoodClick(data)}>
                        {data.foodName}
                    </FoodItemButton>
                ))}
            </FoodListContainer>
            <CustomFoodModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleModalSave}
            /> */}
        </FoodSearchContainer>
    );
}

export default FoodSearch;

const FoodSearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: .625rem;
    width: 22%;
    max-height: 33.4375rem;
    overflow-y: auto;
    border: 1px solid #AFAFAF;
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
        border: 2px solid #f1f1f1;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

const CategoriesContainer = styled.div`
    margin-top: .625rem;
    font-size: 0.875rem;
`;

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
    margin-left: 0.625rem;
    height: 35.2px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    height: 100%;
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