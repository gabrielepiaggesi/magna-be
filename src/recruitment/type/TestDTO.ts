export type TestDTO = {
    quiz_id: number;
    question: string;
    minutes: number;
    type: string;
    points: number;
    position_order: number;
    difficulty_level: number;
    old_right_option: number;
    new_right_option: number;
}