export interface ExamApi {
    createExam(...args);
    updateExam(...args);
    updateExamSkill(...args);
    addExamSkill(...args);
    removeExamSkill(...args);
    getExams(...args);
    getExam(...args);
    getExamSkills(...args);
    getUsersDataOptions(...args);
    setExamUserData(...args);
    getExamUserData(...args);
    addExamUserData(...args);
    removeExamUserData(...args);
    getExamUserApplicationsList(...args);
}