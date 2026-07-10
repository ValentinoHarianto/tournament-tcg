import { Player } from './types';

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Create a new player
 */
export function createPlayer(name: string): Player {
  return {
    id: generateId(),
    name,
    wins: 0,
    losses: 0,
    draws: 0,
    buchholzScore: 0,
    opponentWinPercentage: 0,
    gameWinPercentage: 0,
    matchPoints: 0,
  };
}

/**
 * Update player stats based on match result
 */
export function updatePlayerStats(
  player: Player,
  wins: number,
  losses: number,
  draws: number
): Player {
  return {
    ...player,
    wins: player.wins + wins,
    losses: player.losses + losses,
    draws: player.draws + draws,
    matchPoints: (player.wins + wins) * 3 + (player.draws + draws) * 1,
    gameWinPercentage:
      calculateGameWinPercentage(
        player.wins + wins,
        player.losses + losses,
        player.draws + draws
      ),
  };
}

/**
 * Calculate game win percentage
 */
export function calculateGameWinPercentage(
  wins: number,
  losses: number,
  draws: number
): number {
  const totalGames = wins + losses + draws;
  if (totalGames === 0) return 0;
  return (wins + draws * 0.5) / totalGames;
}

/**
 * Format player record
 */
export function formatRecord(player: Player): string {
  return `${player.wins}-${player.losses}-${player.draws}`;
}

/**
 * Sort players by ranking
 */
export function sortPlayersByRanking(players: Player[]): Player[] {
  return [...players].sort((a, b) => {
    // Sort by match points (descending)
    if (b.matchPoints !== a.matchPoints) {
      return b.matchPoints - a.matchPoints;
    }
    // Then by OMW (descending)
    if (Math.abs(b.opponentWinPercentage - a.opponentWinPercentage) > 0.001) {
      return b.opponentWinPercentage - a.opponentWinPercentage;
    }
    // Then by Buchholz (descending)
    if (b.buchholzScore !== a.buchholzScore) {
      return b.buchholzScore - a.buchholzScore;
    }
    // Then by GWP (descending)
    if (Math.abs(b.gameWinPercentage - a.gameWinPercentage) > 0.001) {
      return b.gameWinPercentage - a.gameWinPercentage;
    }
    // Finally by name (alphabetical)
    return a.name.localeCompare(b.name);
  });
}

/**
 * Validate match result
 */
export function isValidMatchResult(
  player1Wins: number,
  player1Losses: number,
  player1Draws: number,
  player2Wins: number,
  player2Losses: number,
  player2Draws: number
): boolean {
  // Total games must be same for both players
  const player1Total = player1Wins + player1Losses + player1Draws;
  const player2Total = player2Wins + player2Losses + player2Draws;

  if (player1Total !== player2Total || player1Total === 0) {
    return false;
  }

  // Must be valid for best of 3 (max 3 games)
  if (player1Total > 3) {
    return false;
  }

  // If one player won, check it's valid
  if (player1Wins > 0 && player2Wins > 0) {
    // Both can't have wins in a valid match
    return false;
  }

  // Check totals make sense
  return true;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

/**
 * Get player ranking position
 */
export function getPlayerRanking(
  player: Player,
  allPlayers: Player[]
): number {
  const sorted = sortPlayersByRanking(allPlayers);
  return sorted.findIndex(p => p.id === player.id) + 1;
}
