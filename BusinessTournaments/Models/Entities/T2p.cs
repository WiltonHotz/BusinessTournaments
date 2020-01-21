using System;
using System.Collections.Generic;

namespace BusinessTournaments.Models.Entities
{
    public partial class T2p
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public int TournamentId { get; set; }

        public virtual Players Player { get; set; }
        public virtual Tournaments Tournament { get; set; }
    }
}
