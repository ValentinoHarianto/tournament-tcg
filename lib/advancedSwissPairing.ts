/**
 * Advanced Swiss Pairing Algorithm with Fair Ranking
 * This algorithm ensures that players are paired fairly based on:
 * 1. Match Points (Primary)
 * 2. Strength of Schedule (SOS) - Sum of Wins of all opponents
 * 3. Opponent Win Percentage (OMW) - Pokémon TCG standard
 * 4. Game Win Percentage (GWP)
 * 
 * The algorithm prevents "cliff drops" where a player suddenly drops from finalist to lower positions
 */

import { Player, Pairing } from './types';

/**
 * Advanced Swiss Pairing with fair ranking system
 * Prevents sudden ranking drops by ensuring consistent pairings
 */
export function advancedSwissPair(
  players: Player[],
  matchHistory: Map<string, Set<string>> = new Map(),
  roundNumber: number = 1
): Pairing[] {
  if (players.length < 2) {
    return [];
  }

  // Sort players using comprehensive tiebreaker system
  const sortedPlayers = sortPlayersForPairing(players, roundNumber);

  const pairings: Pairing[] = [];
  const paired = new Set<string>();

  // Pair using a "slide" method to avoid cliff drops
  for (let i = 0; i < sortedPlayers.length; i++) {
    if (paired.has(sortedPlayers[i].id)) {
      continue;
    }

    const player1 = sortedPlayers[i];
    let foundOpponent = false;

    // Search for opponent starting from the next player
    // This ensures balanced pairings within similar score groups
    const maxSearchDistance = Math.ceil(sortedPlayers.length / 4);

    for (let j = i + 1; j < sortedPlayers.length && j < i + maxSearchDistance; j++) {
      const player2 = sortedPlayers[j];

      if (paired.has(player2.id)) {
        continue;
      }

      // Check if they have already played
      if (havePlayedBefore(player1.id, player2.id, matchHistory)) {
        continue;
      }

      // Create pairing
      const pairingId = `${player1.id}-${player2.id}`;
      pairings.push({
        id: pairingId,
        player1,
        player2,
        round: roundNumber,
      });

      paired.add(player1.id);
      paired.add(player2.id);
      foundOpponent = true;
      break;
    }

    // If no opponent found in the preferred range, search further
    if (!foundOpponent) {
      for (let j = i + maxSearchDistance; j < sortedPlayers.length; j++) {
        const player2 = sortedPlayers[j];

        if (paired.has(player2.id)) {
          continue;
        }

        if (havePlayedBefore(player1.id, player2.id, matchHistory)) {
          continue;
        }

        const pairingId = `${player1.id}-${player2.id}`;
        pairings.push({
          id: pairingId,
          player1,
          player2,
          round: roundNumber,
        });

        paired.add(player1.id);
        paired.add(player2.id);
        foundOpponent = true;
        break;
      }
    }
  }

  return pairings;
}

/**
 * Sort players using comprehensive tiebreaker system
 * Prevents sudden ranking changes
 */
function sortPlayersForPairing(
  players: Player[],
  roundNumber: number
): Player[] {
  return [...players].sort((a, b) => {
    // 1st Tiebreaker: Match Points (most important)
    if (b.matchPoints !== a.matchPoints) {
      return b.matchPoints - a.matchPoints;
    }

    // 2nd Tiebreaker: Strength of Schedule (SOS)
    // Sum of wins of all opponents faced
    const sosA = calculateSOS(a, players);
    const sosB = calculateSOS(b, players);
    if (sosB !== sosA) {
      return sosB - sosA;
    }

    // 3rd Tiebreaker: Opponent Win Percentage (OMW)
    if (Math.abs(b.opponentWinPercentage - a.opponentWinPercentage) > 0.001) {
      return b.opponentWinPercentage - a.opponentWinPercentage;
    }

    // 4th Tiebreaker: Buchholz Score
    if (b.buchholzScore !== a.buchholzScore) {
      return b.buchholzScore - a.buchholzScore;
    }

    // 5th Tiebreaker: Game Win Percentage (GWP)
    if (Math.abs(b.gameWinPercentage - a.gameWinPercentage) > 0.001) {
      return b.gameWinPercentage - a.gameWinPercentage;
    }

    // Final Tiebreaker: Alphabetical by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Calculate Strength of Schedule (SOS)
 * Sum of wins for all opponents this player has faced
 */
function calculateSOS(player: Player, allPlayers: Player[]): number {
  // This would require tracking which opponents the player has faced
  // For now, return a reasonable estimate based on available data
  const totalWins = allPlayers.reduce((sum, p) => sum + p.wins, 0);
  return Math.floor(totalWins / allPlayers.length) * player.wins;
}

/**
 * Check if two players have played before
 */
function havePlayedBefore(
  playerId1: string,
  playerId2: string,
  matchHistory: Map<string, Set<string>>
): boolean {
  if (!matchHistory.has(playerId1)) {
    return false;
  }
  return matchHistory.get(playerId1)!.has(playerId2);
}

/**
 * Record a match between two players
 */
export function recordMatch(
  playerId1: string,
  playerId2: string,
  matchHistory: Map<string, Set<string>>
): void {
  if (!matchHistory.has(playerId1)) {
    matchHistory.set(playerId1, new Set());
  }
  if (!matchHistory.has(playerId2)) {
    matchHistory.set(playerId2, new Set());
  }

  matchHistory.get(playerId1)!.add(playerId2);
  matchHistory.get(playerId2)!.add(playerId1);
}

/**
 * Calculate ranking stability coefficient
 * Higher value = more stable ranking
 */
export function calculateRankingStability(
  player: Player,
  roundNumber: number
): number {
  // Players with consistent records should have more stable rankings
  const totalGames = player.wins + player.losses + player.draws;
  if (totalGames === 0) return 0;

  const consistency = player.wins / totalGames;
  const stability = consistency * roundNumber;

  return Math.min(stability, 1); // Cap at 1.0
}

/**
 * Detect potential ranking cliff
 * Returns true if player might drop unexpectedly
 */
export function hasRankingCliff(
  player: Player,
  allPlayers: Player[],
  roundNumber: number
): boolean {
  const sorted = [...allPlayers].sort((a, b) => b.matchPoints - a.matchPoints);
  const playerIndex = sorted.findIndex(p => p.id === player.id);

  if (playerIndex < 2) return false; // Top 2 are stable

  // Check if score gap is large compared to previous rounds
  const gapToPrevious = sorted[playerIndex - 1].matchPoints - player.matchPoints;
  const averageGap = (sorted[0].matchPoints - sorted[sorted.length - 1].matchPoints) / sorted.length;

  return gapToPrevious > averageGap * 2;
}

/**
 * Get ranking projection for next round
 */
export function projectedRanking(
  player: Player,
  allPlayers: Player[],
  roundNumber: number
): {
  bestCase: number;
  worstCase: number;
  likelyCase: number;
} {
  const sorted = [...allPlayers].sort((a, b) => b.matchPoints - a.matchPoints);
  const currentIndex = sorted.findIndex(p => p.id === player.id) + 1;

  // Best case: player wins next match
  const bestCasePoints = player.matchPoints + 3;
  const bestCaseIndex =
    sorted.filter(p => p.matchPoints > bestCasePoints).length + 1;

  // Worst case: player loses next match
  const worstCaseIndex =
    sorted.filter(p => p.matchPoints > player.matchPoints).length + 2;

  // Likely case: similar to current
  const likelyCase = currentIndex;

  return {
    bestCase: bestCaseIndex,
    worstCase: worstCaseIndex,
    likelyCase,
  };
}
