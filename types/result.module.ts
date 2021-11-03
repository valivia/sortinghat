import { NextRouter } from "next/router";
import result from "./result";

export interface State {
    invalid: boolean;
    loading: boolean;
    data?: result[];
};

export interface Props {
    router: NextRouter;
};