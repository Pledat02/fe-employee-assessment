// services/profileService.ts
import { Profile, EvaluationCycle } from '../types';
import { mockProfile, mockEvaluationCycles } from '../mockData';

export const fetchProfileAndCycles = async (): Promise<{ profile: Profile; cycles: EvaluationCycle[] }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { profile: mockProfile, cycles: mockEvaluationCycles };
};