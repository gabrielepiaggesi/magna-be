
export type ExamDTO = {
    role: string;
    description: string;
    status: 'DRAFT'|'CLOSED'|'ACTIVE';
    company_id: number;
    author_user_id: number;
}