import React, { FC, useReducer } from 'react';

type Action = { type: ActionTypes; value: string };
type Dispatch = (action: Action) => void;
type State = { path: string };
type FileProviderProps = { children: React.ReactNode };

export enum ActionTypes {
    setpath = 'setpath',
}

export const FileContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

const fileReducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionTypes.setpath: {
            return { ...state, path: action.value };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

const FileProvider: FC<FileProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(fileReducer, { path: '' });
    const value = { state, dispatch };
    return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

const useFile = () => {
    const context = React.useContext(FileContext);

    if (context === undefined) {
        throw new Error('useCount must be used within a CountProvider');
    }

    return context;
};

export { FileProvider, useFile };
