import React, { ChangeEvent } from 'react';
import { EvaluationCycle } from '../types';

interface EvaluationCycleSelectorProps {
    evaluationCycles: EvaluationCycle[];
    selectedCycle: string;
    onCycleChange: (cycleId: string) => void;
}

const EvaluationCycleSelector: React.FC<EvaluationCycleSelectorProps> = ({
                                                                             evaluationCycles,
                                                                             selectedCycle,
                                                                             onCycleChange,
                                                                         }) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onCycleChange(e.target.value);
    };

    return (
        <div className="mb-3">
            <label>Chọn chu kỳ đánh giá:</label>
            <select className="form-control" value={selectedCycle} onChange={handleChange}>
                <option value="">-- Chọn chu kỳ --</option>
                {evaluationCycles.map((cycle) => (
                    <option key={cycle.evaluation_cycle_id} value={cycle.evaluation_cycle_id}>
                        {cycle.cycle_name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EvaluationCycleSelector;