import React, { useState, useEffect, useMemo } from "react";
import ScoringOverview from "../../../atoms/ScoringOverview";
import { CardsList } from "./CardsList";
import { useDeckBuilderState } from "../../../pages/DeckCreator";
import {
    CHAMPIONSHIP_FORMAT,
    validateObjectivesListForPlayFormat,
} from "../../../data/wudb";
import uuid4 from "uuid/v4";
import CardListSectionHeader from "../../../v2/components/CardListSectionHeader";

function ObjectivesList() {
    const { selectedObjectives, format } = useDeckBuilderState();
    const [isValid, setIsValid] = useState(false);
    const [issues, setIssues] = useState([]);

    const totalGlory = useMemo(
        () =>
            selectedObjectives.reduce(
                (total, { glory }) => (total += glory),
                0
            ),
        [selectedObjectives]
    );

    const objectiveSummary = useMemo(
        () =>
            selectedObjectives.reduce(
                (acc, c) => {
                    acc[c.scoreType] += 1;
                    return acc;
                },
                { Surge: 0, End: 0, Third: 0 }
            ),
        [selectedObjectives]
    );

    useEffect(() => {
        const [isValid, issues] = validateObjectivesListForPlayFormat(
            selectedObjectives,
            format
        );

        setIsValid(isValid);
        setIssues(issues);
    }, [format, selectedObjectives]);

    return (
        <div className={`${isValid ? "bg-green-100" : "bg-red-100"} p-2 mb-4 lg:mb-0`}>
            <CardListSectionHeader
                type="Objectives"
                amount={selectedObjectives.length}
            >
                <ScoringOverview
                    summary={objectiveSummary}
                    glory={totalGlory}
                />
            </CardListSectionHeader>
            {!isValid && (
                <ul>
                    {issues.map((issue) => (
                        <li className="text-accent3-700 text-sm" key={uuid4()}>
                            {issue}
                        </li>
                    ))}
                </ul>
            )}
            <CardsList
                isEligibleForOP={format == CHAMPIONSHIP_FORMAT}
                cards={selectedObjectives}
            />
        </div>
    );
}

export default ObjectivesList;