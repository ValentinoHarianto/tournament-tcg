import { useTournamentStore } from '@/store/tournamentStore';

/**
 * Custom hook for tournament state management
 */
export function useTournament() {
  const store = useTournamentStore();

  return {
    tournament: store.tournament,
    createTournament: store.createTournament,
    addPlayer: store.addPlayer,
    removePlayer: store.removePlayer,
    generatePairing: store.generatePairing,
    recordMatchResult: store.recordMatchResult,
    startNextRound: store.startNextRound,
    resetTournament: store.resetTournament,
    updatePlayerStats: store.updatePlayerStats,
  };
}
