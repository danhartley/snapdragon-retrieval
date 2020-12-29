enum LESSON_TYPE {
    CARDS = "cards",
    QUESTIONS = "questions"
};

enum QUESTION_TYPE {
    UNORDERED = "unordered",
    ORDERED = "ordered",
    MULTIPLE_CHOICE = "multiple choice",
    MULTIPLE_SELECT = "multiple select"
};

enum TRILEAN {
    TRUE = "true",
    FALSE = "false",
    UNKNOWN = "unknown"
};

enum QUESTION_STATE {
    RUNNING = "running",
    COMPLETED = "completed",
    MARKED = "marked"
}

enum DIRECTION {
    Previous = 1,
    Next
};

enum STORAGE_KEY {
    HISTORY = "history"
};

enum MULTIPLE_CHOICE_TYPE {
    PIE = "pie",
    RADIO_BUTTONS = "radio buttons"
}

export const enums = {
    LESSON_TYPE,
    QUESTION_TYPE,
    QUESTION_STATE,
    TRILEAN,
    DIRECTION,
    STORAGE_KEY,
    MULTIPLE_CHOICE_TYPE
}