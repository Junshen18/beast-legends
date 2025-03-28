"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

interface BeastCard {
  id: number;
  name: string;
  image: string;
  dodge: number;
  health: number;
  maxHealth: number;
  attack: string;
  type: string;
  element: string;
}

export default function BattleFieldPage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  // Player and opponent cards
  const [playerCards, setPlayerCards] = useState<BeastCard[]>([]);
  const [opponentCards, setOpponentCards] = useState<BeastCard[]>([]);

  // Current active cards
  const [playerBeast, setPlayerBeast] = useState<BeastCard | null>(null);
  const [opponentBeast, setOpponentBeast] = useState<BeastCard | null>(null);

  // Available cards tracking
  const [playerAvailableCards, setPlayerAvailableCards] = useState<number[]>(
    []
  );
  const [opponentAvailableCards, setOpponentAvailableCards] = useState<
    number[]
  >([]);

  // Battle state
  const [battleState, setBattleState] = useState<
    "ready" | "spinning" | "result" | "switching"
  >("ready");
  const [battleResult, setBattleResult] = useState<"win" | "lose" | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [slotMachine, setSlotMachine] = useState<number[]>([0, 0, 0]);
  const [gameOver, setGameOver] = useState(false);

  // Initialize the battle with cards
  useEffect(() => {
    // Create player cards
    const playerCardsList: BeastCard[] = [
      {
        id: 1,
        name: "LUMINA",
        image: "/marketplace/common-2.png",
        dodge: 15,
        health: 1000,
        maxHealth: 1000,
        attack: "20-80",
        type: "Common",
        element: "Light",
      },
      {
        id: 2,
        name: "PHOENIX",
        image: "/marketplace/rare-1-square.png",
        dodge: 20,
        health: 800,
        maxHealth: 800,
        attack: "30-90",
        type: "Rare",
        element: "Fire",
      },
      {
        id: 3,
        name: "DRAGON",
        image: "/marketplace/mythic-2-square.png",
        dodge: 10,
        health: 1200,
        maxHealth: 1200,
        attack: "40-100",
        type: "Mythic",
        element: "Earth",
      },
    ];

    // Create opponent cards
    const opponentCardsList: BeastCard[] = [
      {
        id: 1,
        name: "LION",
        image: "/marketplace/common.png",
        dodge: 10,
        maxHealth: 1200,
        health: 1200,
        attack: "30-100",
        type: "Common",
        element: "Earth",
      },
      {
        id: 2,
        name: "WOLF",
        image: "/marketplace/rare-2-square.png",
        dodge: 25,
        health: 750,
        maxHealth: 750,
        attack: "25-85",
        type: "Rare",
        element: "Water",
      },
      {
        id: 3,
        name: "GRIFFIN",
        image: "/marketplace/epic-1-square.png",
        dodge: 15,
        health: 1100,
        maxHealth: 1100,
        attack: "35-95",
        type: "Epic",
        element: "Air",
      },
    ];

    setPlayerCards(playerCardsList);
    setOpponentCards(opponentCardsList);

    // Set initial active beasts
    setPlayerBeast(playerCardsList[0]);
    setOpponentBeast(opponentCardsList[0]);

    // Set available cards (indices 0, 1, 2 for 3 cards)
    setPlayerAvailableCards([0, 1, 2]);
    setOpponentAvailableCards([0, 1, 2]);
  }, []);

  // Function to handle the battle slot machine
  const spinSlotMachine = () => {
    if (battleState !== "ready") return;

    setBattleState("spinning");
    setBattleLog([...battleLog, "Spinning the battle wheel..."]);

    // Simulate slot machine spinning
    let spins = 0;
    const maxSpins = 20; // Number of visual spins
    const spinInterval = setInterval(() => {
      setSlotMachine([
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ]);

      spins++;
      if (spins >= maxSpins) {
        clearInterval(spinInterval);
        calculateBattleResult();
      }
    }, 100);
  };

  // Calculate battle result based on slot machine outcome
  const calculateBattleResult = () => {
    if (!playerBeast || !opponentBeast) return;

    // Generate final slot values
    const finalSlots = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
    setSlotMachine(finalSlots);

    // Calculate damage based on slot values
    const slotSum = finalSlots.reduce((a, b) => a + b, 0);
    const playerDamage = Math.floor(20 + slotSum * 3); // Base damage + slot bonus

    // Check if opponent dodges (based on dodge stat)
    const dodgeRoll = Math.random() * 100;
    if (dodgeRoll < opponentBeast.dodge) {
      setBattleLog([...battleLog, `${opponentBeast.name} dodged your attack!`]);
      // Opponent counter-attack
      const opponentDamage = Math.floor(30 + Math.random() * 70);

      // Update player beast health
      const updatedPlayerCards = [...playerCards];
      const playerIndex = playerAvailableCards[0]; // Current active card
      updatedPlayerCards[playerIndex].health = Math.max(
        0,
        playerBeast.health - opponentDamage
      );
      setPlayerCards(updatedPlayerCards);
      setPlayerBeast({
        ...playerBeast,
        health: Math.max(0, playerBeast.health - opponentDamage),
      });

      setBattleLog([
        ...battleLog,
        `${opponentBeast.name} dodged your attack!`,
        `${opponentBeast.name} counter-attacks for ${opponentDamage} damage!`,
      ]);

      // Check if player beast is defeated
      if (updatedPlayerCards[playerIndex].health <= 0) {
        handlePlayerBeastDefeated();
      } else {
        setBattleState("result");
      }
    } else {
      // Successful hit
      // Update opponent beast health
      const updatedOpponentCards = [...opponentCards];
      const opponentIndex = opponentAvailableCards[0]; // Current active card
      updatedOpponentCards[opponentIndex].health = Math.max(
        0,
        opponentBeast.health - playerDamage
      );
      setOpponentCards(updatedOpponentCards);
      setOpponentBeast({
        ...opponentBeast,
        health: Math.max(0, opponentBeast.health - playerDamage),
      });

      const newLogs = [
        ...battleLog,
        `You hit ${opponentBeast.name} for ${playerDamage} damage!`,
      ];

      // Check if opponent beast is defeated
      if (updatedOpponentCards[opponentIndex].health <= 0) {
        handleOpponentBeastDefeated(newLogs);
      } else {
        // Opponent counter-attack
        const opponentDamage = Math.floor(30 + Math.random() * 70);

        // Update player beast health
        const updatedPlayerCards = [...playerCards];
        const playerIndex = playerAvailableCards[0]; // Current active card
        updatedPlayerCards[playerIndex].health = Math.max(
          0,
          playerBeast.health - opponentDamage
        );
        setPlayerCards(updatedPlayerCards);
        setPlayerBeast({
          ...playerBeast,
          health: Math.max(0, playerBeast.health - opponentDamage),
        });

        const counterLogs = [
          ...newLogs,
          `${opponentBeast.name} attacks for ${opponentDamage} damage!`,
        ];

        // Check if player beast is defeated
        if (updatedPlayerCards[playerIndex].health <= 0) {
          handlePlayerBeastDefeated(counterLogs);
        } else {
          setBattleLog(counterLogs);
          setBattleState("result");
        }
      }
    }
  };

  // Handle opponent beast defeated
  const handleOpponentBeastDefeated = (currentLogs = battleLog) => {
    // Remove the first card from available cards
    const newAvailableCards = [...opponentAvailableCards];
    newAvailableCards.shift();
    setOpponentAvailableCards(newAvailableCards);

    setBattleLog([...currentLogs, `You defeated ${opponentBeast?.name}!`]);

    // Check if opponent has more cards
    if (newAvailableCards.length > 0) {
      setBattleLog([
        ...currentLogs,
        `You defeated ${opponentBeast?.name}!`,
        `Opponent is sending out their next beast!`,
      ]);
      setBattleState("switching");

      // Set next opponent beast after a delay
      setTimeout(() => {
        setOpponentBeast(opponentCards[newAvailableCards[0]]);
        setBattleState("ready");
      }, 1500);
    } else {
      // No more opponent cards - player wins the battle
      setBattleLog([
        ...currentLogs,
        `You defeated ${opponentBeast?.name}!`,
        `You won the battle!`,
      ]);
      setBattleResult("win");
      setGameOver(true);
      setBattleState("result");
    }
  };

  // Handle player beast defeated
  const handlePlayerBeastDefeated = (currentLogs = battleLog) => {
    // Remove the first card from available cards
    const newAvailableCards = [...playerAvailableCards];
    newAvailableCards.shift();
    setPlayerAvailableCards(newAvailableCards);

    setBattleLog([...currentLogs, `Your ${playerBeast?.name} was defeated!`]);

    // Check if player has more cards
    if (newAvailableCards.length > 0) {
      setBattleLog([
        ...currentLogs,
        `Your ${playerBeast?.name} was defeated!`,
        `Sending out your next beast!`,
      ]);
      setBattleState("switching");

      // Set next player beast after a delay
      setTimeout(() => {
        setPlayerBeast(playerCards[newAvailableCards[0]]);
        setBattleState("ready");
      }, 1500);
    } else {
      // No more player cards - player loses the battle
      setBattleLog([
        ...currentLogs,
        `Your ${playerBeast?.name} was defeated!`,
        `You lost the battle!`,
      ]);
      setBattleResult("lose");
      setGameOver(true);
      setBattleState("result");
    }
  };

  // Reset the battle
  const resetBattle = () => {
    // Reset all cards to full health
    const resetPlayerCards = playerCards.map((card) => ({
      ...card,
      health: card.maxHealth,
    }));

    const resetOpponentCards = opponentCards.map((card) => ({
      ...card,
      health: card.maxHealth,
    }));

    setPlayerCards(resetPlayerCards);
    setOpponentCards(resetOpponentCards);

    // Reset active beasts
    setPlayerBeast(resetPlayerCards[0]);
    setOpponentBeast(resetOpponentCards[0]);

    // Reset available cards
    setPlayerAvailableCards([0, 1, 2]);
    setOpponentAvailableCards([0, 1, 2]);

    // Reset battle state
    setBattleState("ready");
    setBattleResult(null);
    setBattleLog([]);
    setSlotMachine([0, 0, 0]);
    setGameOver(false);
  };

  if (!playerBeast || !opponentBeast) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[url('/dapp/battle/battle-field.png')] bg-cover bg-center">
        <div className="bg-black/60 backdrop-blur-md p-8 rounded-xl text-white text-center">
          <div className="animate-spin mb-4 mx-auto w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
          <h2 className="text-2xl font-bold font-dark-mystic">
            Loading Battle...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/dapp/battle/battle-field.png')] bg-cover bg-center py-10">
      <div className="flex flex-col justify-between bg-white/90 w-[540px] min-h-[800px] rounded-lg p-6 relative">
        <div className="absolute top-4 right-0 text-white font-bold z-10">
          {/* Opponent Info */}
          <div className="flex items-center bg-slate-500 px-2 py-1 rounded-s-lg w-44 mb-1">
            <span className="mr-2">Opponent</span>
            <div className="flex ml-auto">
              {opponentAvailableCards.map((cardIndex, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full mx-0.5 flex items-center justify-center text-xs
                                              ${
                                                i === 0
                                                  ? "bg-green-500 border-2 border-white"
                                                  : "bg-white"
                                              }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Player Info */}
        <div className="absolute bottom-[27rem] left-0 text-white font-bold z-10">
          <div className="flex items-center bg-slate-600 px-2 py-1 rounded-e-lg w-44">
            <span className="mr-2 truncate">
              {publicKey?.toString().slice(0, 6)}...
              {publicKey?.toString().slice(-3)}
            </span>
            <div className="flex ml-auto">
              {playerAvailableCards.map((cardIndex, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full mx-0.5 flex items-center justify-center text-xs
                                              ${
                                                i === 0
                                                  ? "bg-green-500 border-2 border-white"
                                                  : "bg-white"
                                              }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Opponent Beast Card */}
        <div className="flex justify-end ">
          <div className="mb-8 relative mt-8 w-[220px] h-[220px]">
            <Image
              src={opponentBeast.image}
              alt={opponentBeast.name}
              width={220}
              height={300}
              className={`rounded-lg border-4 ${
                battleState === "switching" && opponentAvailableCards.length < 3
                  ? "opacity-50"
                  : ""
              } 
                                   ${
                                     opponentBeast.type === "Common"
                                       ? "border-gray-400"
                                       : opponentBeast.type === "Rare"
                                       ? "border-blue-400"
                                       : opponentBeast.type === "Epic"
                                       ? "border-purple-400"
                                       : "border-yellow-400"
                                   }`}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
              <div className="text-center font-dark-mystic text-xl">
                {opponentBeast.name}
              </div>
              <div className="flex justify-between text-sm px-2">
                <div>
                  DODGE
                  <br />
                  {opponentBeast.dodge}
                </div>
                <div>
                  HEALTH
                  <br />
                  {opponentBeast.health}
                </div>
                <div>
                  ATTACK
                  <br />
                  {opponentBeast.attack}
                </div>
              </div>
            </div>
            <div
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (opponentBeast.health / opponentBeast.maxHealth) * 100
                }%`,
                maxWidth: "90%",
              }}
            ></div>
          </div>
        </div>

        <div className="text-5xl font-bold font-dark-mystic text-center">
          VS
        </div>

        {/* Player Beast Card */}
        <div className="mt-8 mb-4 relative w-[220px] h-[220px]">
          <Image
            src={playerBeast.image}
            alt={playerBeast.name}
            width={220}
            height={300}
            className={`rounded-lg border-4 ${
              battleState === "switching" && playerAvailableCards.length < 3
                ? "opacity-50"
                : ""
            } 
                                   ${
                                     playerBeast.type === "Common"
                                       ? "border-gray-400"
                                       : playerBeast.type === "Rare"
                                       ? "border-blue-400"
                                       : playerBeast.type === "Epic"
                                       ? "border-purple-400"
                                       : "border-yellow-400"
                                   }`}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg">
            <div className="text-center font-dark-mystic text-xl">
              {playerBeast.name}
            </div>
            <div className="flex justify-between text-sm px-2">
              <div>
                DODGE
                <br />
                {playerBeast.dodge}
              </div>
              <div>
                HEALTH
                <br />
                {playerBeast.health}
              </div>
              <div>
                ATTACK
                <br />
                {playerBeast.attack}
              </div>
            </div>
          </div>
          <div
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(playerBeast.health / playerBeast.maxHealth) * 100}%`,
              maxWidth: "90%",
            }}
          ></div>
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* Slot Machine */}
          {battleState === "ready" && (
            <div className="flex gap-2 my-4">
              {slotMachine.map((value, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-3xl font-bold border-2 border-gray-400"
                >
                  {value}
                </div>
              ))}
            </div>
          )}

          {/* Battle Result */}
          {gameOver && battleResult && (
            <div
              className={`text-3xl font-bold my-4 ${
                battleResult === "win" ? "text-green-600" : "text-red-600"
              }`}
            >
              {battleResult === "win" ? "VICTORY!" : "DEFEAT!"}
            </div>
          )}

          {/* Battle Log */}
          {battleLog.length > 0 && (
            <div className="bg-gray-100 p-3 rounded-lg w-full max-h-32 overflow-y-auto mb-4 text-sm">
              {battleLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            {battleState === "ready" ? (
              <button
                onClick={spinSlotMachine}
                className="bg-black text-white px-8 py-3 rounded-lg font-dark-mystic text-2xl hover:bg-gray-800 transition-colors"
              >
                BATTLE
              </button>
            ) : battleState === "result" && gameOver ? (
              <button
                onClick={resetBattle}
                className="bg-black text-white px-8 py-3 rounded-lg font-dark-mystic text-2xl hover:bg-gray-800 transition-colors"
              >
                BATTLE AGAIN
              </button>
            ) : (
              <div className="bg-gray-500 text-white px-8 py-3 rounded-lg font-dark-mystic text-2xl">
                {battleState === "switching" ? "SWITCHING..." : "BATTLING..."}
              </div>
            )}

            <Link href="/dapp">
              <div className="bg-gray-300 text-black px-8 py-3 rounded-lg font-dark-mystic text-2xl hover:bg-gray-400 transition-colors">
                QUIT
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
