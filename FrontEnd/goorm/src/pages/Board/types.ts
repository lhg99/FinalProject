
export enum BoardType {
  FREE = 'FREE',
  WORKOUT = 'WORKOUT',
  DIET = 'DIET'
}

export interface BoardPost {
    boardType: string;
    title: string;
    content: string;
    questionId: number;
}

export interface BoardDetails {
    boardId: number;
    writer: string;
    boardTitle: string;
    boardContent: string;
    boardRegDate: string;
    viewCnt: number;
    likesCnt: number;
    reportsCnt: number;
    boardType: string;
    boardCategory: string;
    imageUrls: string[];
    likes: boolean;
    trainingRecordItems?: { 
        recordId: number;
        exerciseDate: string;
        categoryName: string;
        trainingName: string;
        durationMinutes: number;
        caloriesBurned: number;
        sets: number;
        reps: number;
        weight: number;
        distance: number;
        incline: number;
    }[];
    dietRecordItems?: {
        dietId: number;   // 식단 기록 번호
        mealTime: string;  // 식사종류 (예: "BREAKFAST")
        dietDate: string;  // 식단 날짜 (예: "2024-01-05")
        quantity: number | null;    // 개수
        gram: number | null;   // 그램수 
        foodRes: {     // 음식에 대한 정보
          foodId: number;       
          userName: string;  
          foodName: string;  
          gram: number;   
          calories: number;
          carbohydrate: number;  
          protein: number;
          fat: number; 
          sugar: number | null;
          salt: number; 
          cholesterol: number | null;
          saturatedFat: number | null;
          transFat: number | null;
          useCount: number;
          userRegister: boolean;
        };
        totalCalories: number; // 총 칼로리
        totalGram: number | null;  // 총 그램수
        memo: string;  // 메모
    }[];
}


export interface PostListProps {
    posts: BoardDetails[];
}

export interface BoardTabsProps {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

export interface PaginationProps {
    totalPages: number;
    currentPage: number;
    paginate: (pageNumber: number) => any;
}

export interface PostItemProps {
    post: BoardDetails;
}

export interface SearchbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface BoardProps { 
    boardType: string;
    currentPage: number;
    postsPerPage: number;
    posts: BoardDetails[];
    setPosts: React.Dispatch<React.SetStateAction<BoardDetails[]>>;
}

export interface Comment {
    commentId: number;
    writerId: number;
    writer: string;
    commentRegDate: string;
    commentContent: string;
}
