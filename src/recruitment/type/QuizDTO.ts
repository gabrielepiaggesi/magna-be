export type QuizDTO = {
    author_user_id: number;
    minutes: number;
    check_camera: number;
    check_mic: number;
    topic: string;
    category: string;
    difficulty_level: number;
    public: number;
    tests_amount: number;
    tests_points: number;

    job_offer_id?: number;
    exam_id?: number;
    job_offer_quiz_id?: number;
    position_order?: number;
    company_id?: number;
    required?: boolean;
    quiz_id?: number;
};