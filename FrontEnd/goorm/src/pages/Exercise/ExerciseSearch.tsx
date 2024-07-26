import React, { useCallback, useEffect, useState } from 'react'
import { Category, ExerciseData, getExerciseData, postCustomExerciseData } from './api/exerciseApi';
import { ExerciseStore } from '../../store/store';
import styled from 'styled-components';
import { SearchIcon } from '../../image/SearchIcon';

interface ExerciseSearchProps {
    onAddExercise: (exercise: ExerciseData) => void;
    onAddCustomExercise: (exercise: ExerciseData) => void;
}

const ExerciseSearch: React.FC<ExerciseSearchProps> = ({ onAddExercise, onAddCustomExercise }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredData, setFilteredData] = useState<ExerciseData[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [customExerciseName, setCustomExerciseName] = useState<string>("");

    const {exercises, categories, selectedExercises, setCategories, setExercises, addSelectedExercises} = ExerciseStore();

    // api에 저장된 운동 리스트 가져오기
    useEffect(() => {
        const fetchExerciseData = async () => {
            try {
                const exerciseData = await getExerciseData();
                setExercises(exerciseData);
                setFilteredData(exerciseData);
                const uniqueCategories = Array.from(new Set(exerciseData.map(exercise => exercise.categoryName)))
                setCategories(uniqueCategories.map(categoryName => ({ categoryName })));
        } catch(err) {
            console.error("운동 데이터 가져오기 실패", err);
        } finally {
            setLoading(false);
        }
    };
    fetchExerciseData();
    }, [setCategories, setExercises]);

    useEffect(() => {
        console.log("Updated selectedExercises in ExerciseSearch:", selectedExercises);
    }, [selectedExercises]);

    const filterExercises = useCallback(() => {
        const filtered = exercises
            .filter(data => data.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(data => {
                const category = categories.find(cat => cat.categoryName === data.categoryName);
                return {
                    ...data,
                    category_name: category ? category.categoryName : "unknown"
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
        selectedCategories: string[]
    ):ExerciseData[] => {
        return exercises.map(data => {
            const category = categories.find(cat => cat.categoryName === data.categoryName);
            return {
                ...data,
                category_name: category ? category.categoryName : "unknown"
            };
        }).filter(data => selectedCategories.length === 0 || selectedCategories.includes(data.category_name));
    };

    // 카테고리 다른걸 클릭시 카테고리 바꾸기
    const handleCategoryChange = (categoryName: string) => {
        if (categoryName === "전체") {
            if (selectedCategories.includes("전체")) {
                // 전체 카테고리 선택시 모든 카테고리를 해제하고 전체 운동목록 설정
                setSelectedCategories([]);
                setFilteredData(getUpdatedFilteredData(exercises, categories, []));
            } else {
                // 전체 카테고리 선택 안하면 모든 카테고리 선택하고 전체 운동목록 설정
                const allCategoryNames = categories.map(cat => cat.categoryName);
                setSelectedCategories(allCategoryNames);
                setFilteredData(getUpdatedFilteredData(exercises, categories, allCategoryNames));
            }
        } else {
            const newSelectedCategories = selectedCategories.includes(categoryName)
                ? selectedCategories.filter(name => name !== categoryName) 
                : [...selectedCategories, categoryName];
    
            setSelectedCategories(newSelectedCategories);
    
            // 선택된 카테고리가 없으면 전체 데이터
            setFilteredData(getUpdatedFilteredData(exercises, categories, newSelectedCategories));
        }
    }

    // 운동 추가시 이미 선택된 운동인지 확인
    const handleAddExerciseClick = (exercise: ExerciseData) => {
        const isExerciseSelected = selectedExercises.some(selected => selected.name.toLowerCase() === exercise.name.toLowerCase());
        if(!isExerciseSelected) {
            onAddExercise(exercise);
        }
    };

    // 사용자 정의 운동 추가시 호출되는 함수
    const handleAddCustomExerciseClick = async() => {
        if (selectedCategories.length === 0) {
            alert("카테고리를 선택해주세요");
            return;
        }

        const category = categories.find(cat => cat.categoryName === selectedCategories[0]);

        if (!category) {
            alert("유효한 카테고리를 선택해주세요");
            return;
        }

        const newCustomExercise: ExerciseData = { 
            name: customExerciseName,
            id: 100,
            categoryName: category.categoryName
        };

        // onAddCustomExercise(newCustomExercise);
        // addSelectedExercises(newCustomExercise);
        // setCustomExerciseName(""); // 입력 필드 초기화

        try {
            await postCustomExerciseData(newCustomExercise);
            onAddCustomExercise(newCustomExercise);
            setCustomExerciseName(""); // 입력 필드 초기화
        } catch(err) {
            console.error("새로운 운동 저장 실패", err);
            alert("운동 추가 실패");
        }
    };

    if(loading) {
        return <div>Loading...</div>
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
                    ))
                }
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
                <ExerciseItemButton onClick={handleAddCustomExerciseClick}>직접 입력하기</ExerciseItemButton>
                {filteredData.map(data => (
                    <ExerciseItemButton key={data.id} onClick={() => handleAddExerciseClick(data)}>
                        {data.name}
                    </ExerciseItemButton>
                    ))
                }
            </ExerciseListContainer>
        </ExerciseSearchContainer>
    )
}

export default ExerciseSearch

const ExerciseSearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: .625rem;
    width: 75%;
    height: 500px;
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #AFAFAF;
    border-radius: 5px;
    // box-sizing: border-box;

    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
        width: 12px; /* 스크롤바의 너비 */
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1; /* 스크롤바 트랙의 배경색 */
        border-radius: 0.9375rem;
        margin-right: 0.625rem; /* 스크롤바 트랙의 오른쪽 여백 */
    }

    &::-webkit-scrollbar-thumb {
        background: #888; /* 스크롤바의 색상 */
        border-radius: 0.9375rem; /* 스크롤바 모서리 둥글게 */
        border: 2px solid #f1f1f1; /* 스크롤바의 테두리 */
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555; /* 스크롤바의 색상 (hover 상태) */
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
    width: 66%;
    padding: 8px;
    display: flex;
`;

const SearchButton = styled.button`
    margin-left: 0.625rem;
    height: 35.2px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const ExerciseListContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 1.875rem;
    margin-top: 1.25rem;
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