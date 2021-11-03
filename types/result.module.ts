import { NextRouter } from "next/router";
import result from "./result";

export interface state {
    invalid: boolean;
    loading: boolean;
    data: result[];
}

export interface props {
    router: NextRouter;
}