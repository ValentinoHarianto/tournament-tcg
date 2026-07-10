'use client';

import React, { useState } from 'react';
import { Player } from '@/lib/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RankingProjection from '@/components/RankingProjection';
import PlayerStats from '@/components/PlayerStats';
import { sortPlayersByRanking } from '@/lib/utils';

interface DetailedStandingsProps {
  players: Player[];
  roundNumber: number;
  showProjections?: boolean;
}

export default function DetailedStandings({
  players,
  roundNumber,
  showProjections = true,
}: DetailedStandingsProps) {
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const sortedPlayers = sortPlayersByRanking(players);

  return (
    <div className="space-y-3">
      {sortedPlayers.map((player, index) => (
        <div key={player.id}>
          <button
            onClick={() =>
              setExpandedPlayerId(
                expandedPlayerId === player.id ? null : player.id
              )
            }
            className="w-full text-left"
          >
            <div className="card hover-lift flex items-center justify-between cursor-pointer">
              <div className="flex-1 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{player.name}</p>
                  <p className="text-xs text-gray-500">
                    {player.wins}-{player.losses}-{player.draws} • {player.matchPoints} pts
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right text-sm">
                  <p className="font-semibold text-primary-600">
                    OMW: {(player.opponentWinPercentage * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    GWP: {((player.gameWinPercentage || 0) * 100).toFixed(1)}%
                  </p>
                </div>

                {expandedPlayerId === player.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </button>

          {expandedPlayerId === player.id && (
            <div className="mt-2 ml-4 space-y-3 animate-slide-in">
              <PlayerStats player={player} rank={index + 1} />
              {showProjections && (
                <RankingProjection
                  player={player}
                  allPlayers={players}
                  roundNumber={roundNumber}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
