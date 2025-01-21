"use client";

import { useState, useEffect } from "react";

interface PlayingCard {
  id: string;
  suit: "♠" | "♥" | "♦" | "♣";
  rank: string;
  value: number;
  color: string;
}

const suits: { symbol: "♠" | "♥" | "♦" | "♣"; color: string }[] = [
  { symbol: "♥", color: "text-red-500" },
  { symbol: "♦", color: "text-red-500" },
  { symbol: "♣", color: "text-slate-900" },
  { symbol: "♠", color: "text-slate-900" },
];

const ranks = [
  { rank: "K", value: 13 },
  { rank: "Q", value: 12 },
  { rank: "J", value: 11 },
  { rank: "10", value: 10 },
  { rank: "9", value: 9 },
  { rank: "8", value: 8 },
  { rank: "7", value: 7 },
  { rank: "6", value: 6 },
  { rank: "5", value: 5 },
  { rank: "4", value: 4 },
  { rank: "3", value: 3 },
  { rank: "2", value: 2 },
  { rank: "A", value: 1 },
];

const createDeck = (): PlayingCard[] => {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      id: `${rank.rank}-${suit.symbol}`,
      suit: suit.symbol,
      rank: rank.rank,
      value: rank.value,
      color: suit.color,
    }))
  );
};

const shuffleDeck = (deck: PlayingCard[]): PlayingCard[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

export default function CardGame() {
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [playerHand, setPlayerHand] = useState<PlayingCard[]>([]);
  const [botHand, setBotHand] = useState<PlayingCard[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [centerCards, setCenterCards] = useState<{
    player: PlayingCard | null;
    bot: PlayingCard | null;
  }>({
    player: null,
    bot: null,
  });
  const [gameLog, setGameLog] = useState<string[]>([]);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck.slice(14));
    setPlayerHand(newDeck.slice(0, 7));
    setBotHand(newDeck.slice(7, 14));
    setPlayerScore(0);
    setBotScore(0);
    setCenterCards({ player: null, bot: null });
    setGameLog([]);
  };

  const playCard = (card: PlayingCard) => {
    const botCard = botHand[0];
    if (!botCard) return;

    setCenterCards({ player: card, bot: botCard });

    // Update hands
    setPlayerHand(playerHand.filter((c) => c.id !== card.id));
    setBotHand(botHand.slice(1));

    // Compare cards and update scores
    if (card.value > botCard.value) {
      setPlayerScore((s) => s + 1);
      setGameLog((log) => [
        `Player wins with ${card.rank}${card.suit} vs ${botCard.rank}${botCard.suit}`,
        ...log,
      ]);
    } else if (card.value < botCard.value) {
      setBotScore((s) => s + 1);
      setGameLog((log) => [
        `Bot wins with ${botCard.rank}${botCard.suit} vs ${card.rank}${card.suit}`,
        ...log,
      ]);
    } else {
      setGameLog((log) => [
        `Draw with ${card.rank}${card.suit}, Draw 1 card`,
        ...log,
      ]);
      if (deck.length >= 2) {
        setPlayerHand((h) => [...h, deck[0]]);
        setBotHand((h) => [...h, deck[1]]);
        setDeck((d) => d.slice(2));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 p-6 flex">
      <div className="flex flex-col w-full justify-center space-y-8 bg-green-900 rounded-lg">
        {/* Bot's hand */}
        <div className="flex justify-center gap-2">
          {botHand.map((card) => (
            <div
              key={card.id}
              className="w-16 h-24 bg-red-800 border border-white rounded-lg shadow-md flex items-center justify-center"
            ></div>
          ))}
        </div>

        {/* Center area */}
        <div className="h-48 flex flex-col justify-center items-center gap-4">
          {centerCards.bot && (
            <div className="w-16 h-24 bg-white rounded-lg shadow-md flex items-center justify-center">
              <span className={`text-2xl font-bold ${centerCards.bot.color}`}>
                {centerCards.bot.rank}
                {centerCards.bot.suit}
              </span>
            </div>
          )}
          {centerCards.player && (
            <div className="w-16 h-24 bg-white rounded-lg shadow-md flex items-center justify-center">
              <span
                className={`text-2xl font-bold ${centerCards.player.color}`}
              >
                {centerCards.player.rank}
                {centerCards.player.suit}
              </span>
            </div>
          )}
        </div>

        {/* Player's hand */}
        <div className="flex justify-center gap-2">
          {playerHand.map((card) => (
            <button
              key={card.id}
              onClick={() => playCard(card)}
              className="focus:outline-none transform hover:-translate-y-2 transition-transform"
              aria-label={`Play ${card.rank} of ${card.suit}`}
            >
              <div className="w-16 h-24 bg-white rounded-lg shadow-md flex items-center justify-center">
                <span className={`text-2xl font-bold ${card.color}`}>
                  {card.rank}
                  {card.suit}
                </span>
              </div>
            </button>
          ))}
        </div>

        {playerHand.length === 0 && botHand.length === 0 && (
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4">
              Game Over! {playerScore > botScore ? "You Win!" : "Bot Wins!"}
            </div>
            <button
              onClick={startNewGame}
              className="bg-white px-6 py-2 rounded-lg font-bold hover:bg-gray-100"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Scores and Game log */}
      <div className="w-64 ml-6 space-y-6">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-bold mb-2">Scores</h2>
          <div>Bot: {botScore}</div>
          <div>Your: {playerScore}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md overflow-y-auto max-h-[calc(100vh-200px)]">
          <h2 className="text-xl font-bold mb-2">Game Log</h2>
          <div className="space-y-1">
            {gameLog.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
