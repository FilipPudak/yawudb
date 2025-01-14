import React, { PureComponent, useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import LockIcon from "@material-ui/icons/Lock";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import { ReactComponent as GloryIcon } from "../../../../svgs/wu-glory.svg";
import { ReactComponent as CloseIcon } from "../../../../svgs/x.svg";
import { ReactComponent as RankIcon } from "../../../../svgs/wu-glory.svg";
import ObjectiveScoreTypeIcon from "../../../../components/ObjectiveScoreTypeIcon";
import {
    getCardById,
    getCardNumberFromId,
    getCardWaveFromId,
    getSetNameById,
    totalCardsPerWave,
    validateCardForPlayFormat,
    wucards,
} from "../../../../data/wudb";
import Fade from "@material-ui/core/Fade";
import { ModalPresenter } from "../../../../main";
import CardImage from "../../../../v2/components/CardImage";

window.process = { cwd: () => "" };

function Rank({ value }) {
    const normalized = value >= 10000 ? value / 10000 : value;
    const wholeStarsCount = Math.floor(normalized / 2);
    const wholeStars = isNaN(wholeStarsCount)
        ? []
        : new Array(wholeStarsCount).fill(1);
    const halfStars = normalized % 2 > 0 ? [0] : [];
    const rankInStars = [...wholeStars, ...halfStars];
    return (
        <div className="flex fill-current">
            {rankInStars.map((star, i) => {
                if (star === 1)
                    return (
                        <RankIcon
                            key={i}
                            className="text-lg text-purple-800 fill-current"
                        />
                    );
                if (star === 0)
                    return (
                        <RankIcon
                            key={i}
                            className="text-lg text-purple-500 fill-current"
                        />
                    );
            })}
        </div>
    );
}

class WUCardInfo extends PureComponent {
    render() {
        const { scoreType, name, id, glory, onClick } = this.props;

        const wave = getCardWaveFromId(id);
        return (
            <div className="flex-1 self-start cursor-pointer" onClick={onClick}>
                <div className="flex items-center">
                    {scoreType && scoreType !== "-" && (
                        <ObjectiveScoreTypeIcon
                            type={scoreType}
                            style={{
                                width: "1rem",
                                height: "1rem",
                            }}
                        />
                    )}

                    <h6
                        className={`truncate ${
                            scoreType && scoreType !== "-" ? "ml-2" : ""
                        }`}
                    >
                        {name}
                    </h6>
                </div>
                <div className="flex items-center">
                    <Rank value={this.props.rank} />

                    {glory && (
                        <div className="flex items-center font-bold mx-2">
                            <GloryIcon className="bg-objective-gold rounded-full w-3 h-3 fill-current mr-1" />

                            {glory}
                        </div>
                    )}

                    <span className="font-bold text-xs text-gray-500">{`${getCardNumberFromId(
                        id
                    )}/${totalCardsPerWave[+wave]}`}</span>

                    <img
                        className="w-3 h-3 ml-1"
                        alt={`wave-${wave}`}
                        src={`/assets/icons/wave-${wave}-icon.png`}
                    />
                </div>
            </div>
        );
    }
}

const CardInDeck = memo(
    ({ cardId, format, toggleCard, inDeck, ranking, ...props }) => {
        const [overlayIsVisible, setOverlayIsVisible] = useState(false);
        const card = getCardById(cardId);
        const [, isBanned, isRestricted] = validateCardForPlayFormat(
            cardId,
            format
        );
        const { type, id, scoreType, glory, name, setId } = card;

        const pickForegroundColor = (isRestricted, isBanned, defaultColor) => {
            if (isBanned || isRestricted) {
                return "white";
            }

            return defaultColor;
        };

        const handleShowCardImageOverlay = () => {
            setOverlayIsVisible(true);
        };

        return (
            <>
                <div
                    className={`flex items-center ${
                        isRestricted
                            ? "bg-yellow-100"
                            : isBanned
                            ? "bg-red-100"
                            : props.isAlter
                            ? "bg-purple-100"
                            : props.isAlter !== undefined
                            ? "bg-white"
                            : ""
                    }`}
                >
                    <div
                        className={`items-center relative ${
                            props.showType ? "ml-2 mr-6" : "mx-2"
                        }`}
                    >
                        {props.showType && (
                            <img
                                className="w-8 h-8 absolute top-0 left-1/2"
                                style={{ zIndex: 0 }}
                                alt={`${type}`}
                                src={`/assets/icons/${type.toLowerCase()}-icon.png`}
                            />
                        )}
                        <img
                            className="w-8 h-8"
                            alt={`${getSetNameById(setId)}`}
                            src={`/assets/icons/${getSetNameById(
                                setId
                            )}-icon.png`}
                        />

                        {isRestricted && (
                            <LockIcon
                                className="absolute w-8 h-8 opacity-75 top-1/2 -mt-3 left-1/2 -ml-3"
                                style={{
                                    stroke: "white",
                                    fill: "goldenrod",
                                }}
                            />
                        )}
                        {isBanned && (
                            <NotInterestedIcon
                                className="absolute w-8 h-8 opacity-75 top-1/2 -mt-3 left-1/2 -ml-3"
                                style={{
                                    fill: "darkred",
                                }}
                            />
                        )}
                    </div>
                    <WUCardInfo
                        rank={ranking}
                        pickColor={pickForegroundColor}
                        isRestricted={isRestricted}
                        isBanned={isBanned}
                        set={setId}
                        name={name}
                        scoreType={scoreType}
                        type={type}
                        id={id}
                        glory={glory}
                        onClick={handleShowCardImageOverlay}
                    />
                    <button
                        className={`btn m-2 w-8 h-8 py-0 px-1 ${
                            inDeck ? "btn-red" : "btn-purple"
                        }`}
                        onClick={toggleCard}
                    >
                        <CloseIcon
                            className={`text-white stroke-current transform transition-transform duration-300 ${
                                inDeck ? "rotate-0" : "rotate-45"
                            }`}
                        />
                    </button>
                </div>
                {overlayIsVisible && (
                    <ModalPresenter>
                        <Fade in={overlayIsVisible}>
                            <div
                                className="fixed inset-0 z-10 cursor-pointer"
                                onClick={() => setOverlayIsVisible(false)}
                            >
                                <div className="bg-black absolute inset-0 opacity-25"></div>
                                <div className="absolute inset-0 z-20 flex justify-center items-center">
                                    <div className="w-4/5 lg:w-1/4">
                                        <div className="w-[300px] h-[420px] bg-purple-100 rounded-2xl border-4 border-gray-900 grid grid-cols-1 grid-rows-1">
                                            <div className="py-4">
                                                <h1 className="text-center text-xl font-bold">
                                                    {card.name}
                                                </h1>
                                                <div className="p-2">
                                                    {card.rule
                                                        .split("\\n")
                                                        .map((paragraph, i) => (
                                                            <ReactMarkdown
                                                                key={i}
                                                            >
                                                                {paragraph.trim()}
                                                            </ReactMarkdown>
                                                        ))}
                                                    {card.glory && (
                                                        <div className="flex items-center justify-center space-x-2 mt-8">
                                                            {new Array(
                                                                card.glory
                                                            )
                                                                .fill(0)
                                                                .map((x, i) => (
                                                                    <GloryIcon className="bg-objective-gold rounded-full w-8 h-8 fill-current" />
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <CardImage
                                                id={id}
                                                className="rounded-lg row-start-1 row-end-2 col-start-1 col-end-2"
                                                style={{
                                                    filter: "drop-shadow(0 0 10px black)",
                                                }}
                                                alt={id}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    </ModalPresenter>
                )}
            </>
        );
    }
);

export default CardInDeck;
