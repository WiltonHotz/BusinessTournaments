using BusinessTournaments.Models.Entities;
using BusinessTournaments.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models
{
    public class HomeService
    {
        private readonly BusinessTournamentsDBContext context;
        public HomeService(BusinessTournamentsDBContext context)
        {
            this.context = context;
        }
        internal async Task<IndexVM> GetIndexVMAsync(string userId)
        {
            var players = await context.Players
                .Where(c => c.CompanyId == userId)
                .Select(p => new PlayerVM
                {
                    PlayerId = p.Id,
                    PlayerName = p.Name,
                    Score = p.Score
                }).ToListAsync();

            var tournaments = await context.Tournaments
                .Where(c => c.CompanyId == userId)
                .Select(t => new TournamentVM
                {
                    TournamentId = t.Id,
                    TournamentName = t.TournamentName,
                    Date = t.Created,
                    IsCompleted = t.IsCompleted
                }).ToListAsync();

            return new IndexVM
            {
                Leaderboard = players,
                OngoingTournaments = tournaments.Where(t => t.IsCompleted == false),
                CompletedTournaments = tournaments.Where(t => t.IsCompleted == true)
            };
        }

        internal async Task<PlayerVM> CreatePlayerAsync(string playerName, string userId)
        {
            var newPlayer = await context.Players.AddAsync(new Players
            {
                Name = playerName,
                CompanyId = userId,
                Score = 0
            });
            await context.SaveChangesAsync();
            return new PlayerVM
            {
                PlayerName = newPlayer.Entity.Name,
                PlayerId = newPlayer.Entity.Id,
                Score = newPlayer.Entity.Score
            };
        }

        internal async Task<TournamentVM> CreateTournamentAsync(StartTournament startTournament, string userId)
        {
            var newTournament = await context.Tournaments.AddAsync(new Tournaments
            {
                TournamentName = startTournament.TournamentName,
                CompanyId = userId,
                
            });
            await context.SaveChangesAsync();
            return new TournamentVM
            {
                TournamentName = newTournament.Entity.TournamentName,
                TournamentId = newTournament.Entity.Id
                
            };
        }

        internal async Task<TournamentVM> ResumeTournamentAsync(StartTournament startTournament, string userId)
        {
            var resumeTournament = await context.Tournaments.AddAsync(new Tournaments
            {
                TournamentName = startTournament.TournamentName,
                CompanyId = userId,
                Id = int.Parse(startTournament.TournamentId)

            });
            await context.SaveChangesAsync();
            return new TournamentVM
            {
                TournamentName = resumeTournament.Entity.TournamentName,
                TournamentId = resumeTournament.Entity.Id
            };
        }
    }
}
