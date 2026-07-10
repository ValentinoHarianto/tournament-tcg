import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Tournament, Pairing, MatchResult } from '@/lib/types';
import { advancedSwissPair, recordMatch } from '@/lib/advancedSwissPairing';
import { calculateOpponentWinPercentage, calculateBuchholzScore } from '@/lib/tiebreaker';
import { createPlayer, updatePlayerStats } from '@/lib/utils';

interface TournamentStore {
  // State
  tournament: Tournament | null;
  
  // Actions
  createTournament: (name: string, totalRounds: number) => void;
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  generatePairing: () => void;
  recordMatchResult: (pairingId: string, result: MatchResult) => void;
  startNextRound: () => void;
  resetTournament: () => void;
  updatePlayerStats: (playerId: string, wins: number, losses: number, draws: number) => void;
  loadTournament: (tournament: Tournament) => void;
}

const initialTournament: Tournament = {
  id: '',
  name: '',
  players: [],
  pairings: [],
  currentRound: 0,
  totalRounds: 5,
  matchHistory: new Map(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useTournamentStore = create<TournamentStore>()(
  persist(
    (set, get) => ({
      tournament: null,

      createTournament: (name: string, totalRounds: number) => {
        const newTournament: Tournament = {
          ...initialTournament,
          id: Math.random().toString(36).substring(2, 11),
          name,
          totalRounds,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set({ tournament: newTournament });
      },

      addPlayer: (name: string) => {
        const { tournament } = get();
        if (!tournament) return;

        const newPlayer = createPlayer(name);
        const updatedTournament = {
          ...tournament,
          players: [...tournament.players, newPlayer],
          updatedAt: new Date(),
        };

        set({ tournament: updatedTournament });
      },

      removePlayer: (playerId: string) => {
        const { tournament } = get();
        if (!tournament) return;

        const updatedTournament = {
          ...tournament,
          players: tournament.players.filter(p => p.id !== playerId),
          updatedAt: new Date(),
        };

        set({ tournament: updatedTournament });
      },

      generatePairing: () => {
        const { tournament } = get();
        if (!tournament || tournament.currentRound >= tournament.totalRounds) return;

        const pairings = advancedSwissPair(
          tournament.players,
          tournament.matchHistory,
          tournament.currentRound + 1
        );

        const updatedTournament = {
          ...tournament,
          pairings: [...tournament.pairings, pairings],
          updatedAt: new Date(),
        };

        set({ tournament: updatedTournament });
      },

      recordMatchResult: (pairingId: string, result: MatchResult) => {
        const { tournament } = get();
        if (!tournament) return;

        // Find and update the pairing
        const updatedPairings = tournament.pairings.map(roundPairings =>
          roundPairings.map(pairing => {
            if (pairing.id === pairingId) {
              return {
                ...pairing,
                result,
              };
            }
            return pairing;
          })
        );

        // Find the pairing to get player information
        const pairing = updatedPairings
          .flat()
          .find(p => p.id === pairingId);

        if (!pairing || !result) return;

        // Update match history
        recordMatch(
          pairing.player1.id,
          pairing.player2.id,
          tournament.matchHistory
        );

        // Update players
        let updatedPlayers = [...tournament.players];

        const player1Index = updatedPlayers.findIndex(p => p.id === pairing.player1.id);
        if (player1Index !== -1) {
          const updatedPlayer1 = updatePlayerStats(
            updatedPlayers[player1Index],
            result.player1Wins,
            result.player1Losses,
            result.player1Draws
          );
          updatedPlayers[player1Index] = updatedPlayer1;
        }

        const player2Index = updatedPlayers.findIndex(p => p.id === pairing.player2.id);
        if (player2Index !== -1) {
          const updatedPlayer2 = updatePlayerStats(
            updatedPlayers[player2Index],
            result.player2Wins,
            result.player2Losses,
            result.player2Draws
          );
          updatedPlayers[player2Index] = updatedPlayer2;
        }

        // Recalculate tiebreakers
        updatedPlayers = updatedPlayers.map(player => {
          const opponents = updatedPairings
            .flat()
            .filter(
              p =>
                (p.player1.id === player.id || p.player2.id === player.id) &&
                p.result
            )
            .map(p => (p.player1.id === player.id ? p.player2 : p.player1));

          return {
            ...player,
            opponentWinPercentage: calculateOpponentWinPercentage(player, opponents),
            buchholzScore: calculateBuchholzScore(player, opponents),
          };
        });

        const updatedTournament = {
          ...tournament,
          pairings: updatedPairings,
          players: updatedPlayers,
          updatedAt: new Date(),
        };

        set({ tournament: updatedTournament });
      },

      startNextRound: () => {
        const { tournament } = get();
        if (!tournament) return;

        const updatedTournament = {
          ...tournament,
          currentRound: tournament.currentRound + 1,
          updatedAt: new Date(),
        };

        set({ tournament: updatedTournament });
      },

      resetTournament: () => {
        set({ tournament: null });
      },

      updatePlayerStats: (playerId: string, wins: number, losses: number, draws: number) => {
        const { tournament } = get();
        if (!tournament) return;

        const player = tournament.players.find(p => p.id === playerId);
        if (!player) return;

        const updatedPlayer = updatePlayerStats(player, wins, losses, draws);

        const updatedTournament = {
          ...tournament,
          players: tournament.players.map(p =>
            p.id === playerId ? updatedPlayer : p
          ),
          updatedAt: new Date(),
        };

        set({ tournament: updatedTournament });
      },

      loadTournament: (tournament: Tournament) => {
        set({ tournament });
      },
    }),
    {
      name: 'tournament-store',
      version: 1,
    }
  )
);
