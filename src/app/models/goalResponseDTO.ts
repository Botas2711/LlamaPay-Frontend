export interface GoalResponseDTO {
    id: number;
    name: string;
    description: String;
    amount: number;
    startDate: string;
    deadline: string;
    isSuccessfull: boolean,
    netAmount: number
}