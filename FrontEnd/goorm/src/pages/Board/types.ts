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
    setPosts: React.Dispatch<React.SetStateAction<BoardDetails[]>>; // setPosts 추가
}

export interface Comment {
    commentId: number;
    writerId: number;
    writer: string;
    commentRegDate: string;
    commentContent: string;
}
