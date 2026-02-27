import API from "./api";

/* -------- Start Quiz -------- */
export const startQuiz = (userId, subjectId) => {
    return API.post("/api/sessions/start", {
        user: { id: userId },
        subject: { id: subjectId }
    });
};

/* -------- Save Attempt -------- */
export const saveAttempt = (attemptData) => {
    return API.post("/api/attempts", attemptData);
};

/* -------- Finish Quiz -------- */
export const finishQuiz = (sessionId, data) => {
    return API.post(`/api/sessions/finish/${sessionId}`, data);
};

/* -------- Get User Sessions -------- */
export const getUserSessions = (userId) => {
    return API.get(`/api/sessions/user/${userId}`);
};