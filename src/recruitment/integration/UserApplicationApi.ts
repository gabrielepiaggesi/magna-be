export interface UserApplicationApi {
    createUserApplication(...args);
    getUserApplication(...args);
    createUserQuiz(...args);
    createUserTest(...args);
    updateUserTest(...args);
    confirmAndSendUserQuiz(...args);
    getUserQuiz(...args);
}