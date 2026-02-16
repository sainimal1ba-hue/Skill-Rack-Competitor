import { createContext, useContext, useReducer } from 'react';

const initialState = {
  activeContest: null,
  currentQuestionIndex: 0,
  answers: {}, // { [questionId]: { code, language, submitted, verdict } }
  isFinished: false,
};

function contestReducer(state, action) {
  switch (action.type) {
    case 'START_CONTEST':
      return {
        ...state,
        activeContest: action.payload.contest,
        currentQuestionIndex: 0,
        answers: {},
        isFinished: false,
      };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: {
            ...state.answers[action.payload.questionId],
            ...action.payload,
          },
        },
      };
    case 'GOTO_QUESTION':
      return {
        ...state,
        currentQuestionIndex: action.payload.index,
      };
    case 'FINISH_CONTEST':
      return {
        ...state,
        isFinished: true,
      };
    case 'RESET_CONTEST':
      return initialState;
    default:
      return state;
  }
}

const ContestContext = createContext();

export function ContestProvider({ children }) {
  const [state, dispatch] = useReducer(contestReducer, initialState);

  return (
    <ContestContext.Provider value={{ state, dispatch }}>
      {children}
    </ContestContext.Provider>
  );
}

export function useContest() {
  return useContext(ContestContext);
}