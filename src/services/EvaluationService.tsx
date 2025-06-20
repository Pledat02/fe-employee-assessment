import {
    Question,
} from '../types';
import {
    mockCriteriaForm,
    mockCriterias,
    mockQuestions,
    mockEvaluationAnswer,
    mockEvaluationAnswerDetails,
} from '../mockData';

export const fetchFormAndQuestions = async (cycleId: string, profileCode: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!cycleId || !profileCode) {
        throw new Error('Invalid cycleId or profileCode');
    }

    const form = mockCriteriaForm;
    const criteriaList = mockCriterias;
    const allQuestions = mockQuestions;

    let existingDetailMap: Record<string, string> = {};
    try {
        const details = mockEvaluationAnswerDetails;
        existingDetailMap = details.reduce((map, detail) => {
            map[detail.evaluation_question_id] = detail.evaluation_answer_detail_id;
            return map;
        }, {} as Record<string, string>);
    } catch (err) {
        console.error('Mock error fetching evaluation details:', err);
    }

    return { form, criteriaList, allQuestions, existingDetailMap };
};

export const submitEvaluation = async (
    role: 'employee' | 'supervisor' | 'manager',
    profileCode: string,
    criteriaFormId: string,
    questions: Question[],
    scores: Record<string, { employee: number; supervisor: number; manager: number }>,
    comments: Record<string, { employee: string; supervisor: string; manager: string }>,
    totalScore: number
) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!profileCode || !criteriaFormId) {
        throw new Error('Missing profile code or criteria form ID');
    }

    for (const q of questions) {
        const score = scores[q.evaluation_question_id]?.[role] || 0;
        if ((role === 'supervisor' || role === 'manager') && score > q.max_score) {
            throw new Error(`Score for question "${q.question_name}" exceeds max score (${q.max_score}).`);
        }
        if (role === 'employee' && score > 100 && score <= 120 && !comments[q.evaluation_question_id]?.[role]?.trim()) {
            throw new Error(`Score above 100 for question "${q.question_name}" requires a comment.`);
        }
    }

    // Simulate saving data
    console.log(`Mock submit for ${role}:`, {
        profileCode,
        criteriaFormId,
        totalScore,
        scores,
        comments,
    });

    // Simulate existing evaluation answer or create new
    const evaluationAnswerId = mockEvaluationAnswer.evaluation_answer_id || 'new_answer_id';

    // Simulate updating or creating details
    const createBatchData = questions.map((q) => ({
        evaluation_question_id: q.evaluation_question_id,
        evaluation_answer_id: evaluationAnswerId,
        [`${role}_score`]: scores[q.evaluation_question_id]?.[role] || 0,
        ...(role !== 'manager' ? { [`${role}_comment`]: comments[q.evaluation_question_id]?.[role] || '' } : {}),
    }));

    console.log('Mock create/update batch data:', createBatchData);

    return evaluationAnswerId;
};