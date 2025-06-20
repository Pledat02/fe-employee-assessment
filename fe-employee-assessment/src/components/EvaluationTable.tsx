// components/EvaluationTable.tsx
import React, { ChangeEvent } from 'react';
import { Criteria, Question, Score, Comment } from '../types';

interface EvaluationTableProps {
    role: 'employee' | 'supervisor' | 'manager';
    criterias: Criteria[];
    questions: Question[];
    scores: Record<string, Score>;
    comments: Record<string, Comment>;
    onScoreChange: (questionId: string, field: keyof Score, value: string) => void;
    onCommentChange: (questionId: string, field: keyof Comment, value: string) => void;
}

const EvaluationTable: React.FC<EvaluationTableProps> = ({
                                                             role,
                                                             criterias,
                                                             questions,
                                                             scores,
                                                             comments,
                                                             onScoreChange,
                                                             onCommentChange,
                                                         }) => {
    const columnWidths = {
        employee: {
            content: '30%',
            maxScore: '5%',
            employee: '15%',
            employeeComment: '40%',
            supervisor: '5%',
            supervisorComment: '5%',
            manager: '5%',
        },
        supervisor: {
            content: '30%',
            maxScore: '5%',
            employee: '5%',
            employeeComment: '5%',
            supervisor: '15%',
            supervisorComment: '40%',
            manager: '5%',
        },
        manager: {
            content: '30%',
            maxScore: '5%',
            employee: '10%',
            employeeComment: '15%',
            supervisor: '10%',
            supervisorComment: '15%',
            manager: '15%',
        },
    };

    return (
        <table className="table-bordered table">
            <thead className="thead-dark">
            <tr>
                <th style={{ width: columnWidths[role]?.content || '30%' }}>Nội dung</th>
                <th style={{ width: columnWidths[role]?.maxScore || '5%' }}>Điểm tối đa</th>
                <th style={{ width: columnWidths[role]?.employee || '10%' }}>Nhân viên</th>
                <th style={{ width: columnWidths[role]?.employeeComment || '40%' }}>Nhận xét</th>
                <th style={{ width: columnWidths[role]?.supervisor || '5%' }}>Giám sát</th>
                <th style={{ width: columnWidths[role]?.supervisorComment || '5%' }}>Nhận xét</th>
                <th style={{ width: columnWidths[role]?.manager || '5%' }}>Quản lý</th>
            </tr>
            </thead>
            <tbody>
            {criterias.map((criteria) => {
                const relatedQuestions = questions.filter(
                    (q) => q.evaluation_criteria_id === criteria.evaluation_criteria_id
                );

                return (
                    <React.Fragment key={criteria.evaluation_criteria_id}>
                        <tr className="table-secondary">
                            <td colSpan={7}>
                                <strong>Tiêu chí: {criteria.criteria_name}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td className="criteria-form-detail">
                                <ul>
                                    {relatedQuestions.map((q) => (
                                        <li key={q.evaluation_question_id} className="border-b border-gray-300 py-1">
                                            {q.question_name}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {relatedQuestions.map((q) => (
                                        <li key={q.evaluation_question_id} className="border-b border-gray-300 py-1">
                                            {q.max_score}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {relatedQuestions.map((q) => (
                                        <li key={q.evaluation_question_id} className="border-b border-gray-300 py-1">
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                max={q.max_score}
                                                value={scores[q.evaluation_question_id]?.employee || 0}
                                                onChange={(e) =>
                                                    onScoreChange(q.evaluation_question_id, 'employee', e.target.value)
                                                }
                                                disabled={role !== 'employee'}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {relatedQuestions.map((q) => (
                                        <li key={q.evaluation_question_id} className="border-b border-gray-300 py-1">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={comments[q.evaluation_question_id]?.employee || ''}
                                                onChange={(e) =>
                                                    onCommentChange(q.evaluation_question_id, 'employee', e.target.value)
                                                }
                                                disabled={role !== 'employee'}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {relatedQuestions.map((q) => (
                                        <li key={q.evaluation_question_id} className="border-b border-gray-300 py-1">
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                max={q.max_score}
                                                value={scores[q.evaluation_question_id]?.supervisor || 0}
                                                onChange={(e) =>
                                                    onScoreChange(q.evaluation_question_id, 'supervisor', e.target.value)
                                                }
                                                disabled={role !== 'supervisor'}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {relatedQuestions.map((q) => (
                                        <li key={q.evaluation_question_id} className="border-b border-gray-300 py-1">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={comments[q.evaluation_question_id]?.supervisor || ''}
                                                onChange={(e) =>
                                                    onCommentChange(q.evaluation_question_id, 'supervisor', e.target.value)
                                                }
                                                disabled={role !== 'supervisor'}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {relatedQuestions.map((q) => (
                                        <li key={q.evaluation_question_id} className="border-b border-gray-300 py-1">
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                max={q.max_score}
                                                value={scores[q.evaluation_question_id]?.manager || 0}
                                                onChange={(e) =>
                                                    onScoreChange(q.evaluation_question_id, 'manager', e.target.value)
                                                }
                                                disabled={role !== 'manager'}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    </React.Fragment>
                );
            })}
            </tbody>
        </table>
    );
};

export default EvaluationTable;