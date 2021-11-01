export default interface question {
    id: string;
    question: string;
    options: option[]
}

export interface option {
    name: string;
    value: string
}