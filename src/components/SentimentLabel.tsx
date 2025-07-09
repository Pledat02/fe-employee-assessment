import React from 'react';

type SentimentType = 'Tốt' | 'Trung bình' | 'Chưa tốt';

interface SentimentLabelProps {
    sentiment: SentimentType;
    className?: string;
}

const SentimentLabel: React.FC<SentimentLabelProps> = ({ sentiment, className = '' }) => {
    const getSentimentConfig = (sentiment: SentimentType) => {
        switch (sentiment) {
            case 'Tốt':
                return {
                    color: 'bg-green-500',
                    textColor: 'text-green-800',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                };
            case 'Trung bình':
                return {
                    color: 'bg-orange-500',
                    textColor: 'text-orange-800',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                };
            case 'Chưa tốt':
                return {
                    color: 'bg-red-500',
                    textColor: 'text-red-800',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                };
            default:
                return {
                    color: 'bg-gray-500',
                    textColor: 'text-gray-800',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                };
        }
    };

    const config = getSentimentConfig(sentiment);

    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 hover:scale-105 ${config.bgColor} ${config.borderColor} ${className}`}
        >
            <div
                className={`size-2.5 rounded-full ${config.color} shadow-sm`}
            />
            <span className={`text-sm font-medium ${config.textColor}`}>
        {sentiment}
      </span>
        </div>
    );
};

export default SentimentLabel;