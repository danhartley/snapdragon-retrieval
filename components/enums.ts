enum LESSON_TYPE {
    FLASHCARDS = "flashcards",
    TESTS = "tests"
};

enum TEST_TYPE {
    UNORDERED = "unordered",
    ORDERED = "ordered"
};

enum TRILEAN {
    TRUE = "true",
    FALSE = "false",
    UNKNOWN = "unknown"
};

enum TEST_STATE {
    RUNNING = "ready",
    COMPLETED = "completed",
    MARKED = "marked"
}

enum DIRECTION {
    Previous = 1,
    Next
};

export const enums = {
    LESSON_TYPE,
    TEST_TYPE,
    TEST_STATE,
    TRILEAN,
    DIRECTION
}