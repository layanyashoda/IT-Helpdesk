import React from 'react';

interface SearchHighlightProps {
    text: string;
    searchTerm: string;
    className?: string; // Class for the highlighted text
}

export const SearchHighlight: React.FC<SearchHighlightProps> = ({
    text,
    searchTerm,
    className = "bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-100 rounded-[2px] px-0.5 font-medium",
}) => {
    if (!searchTerm || !text) {
        return <>{text}</>;
    }

    // Escape special regex characters in searchTerm
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <mark key={index} className={className}>
                        {part}
                    </mark>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
};
