using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.ViewModels
{
    public class IndexVM
    {
        public IEnumerable<PlayerVM> Leaderboard { get; set; }
        public IEnumerable<TournamentVM> OngoingTournaments { get; set; }
        public IEnumerable<TournamentVM> CompletedTournaments { get; set; }
    }
}
