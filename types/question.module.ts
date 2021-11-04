import { NextRouter } from "next/router";
import question, { option } from "./question";

export interface Props {
    router: NextRouter;
    questions: question[]
};

export interface State {
    index: number;
    answers: Map<string, option>;
    loading: boolean;
    reachedEnd: boolean;
    bug: boolean;
};