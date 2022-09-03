export interface QuizApi {
    createQuiz(...args);
    updateQuizAndJobOfferQuiz(...args);
    createTest(...args);
    updateTest(...args);
    editTestOption(...args);
    removeTestOption(...args);
    editTestText(...args);
    removeTestText(...args);
    createNewTestImage(...args);
    removeTestImage(...args);
    getTest(...args);
    getJobOfferQuiz(...args);
}