using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.ViewModels
{
    public class TournamentVM
    {
        public int TournamentId { get; set; }
        public string TournamentName { get; set; }
        public DateTime Date { get; set; }
        public bool IsCompleted { get; set; }
    }
}
