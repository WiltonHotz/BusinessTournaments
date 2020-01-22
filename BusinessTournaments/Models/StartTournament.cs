using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models
{
    public class StartTournament
    {
        public List<string> PlayerIds { get; set; }
        public string TournamentName { get; set; }
        public string TournamentId { get; set; }
    }
}
