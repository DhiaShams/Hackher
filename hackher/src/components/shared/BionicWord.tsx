"use client";

import React from "react";

export function BionicWord({ word }: { word: string }) {
    if (word.length <= 1) return <span className="mr-1">{word}</span>;

    const boldLength = Math.ceil(word.length / 2);
    const boldPart = word.slice(0, boldLength);
    const normalPart = word.slice(boldLength);

    return (
        <span className="mr-1.5 inline-block">
            <span className="font-bold text-foreground">{boldPart}</span>
            <span className="font-normal text-foreground/80">{normalPart}</span>
        </span>
    );
}
