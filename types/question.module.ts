import { NextRouter } from "next/router";
import question, { option } from "./question";

export interface props {
    router: NextRouter;
    questions: question[]
}

export interface state {
    index: number;
    answers: Map<string, option>;
    loading: boolean;
}