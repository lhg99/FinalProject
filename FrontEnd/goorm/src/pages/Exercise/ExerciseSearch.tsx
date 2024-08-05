import React, { useCallback, useEffect, useState } from 'react';
import { getExerciseData } from './api/exerciseApi';
import styled from 'styled-components';
import { SearchIcon } from '../../image/SearchIcon';
import { useExercise } from '../../contexts/exerciseContext';
import { Category, ExerciseData } from './ExerciseTypes';
import CustomExerciseModal from './components/Modal/CusomExerciseModal';

interface ExerciseSearchProps {
    onAddExercise: (exercise: ExerciseData) => void;
    onAddCustomExercise: (exercise: ExerciseData) => void;
}

const ExerciseSearch: React.FC<ExerciseSearchProps> = ({ onAddExercise, onAddCustomExercise }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredData, setFilteredData] = useState<ExerciseData[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const {
        state: { exercises, categories, selectedExercises }, 
        setCategories, 
        setExercises
    } = useExercise();

    // Fetch exercise data on initial render
    useEffect(() => {
        const fetchExerciseData = async () => {
            try {
                const exerciseData = await getExerciseData();
                setExercises(exerciseData);
                setFilteredData(exerciseData);
                const uniqueCategories: Category[] = Array.from(new Set(exerciseData.map(exercise => exercise.categoryId)))
                    .map(id => {
                        const category = exerciseData.find(exercise => exercise.categoryId === id);
                        return { categoryId: id, categoryName: category?.categoryName || '' };
                    });
                
                uniqueCategories.unshift({ categoryId: 0, categoryName: "전체" });

                setCategories(uniqueCategories);
            } catch (err) {
                console.error("운동 데이터 가져오기 실패", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExerciseData();
    }, []);

    const filterExercises = useCallback(() => {
        let filtered = exercises.filter(data => data.name.toLowerCase().includes(searchQuery.toLowerCase()));
        if (selectedCategories.length > 0 && !selectedCategories.includes("전체")) {
            filtered = filtered.filter(data => selectedCategories.includes(data.categoryName));
        }
        setFilteredData(filtered);
    }, [exercises, searchQuery, selectedCategories]);

    useEffect(() => {
        filterExercises();
    }, [searchQuery, selectedCategories, filterExercises]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        filterExercises();
    };

    const handleCategoryChange = (categoryName: string) => {
        if (categoryName === "전체") {
            if (selectedCategories.includes("전체")) {
                setSelectedCategories([]);
            } else {
                setSelectedCategories(["전체"]);
            }
        } else {
            const newSelectedCategories = selectedCategories.includes(categoryName)
                ? selectedCategories.filter(name => name !== categoryName) 
                : [...selectedCategories, categoryName];
            setSelectedCategories(newSelectedCategories);
        }
    };

    const handleAddExerciseClick = (exercise: ExerciseData) => {
        const isExerciseSelected = selectedExercises.some(selected => selected.name.toLowerCase() === exercise.name.toLowerCase());
        if (!isExerciseSelected) {
            onAddExercise(exercise);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSave = (exerciseName: string) => {
        if (selectedCategories.length === 0) {
            alert("카테고리를 선택해주세요");
            return;
        }

        const category = categories.find(cat => cat.categoryName === selectedCategories[0]);

        if (!category) {
            alert("유효한 카테고리를 선택해주세요");
            return;
        }

        const maxId = Math.max(0, ...exercises.map(exercise => exercise.id));

        const newCustomExercise: ExerciseData = { 
            name: exerciseName,
            id: maxId + 1,
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            isAddingExercise: true
        };

        onAddCustomExercise(newCustomExercise);
        console.log("newCustomExercise: ", newCustomExercise);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ExerciseSearchContainer>
            <CategoriesContainer>
                {categories.map((option, index) => (
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
            <SearchForm onSubmit={handleSearchClick}>
                <SearchInput 
                    type="text" 
                    placeholder='운동 검색' 
                    value={searchQuery}
                    onChange={handleSearchChange} 
                />
                <SearchButton type='submit'>
                    <SearchIcon />
                </SearchButton>
            </SearchForm>
            <ExerciseListContainer>
                <ExerciseItemButton onClick={() => setIsModalOpen(true)}>직접 입력하기</ExerciseItemButton>
                {filteredData.map(data => (
                    <ExerciseItemButton key={data.id} onClick={() => handleAddExerciseClick(data)}>
                        {data.name}
                    </ExerciseItemButton>
                ))}
            </ExerciseListContainer>
            <CustomExerciseModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleModalSave}
            />
        </ExerciseSearchContainer>
    );
};

export default ExerciseSearch;

const ExerciseSearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: .625rem;
    width: 22%;
    max-height: 35rem;
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

const ExerciseListContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 1.875rem;
    margin-top: 0.625rem;
    margin-bottom: 1.25rem;
`;

const ExerciseItemButton = styled.button`
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
