import { ExerciseRecords } from "../../../pages/Exercise/ExerciseTypes";

export interface RecordResponse {
    content: ExerciseRecords[];
    totalPages: number;
    totalElements: number;
}