import React, { useCallback, useEffect, useState } from 'react'
import { Category, ExerciseData, ExerciseInfo, getCategories, getExerciseData, postCustomExerciseData } from '../../api/exerciseApi';
import { ExerciseStore } from '../../store/store';
import styled from 'styled-components';

interface ExerciseSearchProps {
    onAddExercise: (exercise: ExerciseData) => void;
    onAddCustomExercise: (exercise: ExerciseData) => void;
}

const ExerciseSearch: React.FC<ExerciseSearchProps> = ({ onAddExercise, onAddCustomExercise }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredData, setFilteredData] = useState<ExerciseInfo[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [customExerciseName, setCustomExerciseName] = useState<string>("");

    const {exercises, categories, selectedExercises, setCategories, setExercises, addSelectedExercises} = ExerciseStore();

    // api에 저장된 운동 리스트 가져오기
    useEffect(() => {
        const fetchExerciseData = async () => {
            try {
                const [exercises, categories] = await Promise.all([getExerciseData(), getCategories()]);
                const exerciseInfo = exercises.map(exercise => {
                    const category = categories.find(cat => cat.category_id === exercise.category_id);
                    return {
                        ...exercise,
                        category_name: category ? category.category_name : "unknown"
                    };
                }
            );
            setCategories(categories);
            setExercises(exerciseInfo);
            setFilteredData(exerciseInfo);
        } catch(err) {
            console.error("운동 데이터 가져오기 실패", err);
        } finally {
            setLoading(false);
        }
    };
    fetchExerciseData();
    }, [setCategories, setExercises]);

    const filterExercises = useCallback(() => {
        const filtered = exercises
            .filter(data => data.training_name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(data => {
                const category = categories.find(cat => cat.category_id === data.category_id);
                return {
                    ...data,
                    category_name: category ? category.category_name : "unknown"
                };
            });
        setFilteredData(filtered);
    }, [exercises, searchQuery, categories]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
        
    // 검색 버튼 클릭시 필터링 실행
    const handleSearchClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        filterExercises();
    };

    const getUpdatedFilteredData = (
        exercises: ExerciseData[], 
        categories: Category[], 
        selectedCategories: number[]
    ):ExerciseInfo[] => {
        return exercises.map(data => {
            const category = categories.find(cat => cat.category_id === data.category_id);
            return {
                ...data,
                category_name: category ? category.category_name : "unknown"
            };
        }).filter(data => selectedCategories.length === 0 || selectedCategories.includes(data.category_id));
    };

    // 카테고리 다른걸 클릭시 카테고리 바꾸기
    const handleCategoryChange = (categoryId: number) => {
        if (categoryId === 0) {
            if (selectedCategories.includes(0)) {
                // 전체 카테고리 선택시 모든 카테고리를 해제하고 전체 운동목록 설정
                setSelectedCategories([]);
                setFilteredData(getUpdatedFilteredData(exercises, categories, []));
            } else {
                // 전체 카테고리 선택 안하면 모든 카테고리 선택하고 전체 운동목록 설정
                const allCategoryIds = categories.map(cat => cat.category_id);
                setSelectedCategories(allCategoryIds);
                setFilteredData(getUpdatedFilteredData(exercises, categories, allCategoryIds));
            }
        } else {
            const newSelectedCategories = selectedCategories.includes(categoryId)
                ? selectedCategories.filter(id => id !== categoryId) 
                : [...selectedCategories, categoryId];
    
            setSelectedCategories(newSelectedCategories);
    
            // 선택된 카테고리가 없으면 전체 데이터
            setFilteredData(getUpdatedFilteredData(exercises, categories, newSelectedCategories));
        }
    }

    // 운동 추가시 이미 선택된 운동인지 확인
    const handleAddExerciseClick = (exercise: ExerciseData) => {
        const isExerciseSelected = selectedExercises.some(selected => selected.training_name === exercise.training_name);
        if (!isExerciseSelected) { // 운동이 이미 선택된 목록에 없는지 확인
            onAddExercise(exercise);
            addSelectedExercises(exercise);
        }
    };

    // 사용자 정의 운동 추가시 호출되는 함수
    const handleAddCustomExerciseClick = async() => {
        if (selectedCategories.length === 0) {
            alert("카테고리를 선택해주세요");
            return;
        }

        const category = categories.find(cat => cat.category_id === selectedCategories[0]);

        if (!category) {
            alert("유효한 카테고리를 선택해주세요");
            return;
        }

        const newCustomExercise: ExerciseData = { 
            training_name: customExerciseName,
            category_id: category.category_id,
        };

        onAddCustomExercise(newCustomExercise);
        addSelectedExercises(newCustomExercise);
        setCustomExerciseName(""); // 입력 필드 초기화

        // try {
        //     await postCustomExerciseData(newCustomExercise);
        //     onAddCustomExercise(newCustomExercise);
        //     addSelectedExercises(newCustomExercise);
        //     setCustomExerciseName(""); // 입력 필드 초기화
        // } catch(err) {
        //     console.error("새로운 운동 저장 실패", err);
        //     alert("운동 추가 실패");
        // }
    };

    if(loading) {
        return <div>Loading...</div>
    }
    
    return (
        <ExerciseSearchContainer>
            <CategoriesContainer>
                {categories.map(option => (
                    <label key={option.category_id}>
                        <input 
                            type='checkbox' 
                            checked={selectedCategories.includes(option.category_id)}
                            onChange={() => handleCategoryChange(option.category_id)} 
                        />
                        {option.category_name}
                    </label>
                    ))
                }
            </CategoriesContainer>
            <SearchForm onSubmit={handleSearchClick}>
                <input 
                    type="text" 
                    placeholder='운동 검색' 
                    value={searchQuery}
                    onChange={handleSearchChange} 
                />
                <button className="search-btn" type='submit'>검색</button>
            </SearchForm>
            <ExerciseListContainer>
                <ExerciseItemButton onClick={handleAddCustomExerciseClick}>직접 입력하기</ExerciseItemButton>
                {filteredData.map(data => (
                    <ExerciseItemButton key={data.training_name} onClick={() => handleAddExerciseClick(data)}>
                        {data.training_name}
                    </ExerciseItemButton>
                    ))
                }
            </ExerciseListContainer>
        </ExerciseSearchContainer>
    )
}

export default ExerciseSearch

const ExerciseSearchContainer = styled.div`
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    padding: .625rem;
    height: 30.625rem;
    border: 1px solid black;
    border-radius: 0.9375rem;
`;

const CategoriesContainer = styled.div`
    margin-top: .625rem;
`;

const SearchForm = styled.form`
    margin-top: .625rem;

    .search-btn {
        margin-left: .5rem;
    }
`;

const ExerciseListContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 1.875rem;
    margin-top: 1.25rem;
    gap: .625rem;
`;

const ExerciseItemButton = styled.button`
    width: 100%;
    justify-content: center;
    border-radius: 0.9375rem;

    &:hover {
        background-color: #f0f0f0;
    }
`;