import React, {
    memo,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    factions,
    CHAMPIONSHIP_FORMAT,
    RELIC_FORMAT,
    OPEN_FORMAT,
} from "../../data";
import { ReactComponent as Logo } from "../../svgs/underworlds_logo.svg";
import { ReactComponent as Hex } from "../../svgs/hexagon.svg";
import { ReactComponent as GridIcon } from "../../svgs/grid.svg";
import { ReactComponent as ListIcon } from "../../svgs/list.svg";
import { useInView } from "react-intersection-observer";
import { ReactComponent as SlidersIcon } from "../../svgs/sliders.svg";
import SectionTitle from "../components/SectionTitle";
import FullScreenOverlay from "../components/FullScreenOverlay";
import useDexie, { useCards, useSets } from "../../hooks/useDexie";
import DebouncedInput from "../components/DebouncedInput";
import CardTypeIcon from "../components/CardTypeIcon";
import SetIcon from "../components/SetIcon";
import Rank from "../components/Rank";
import ScoreIcon from "../components/ScoreIcon";
import { ReactComponent as CloseIcon } from "../../svgs/x.svg";


function SelectedFaction({ faction = "morgwaeths-blade-coven", ...rest }) {
    return (
        <div className={`flex flex-grow ${rest.className}`}>
            <div className="">
                <picture>
                    <img
                        className="w-20 h-20"
                        src={`/assets/icons/${faction}-deck.png`}
                    />
                </picture>
            </div>
            <div className="flex-grow grid place-content-center text-gray-900 text-2xl">
                {factions[faction]}
            </div>
        </div>
    );
}

function FactionsPicker({ selected, onPicked, ...rest }) {
    return (
        <div className={`flex flex-wrap align-middle ${rest.className}`}>
            {Object.keys(factions)
                .slice(1)
                .filter((f) => f != selected)
                .map((faction) => (
                    <img
                        key={faction}
                        className="w-10 h-10 m-1"
                        onClick={() => onPicked(faction)}
                        src={`/assets/icons/${faction}-icon.png`}
                    />
                ))}
        </div>
    );
}

function Toggle({ checked }) {
    return (
        <div className="flex w-6 h-6 relative cursor-pointer">
            <Hex className="text-gray-900 stroke-current stroke-2 w-6 h-6" />
            {checked && (
                <div className="absolute grid place-content-center inset-0">
                    <Logo className="w-4 h-4" />
                </div>
            )}
        </div>
    );
}

function SetsPicker({ ...rest }) {
    return (
        <>
            <div className="flex">
                <Toggle checked />
                <p className="ml-2">
                    Select all sets available for selected format.
                </p>
            </div>
            <div className={`flex flex-wrap align-middle ${rest.className}`}>
                {rest.selectedSets.map((set) => (
                    <img
                        key={set.id}
                        className="w-10 h-10 m-1"
                        src={`/assets/icons/${set.name}-icon.png`}
                    />
                ))}
            </div>
        </>
    );
}

function SelectFormatButton({ ...rest }) {
    const [currentFormat, setCurrentFormat] = useState(rest.selectedFormat);

    const handleChange = (e) => {
        setCurrentFormat(e.target.value);
    };

    return (
        <div className={`clearfix flex place-content-center ${rest.className}`}>
            <input
                className="stv-radio-button"
                id={RELIC_FORMAT}
                type="radio"
                name="format"
                value={RELIC_FORMAT}
                checked={currentFormat == RELIC_FORMAT}
                onChange={handleChange}
            />
            <label htmlFor={RELIC_FORMAT}>{RELIC_FORMAT}</label>

            <input
                id={CHAMPIONSHIP_FORMAT}
                type="radio"
                name="format"
                className="stv-radio-button"
                value={CHAMPIONSHIP_FORMAT}
                checked={currentFormat == CHAMPIONSHIP_FORMAT}
                onChange={handleChange}
            />
            <label htmlFor={CHAMPIONSHIP_FORMAT}>{CHAMPIONSHIP_FORMAT}</label>

            <input
                className="stv-radio-button"
                id={OPEN_FORMAT}
                type="radio"
                name="format"
                value={OPEN_FORMAT}
                checked={currentFormat == OPEN_FORMAT}
                onChange={handleChange}
            />
            <label htmlFor={OPEN_FORMAT}>{OPEN_FORMAT}</label>
        </div>
    );
}

function Filters({
    selectedFaction,
    factionPicker,
    selectedFormat,
    selectedSets,
    ...rest
}) {
    return (
        <section className={`${rest.className}`}>
            <SectionTitle title="Warband" />

            {selectedFaction}

            {factionPicker}

            <SectionTitle title="Format" className="my-8" />

            <SelectFormatButton selectedFormat={selectedFormat} />

            <SectionTitle title="Sets" className="my-8" />

            <div className="flex">
                <Toggle checked />
                <p className="ml-2">
                    For dublicate cards show only newest one.
                </p>
            </div>
            <SetsPicker selectedSets={selectedSets} />
        </section>
    );
}

const Card = memo(({ image, id, name, setName, type, onPicked, ...rest }) => {
    const handleClicked = () => {
        onPicked({
            id,
            name,
            setName,
            type,
            ...rest,
        });
    };

    return (
        <>
            {image ? (
                <article className="w-1/4 p-2 mb-2" onClick={handleClicked}>
                    <img
                        className="rounded-md hover:filter-shadow-sm"
                        src={`/assets/cards/0${id}.png`}
                    />
                    <div class="flex items-center my-2">
                        <img
                            className="w-4 h-4 mr-2"
                            src={`/assets/icons/${setName}-icon.png`}
                        />
                        <Rank
                            rank={rest.rank?.rank}
                            classes="text-gray-700 w-2 h-2"
                        />
                    </div>
                </article>
            ) : (
                <article
                    className={`w-full flex p-2 ${
                        rest.even ? "bg-gray-200" : "bg-white"
                    }`}
                    onClick={handleClicked}
                >
                    <div className="w-10 h-10 mr-2 relative">
                        <CardTypeIcon
                            className="w-8 h-8 absolute left-0"
                            type={type}
                        />
                        <SetIcon
                            set={setName}
                            className={`w-6 h-6 absolute right-0 bottom-0 border-2 rounded-full ${
                                rest.even ? "border-gray-200" : "border-white"
                            }`}
                        />
                    </div>

                    <div>
                        <div className="flex items-center">
                            <h6 className="text-gray-900">{name}</h6>
                            <ScoreIcon
                                classes="mx-2 w-4 h-4"
                                scoreType={rest.scoreType}
                            />
                        </div>
                        <div className="flex items-center">
                            <Rank
                                rank={rest.rank?.rank}
                                classes="text-gray-700 w-2 h-2"
                            />
                        </div>
                    </div>
                </article>
            )}
        </>
    );
});

function FilterableCardsList({
    cards,
    layout = "grid",
    onCardPicked,
    ...rest
}) {
    const { ref, inView } = useInView({ threshold: 0.5 });
    const [visibleCards, setVisibleCards] = useState([]);

    useEffect(() => {
        setVisibleCards(() => cards?.slice(0, 20));
    }, [cards]);

    useEffect(() => {
        if (!cards) return;

        if (inView) {
            setVisibleCards((current) => {
                return [
                    ...current,
                    ...cards.slice(current.length, current.length + 20),
                ];
            });
        }
    }, [inView, cards]);

    return (
        <section
            className={`${rest.className}`}
        >
            {visibleCards?.map((card, i) => (
                <Card
                    key={card.id}
                    image={layout == "grid"}
                    {...card}
                    even={i % 2 == 0}
                    onPicked={onCardPicked}
                />
            ))}
            <div ref={ref}>Loading...</div>
        </section>
    );
}

const SCORE_TYPES = ["SURGE", "END", "THIRD"];

function CurrentDeck({ selectedFaction, currentDeck, ...rest }) {
    const { cards, sets, factions, cardsRanks } = useDexie("wudb");
    const [factionInfo, setFactionInfo] = useState(undefined);
    const [hoverCard, setHoverCard] = useState(undefined);

    const showCardPreview = cardId => () => {
        setHoverCard(cardId);
    }

    const deleteCard = card => () => {
        console.log('Delete', card);
    }

    const handleDeckNameChange = e => {
        console.log(e.target.value);
    }

    useEffect(() => {
        factions.where("name").equals(selectedFaction).first(setFactionInfo);
    }, [selectedFaction, factions]);

    return (
        <section className={`max-w-full max-h-full flex flex-col ${rest.className}`}>
            <div className="w-full p-4">
                <div className="lg:col-span-3 flex items-center">
                    {factionInfo && (
                        <img
                            className="w-16 h-16 mr-4"
                            src={`/assets/icons/${selectedFaction}-deck.png`}
                        />
                    )}
                    <DebouncedInput
                        onChange={handleDeckNameChange}
                        placeholder={`${
                            factionInfo?.displayName || selectedFaction
                        } Deck`}
                        className="rounded h-12 bg-gray-200 box-border flex-1 mr-2 py-1 px-2 outline-none border-2 focus:border-accent3-500"
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 p-6">
                <div>
                    <div className={`flex items-center mb-4 max-w-xl`}>
                        <CardTypeIcon
                            className="w-8 h-8 mr-2"
                            type="objective"
                        />

                        <h3 className="text-xl font-semibold">
                            Objectives (
                            {Object.keys(currentDeck?.objectives).length} / 12):
                        </h3>
                    </div>
                    <ul className="max-w-lg">
                        {Object.values(currentDeck.objectives)
                            .sort(
                                (x, y) =>
                                    SCORE_TYPES.indexOf(
                                        x.scoreType.toUpperCase()
                                    ) -
                                    SCORE_TYPES.indexOf(
                                        y.scoreType.toUpperCase()
                                    )
                            )
                            .map((card, i) => (
                                <li
                                    key={card.id}
                                    className={`flex items-center text-xl cursor-pointer ${hoverCard ? (hoverCard == card.id ? 'text-gray-900' : 'text-gray-500') : 'text-gray-900'}`}
                                    onMouseEnter={showCardPreview(card.id)}
                                    onMouseLeave={showCardPreview(undefined)}
                                >
                                    <ScoreIcon
                                        classes="mr-2 w-4 h-4"
                                        scoreType={card.scoreType}
                                    />
                                    <SetIcon
                                        className="w-4 h-4 mr-2"
                                        set={card.setName}
                                    />
                                    <div>{card.name}</div>
                                    {
                                        hoverCard === card.id && (
                                            <CloseIcon className="w-6 h-6 cursor-pointer stroke-current ml-auto mr-2"
                                                onClick={deleteCard(card)} />
                                        )
                                    }
                                </li>
                            ))}
                    </ul>
                </div>
                <div>
                    <div className={`flex items-center mb-4`}>
                        <CardTypeIcon className="w-8 h-8" type="Ploy" />
                        <CardTypeIcon className="w-8 h-8 mr-2" type="Spell" />

                        <h3 className="text-xl font-semibold">Gambits:</h3>
                    </div>
                    <ul>
                        {Object.values(currentDeck.gambits)
                            .sort((x, y) => x.type.localeCompare(y.type))
                            .map((card, i) => (
                                <li
                                    key={card.id}
                                    className={`flex items-center text-xl cursor-pointer ${hoverCard ? (hoverCard == card.id ? 'text-gray-900' : 'text-gray-500') : 'text-gray-900'}`}
                                    onMouseEnter={showCardPreview(card.id)}
                                    onMouseLeave={showCardPreview(undefined)}
                                >
                                    <SetIcon
                                        className="w-4 h-4 mr-2"
                                        set={card.setName}
                                    />
                                    <div>{card.name}</div>
                                </li>
                            ))}
                    </ul>
                </div>
                <div>
                    <div className={`flex items-center mb-4`}>
                        <CardTypeIcon className="w-8 h-8 mr-2" type="Upgrade" />

                        <h3 className="text-xl font-semibold">Upgrades:</h3>
                    </div>
                    <ul>
                        {Object.values(currentDeck.upgrades).map((card, i) => (
                            <li
                                key={card.id}
                                className={`flex items-center text-xl cursor-pointer ${hoverCard ? (hoverCard == card.id ? 'text-gray-900' : 'text-gray-500') : 'text-gray-900'}`}
                                onMouseEnter={showCardPreview(card.id)}
                                onMouseLeave={showCardPreview(undefined)}
                            >
                                <SetIcon
                                    className="w-4 h-4 mr-2"
                                    set={card.setName}
                                />
                                <div>{card.name}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* <div className="flex-1 flex flex-col justify-center bg-red-400">
                <img
                    className="rounded-md filter-shadow-sm"
                    style={{ alignSelf: 'center' }}
                    // width="300"
                    src={`/assets/cards/${`${hoverCard}`.padStart(5, '0')}.png`}
                />
            </div> */}
            {/* {hoverCard && (
                    )} */}
        </section>
    );
}

function usePersistedState(data, key) {
    const [state, setState] = useState(
        () => JSON.parse(localStorage.getItem(key)) || data
    );

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [state]);

    return [state, setState];
}

function Toolbar({ children }) {
    return (
        <section className="flex p-2 items-center">
            { children }
        </section>
    )
}

function DeckEditor() {
    const [selectedFaction, setSelectedFaction] = useState(
        "thorns-of-the-briar-queen"
    );
    const [selectedFormat] = useState(CHAMPIONSHIP_FORMAT);
    const [selectedSets, setSelectedSets] = useSets(8);
    // const { cards, factions, cardsRanks } = useDexie("wudb");
    const [filteredCards, setFilteredCards] = useState([]);
    const allCards = useCards(selectedFaction, selectedFormat, selectedSets);
    const [filterText, setFilterText] = useState("");
    const [layout, setLayout] = useState("list");

    const [currentDeck, setCurrentDeck] = usePersistedState({
        objectives: {},
        gambits: {},
        upgrades: {},
    });

    const selectedCards = useMemo(() => {
        console.log("Changes");
        return [
            ...Object.keys(currentDeck.objectives).map(Number),
            ...Object.keys(currentDeck.gambits).map(Number),
            ...Object.keys(currentDeck.upgrades).map(Number),
        ];
    }, [currentDeck]);

    const handleCardPicked = (card) => {
        console.log(card);
        switch (card.type) {
            case "Objective":
                setCurrentDeck((prev) => ({
                    ...prev,
                    objectives: { ...prev.objectives, [card.id]: card },
                }));
                return;
            case "Ploy":
                setCurrentDeck((prev) => ({
                    ...prev,
                    gambits: { ...prev.gambits, [card.id]: card },
                }));
                return;
            case "Spell":
                setCurrentDeck((prev) => ({
                    ...prev,
                    gambits: { ...prev.gambits, [card.id]: card },
                }));
                return;
            case "Upgrade":
                setCurrentDeck((prev) => ({
                    ...prev,
                    upgrades: { ...prev.upgrades, [card.id]: card },
                }));
                return;
            default:
                return;
        }
    };

    useEffect(() => {
        setFilteredCards(
            allCards
                .filter((card) => {
                    return card.name
                        .toUpperCase()
                        .includes(filterText.trim().toUpperCase());
                })
                .filter((card) => {
                    if (!!card.duplicates) {
                        const [lastDuplicate] = card.duplicates.slice(-1);
                        return card.id == lastDuplicate;
                    }

                    return !selectedCards.includes(card.id);
                })
                .sort(
                    (card, next) =>
                        card.type.localeCompare(next.type) ||
                        next.factionId - card.factionId ||
                        next.rank?.rank - card.rank?.rank
                )
                .map((i) => ({ ...i, setName: i.set?.name }))
        );
    }, [allCards.length, filterText, selectedCards.length]);

    return (
        <div className="w-full flex-1 bg-white lg:grid lg:grid-cols-8 lg:gap-2">
            <div
                className={`${
                    layout == "list"
                        ? "lg:col-span-3 xl:col-span-2"
                        : "lg:col-span-5 xl:col-span-6"
                }  box-border border-gray-300 border-r relative`}
            >
                <div className="absolute inset-0 bg-red-600 flex flex-col">
                    <Toolbar>
                        <DebouncedInput
                            placeholder="search for a card name..."
                            className="rounded bg-gray-200 box-border flex-1 mr-2 py-1 px-2 outline-none border-2 focus:border-accent3-500"
                            onChange={setFilterText}
                        />
                        {/* This way its not clear that only SlidersIcon will be rendered here. */}
                        <FullScreenOverlay
                            hasCloseButton
                            direction="to-right"
                            icon={() => <SlidersIcon className="mr-2" />}
                        >
                            <Filters
                                className="p-4 lg:opacity-100 lg:static sm:col-span-2"
                                selectedFaction={
                                    <SelectedFaction
                                        className="my-4"
                                        faction={selectedFaction}
                                    />
                                }
                                factionPicker={
                                    <FactionsPicker
                                        className="my-4"
                                        selected={selectedFaction}
                                        onPicked={setSelectedFaction}
                                    />
                                }
                                selectedFormat={selectedFormat}
                                selectedSets={selectedSets}
                            />
                        </FullScreenOverlay>

                        <div>
                            {layout == "list" ? (
                                <GridIcon onClick={() => setLayout("grid")} />
                            ) : (
                                <ListIcon onClick={() => setLayout("list")} />
                            )}
                        </div>

                    </Toolbar>
                    <div className="flex-1 relative bg-green-400">
                        <div className="absolute bg-orange-500 inset-0 overflow-y-scroll">
                            <FilterableCardsList
                                className="flex flex-wrap content-start"
                                cards={filteredCards}
                                layout={layout}
                                onCardPicked={handleCardPicked}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <CurrentDeck
                className={`${
                    layout == "list"
                        ? "lg:col-span-5 xl:col-span-6"
                        : "lg:col-span-3 xl:col-span-2"
                } opacity-0 lg:opacity-100 sm:static`}
                currentDeck={currentDeck}
                selectedFaction={selectedFaction}
            />
        </div>
    );
}

export default DeckEditor;
