// mockData.ts
import { Profile, EvaluationCycle, CriteriaForm, Criteria, Question, EvaluationAnswer, EvaluationAnswerDetail } from './types';

export const mockProfile: Profile = {
    code: 'EMP001',
    name: 'John Doe',
};

export const mockEvaluationCycles: EvaluationCycle[] = [
    { evaluation_cycle_id: 'cycle1', cycle_name: 'Q1 2025 Evaluation' },
    { evaluation_cycle_id: 'cycle2', cycle_name: 'Q2 2025 Evaluation' },
];

export const mockCriteriaForm: CriteriaForm = {
    criteria_form_id: 'form1',
    form_name: 'Performance Review Form',
};

export const mockCriterias: Criteria[] = [
    { evaluation_criteria_id: 'crit1', criteria_name: 'Technical Skills' },
    { evaluation_criteria_id: 'crit2', criteria_name: 'Communication' },
];

export const mockQuestions: Question[] = [
    {
        evaluation_question_id: 'q1',
        evaluation_criteria_id: 'crit1',
        question_name: 'Proficiency in programming',
        max_score: 100,
        criteria_name: 'Technical Skills',
    },
    {
        evaluation_question_id: 'q2',
        evaluation_criteria_id: 'crit1',
        question_name: 'Problem-solving ability',
        max_score: 100,
        criteria_name: 'Technical Skills',
    },
    {
        evaluation_question_id: 'q3',
        evaluation_criteria_id: 'crit2',
        question_name: 'Clarity in communication',
        max_score: 100,
        criteria_name: 'Communication',
    },
];

export const mockEvaluationAnswer: EvaluationAnswer = {
    evaluation_answer_id: 'answer1',
    total_score: 150,
    total_score_supervisor: 160,
    total_score_manage: 170,
};

export const mockEvaluationAnswerDetails: EvaluationAnswerDetail[] = [
    {
        evaluation_answer_detail_id: 'detail1',
        evaluation_question_id: 'q1',
        employee_score: 80,
        employee_comment: 'Good performance',
        supervisor_score: 85,
        supervisor_comment: 'Strong technical skills',
        manager_score: 90,
        manager_comment: 'Excellent work',
    },
    {
        evaluation_answer_detail_id: 'detail2',
        evaluation_question_id: 'q2',
        employee_score: 70,
        employee_comment: 'Needs improvement',
        supervisor_score: 75,
        supervisor_comment: 'Shows potential',
        manager_score: 80,
    },
];