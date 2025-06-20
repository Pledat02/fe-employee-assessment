// types.ts
export interface User {
    role: 'employee' | 'supervisor' | 'manager';
}

export interface Profile {
    code: string;
    [key: string]: any;
}

export interface EvaluationCycle {
    evaluation_cycle_id: string;
    cycle_name: string;
}

export interface CriteriaForm {
    criteria_form_id: string;
    [key: string]: any;
}

export interface Criteria {
    evaluation_criteria_id: string;
    criteria_name: string;
}

export interface Question {
    evaluation_question_id: string;
    evaluation_criteria_id: string;
    question_name: string;
    max_score: number;
    criteria_name: string;
}

export interface Score {
    employee: number;
    supervisor: number;
    manager: number;
}

export interface Comment {
    employee: string;
    supervisor: string;
    manager: string;
}

export interface EvaluationAnswer {
    evaluation_answer_id: string;
    total_score?: number;
    total_score_supervisor?: number;
    total_score_manage?: number;
}

export interface EvaluationAnswerDetail {
    evaluation_answer_detail_id: string;
    evaluation_question_id: string;
    employee_score?: number;
    supervisor_score?: number;
    manager_score?: number;
    employee_comment?: string;
    supervisor_comment?: string;
    manager_comment?: string;
}