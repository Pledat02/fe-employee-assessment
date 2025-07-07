// components/EmployeeSelfEvaluation.tsx
import React, { useEffect, useState } from 'react';
import EvaluationTable from '../components/EvaluationTable';
import { fetchProfileAndCycles } from '../services/ProfileService';
import { fetchFormAndQuestions, submitEvaluation } from '../services/EvaluationService';
import {Profile, EvaluationCycle, CriteriaForm, Criteria, Question, Score, Comment, User} from '../types';
import EvaluationCycleSelector from "../components/EvaluationCycleFormModal";

const EmployeeSelfEvaluation: React.FC = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}') as User;
    const role = user.role;

    const [profile, setProfile] = useState<Profile>({ code: '' });
    const [evaluationCycles, setEvaluationCycles] = useState<EvaluationCycle[]>([]);
    const [selectedCycle, setSelectedCycle] = useState<string>('');
    const [criteriaForm, setCriteriaForm] = useState<CriteriaForm | null>(null);
    const [criterias, setCriterias] = useState<Criteria[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [scores, setScores] = useState<Record<string, Score>>({});
    const [comments, setComments] = useState<Record<string, Comment>>({});

    useEffect(() => {
        if (questions.length > 0) {
            setScores((prev) => {
                const updated: Record<string, Score> = { ...prev };
                questions.forEach((q) => {
                    if (!updated[q.evaluation_question_id]) {
                        updated[q.evaluation_question_id] = { employee: 0, supervisor: 0, manager: 0 };
                    }
                });
                return updated;
            });

            setComments((prev) => {
                const updated: Record<string, Comment> = { ...prev };
                questions.forEach((q) => {
                    if (!updated[q.evaluation_question_id]) {
                        updated[q.evaluation_question_id] = { employee: '', supervisor: '', manager: '' };
                    }
                });
                return updated;
            });
        }
    }, [questions]);

    useEffect(() => {
        fetchProfileAndCycles()
            .then(({ profile, cycles }) => {
                setProfile(profile);
                setEvaluationCycles(cycles);
            })
            .catch((error) => {
                console.error('Error in fetchProfileAndCycles:', error);
            });
    }, []);

    const handleCycleChange = (cycleId: string) => {
        setSelectedCycle(cycleId);
        if (cycleId) {
            fetchFormAndQuestions(cycleId, profile.code)
                .then(({ form, criteriaList, allQuestions, existingDetailMap, details }) => {
                    setCriteriaForm(form);
                    setCriterias(criteriaList);
                    setQuestions(allQuestions);

                    const updatedScores: Record<string, Score> = { ...scores };
                    const updatedComments: Record<string, Comment> = { ...comments };

                    allQuestions.forEach((q) => {
                        const detail = existingDetailMap[q.evaluation_question_id];
                        if (detail) {
                            updatedScores[q.evaluation_question_id] = {
                                employee: detail.employee_score || 0,
                                supervisor: detail.supervisor_score || 0,
                                manager: detail.manager_score || 0,
                            };
                            updatedComments[q.evaluation_question_id] = {
                                employee: detail.employee_comment || '',
                                supervisor: detail.supervisor_comment || '',
                                manager: detail.manager_comment || '',
                            };
                        }
                    });

                    setScores(updatedScores);
                    setComments(updatedComments);
                })
                .catch(() => {
                    setCriteriaForm(null);
                    setCriterias([]);
                    setQuestions([]);
                    setScores({});
                    setComments({});
                });
        } else {
            setCriteriaForm(null);
            setCriterias([]);
            setQuestions([]);
            setScores({});
            setComments({});
        }
    };

    const handleScoreChange = (questionId: string, field: keyof Score, value: string) => {
        const num = parseInt(value, 10);
        setScores((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [field]: isNaN(num) || num < 0 ? 0 : num,
            },
        }));
    };

    const handleCommentChange = (questionId: string, field: keyof Comment, value: string) => {
        setComments((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        if (!profile.code || !criteriaForm?.criteria_form_id) {
            alert('Thiếu thông tin hồ sơ hoặc biểu mẫu đánh giá.');
            return;
        }

        for (const q of questions) {
            const score = scores[q.evaluation_question_id]?.[role] || 0;
            const comment = comments[q.evaluation_question_id]?.[role] || '';
            if (role === 'employee' && score > 100 && score <= 120 && comment.trim() === '') {
                alert(`Điểm trên 100 cho câu hỏi "${q.question_name}" cần có lý do.`);
                return;
            }
            if ((role === 'supervisor' || role === 'manager') && score > q.max_score) {
                alert(`Điểm cho câu hỏi "${q.question_name}" vượt quá điểm tối đa (${q.max_score}).`);
                return;
            }
        }

        const totalScore = questions.reduce((sum, q) => {
            const score = scores[q.evaluation_question_id]?.[role] || 0;
            return sum + Number(score);
        }, 0);

        try {
            await submitEvaluation(role, profile.code, criteriaForm.criteria_form_id, questions, scores, comments, totalScore);
            alert(`Lưu đánh giá ${role} thành công!`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error: any) {
            if (error.response?.status === 422) {
                alert('Dữ liệu không hợp lệ: ' + JSON.stringify(error.response.data.errors));
            } else {
                alert('Có lỗi xảy ra khi lưu đánh giá!');
            }
        }
    };

    return (
        <div>
            <EvaluationCycleSelector
                evaluationCycles={evaluationCycles}
                selectedCycle={selectedCycle}
                onCycleChange={handleCycleChange}
            />
            {questions.length > 0 && (
                <>
                    <EvaluationTable
                        role={role}
                        criterias={criterias}
                        questions={questions}
                        scores={scores}
                        comments={comments}
                        onScoreChange={handleScoreChange}
                        onCommentChange={handleCommentChange}
                    />
                    <button className="btn btn-success" onClick={handleSubmit}>
                        Lưu đánh giá
                    </button>
                </>
            )}
        </div>
    );
};

export default EmployeeSelfEvaluation;