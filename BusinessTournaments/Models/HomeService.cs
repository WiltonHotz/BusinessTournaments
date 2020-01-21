using BusinessTournaments.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models
{
    public class HomeService
    {
        private readonly BusinessTournamentsDbContext context;
        public HomeService(BusinessTournamentsDbContext context)
        {
            this.context = context;
        }
        internal async Task<IndexVM> GetIndexVMAsync()
        {
            var players = await context.Players
                .Where(c => c.CompanyId == 1)
                .Select(p => new PlayerVM
                {
                    PlayerId = p.Id,
                    PlayerName = p.Name,
                    Score = p.Score
                }).ToListAsync();

            var tournaments = await context.Tournaments
                .Where(c => c.CompanyId == 1)
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
    }
}
