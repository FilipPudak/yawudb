import {
    bannedCards,
    restrictedCards,
    championshipForsakenCards,
    relicForsakenCards,
    championshipRestrictedCards,
} from "../data/index";
import { validateCardForPlayFormat } from "../data/wudb";

export const checkStandalone = () => {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
    );
};

const colors = {
    default: "Black",
    restricted: "Goldenrod",
    banned: "DarkRed",
};

const backgroundColors = {
    default: "White",
    restricted: "Goldenrod",
    banned: "DarkRed",
};

export const pickCardColor = (id, defaultColor) => {
    if (bannedCards[id]) {
        return colors["banned"];
    }

    if (restrictedCards[id]) {
        return colors["restricted"];
    }

    if (defaultColor) {
        return defaultColor;
    }

    return colors["default"];
};

export const pickCardColor2 = (id, format) => {
    const [, isForsaken, isRestricted] = validateCardForPlayFormat(id, format);
    
    if(isForsaken) {
        return colors["banned"];
    }

    if (isRestricted) {
        return colors["restricted"];
    }

    return colors["default"];
}


export const pickCardBackgroundColor = (id, defaultColor) => {
    if (bannedCards[id]) {
        return backgroundColors["banned"];
    }

    if (restrictedCards[id]) {
        return backgroundColors["restricted"];
    }

    if (defaultColor) {
        return defaultColor;
    }

    return backgroundColors["default"];
};

export const pickCardBackgroundColor2 = (id, format) => {
    const [, isForsaken, isRestricted] = validateCardForPlayFormat(id, format);
    
    if(isForsaken) {
        return backgroundColors["banned"];
    }

    if (isRestricted) {
        return backgroundColors["restricted"];
    }

    return backgroundColors["default"];
}

export const ignoreAsDublicate = (cardName) => {
    return [
        "ANNIHILATION",
        "CONQUEST",
        "DENIAL",
        "HOLD OBJECTIVE 1",
        "HOLD OBJECTIVE 2",
        "HOLD OBJECTIVE 3",
        "HOLD OBJECTIVE 4",
        "HOLD OBJECTIVE 5",
        "SUPREMACY",
        "CONFUSION",
        "SIDESTEP",
        "GREAT FORTITUDE",
        "GREAT STRENGTH",
        "GREAT SPEED",
        "COVER GROUND",
        "PLANT A STANDARD",
        "TACTICAL GENIUS 1-3",
        "TACTICAL GENIUS 3-5",
        "TACTICAL SUPREMACY 1-2",
        "TACTICAL SUPREMACY 3-4",
        "VICTORIOUS DUEL",
        "DAYLIGHT ROBBERY",
        "DISTRACTION",
        "MISCHIEVOUS SPIRITS",
        "MISDIRECTION",
        "REBOUND",
        "NO TIME",
        "SPECTRAL WINGS",
        "SHARDCALLER",
        "THE BLAZING KEY",
        "THE DAZZLING KEY",
        "THE FORMLESS KEY",
        "THE FRACTURED KEY",
        "THE HALLOWED KEY",
        "THE SHADOWED KEY",
    ].includes(cardName.toUpperCase());
};

export const checkCardForsakenFor = (cardId, format) => {
    switch (format) {
        case "championship":
            return Boolean(championshipForsakenCards[cardId]);

        case "relic":
            return Boolean(relicForsakenCards[cardId]);

        default:
            return false;
    }
};

export const checkCardRestrictedFor = (cardId, format) => {
    switch (format) {
        case "championship":
            return Boolean(championshipRestrictedCards[cardId]);

        default:
            return false;
    }
};
