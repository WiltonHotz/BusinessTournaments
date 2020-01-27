using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.ViewModels
{
    public class FinalizeTournamentVM
    {
        public int WinnerPlayerId { get; set; }
        public int WinnerScore { get; set; }
        public int SecondPlayerId { get; set; }
        public int SecondScore { get; set; }
        public int TournamentId { get; set; }
    }
}
