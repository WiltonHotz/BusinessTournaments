using System;
using System.Collections.Generic;

namespace BusinessTournaments.Models.Entities
{
    public partial class Tournaments
    {
        public Tournaments()
        {
            T2p = new HashSet<T2p>();
        }

        public int Id { get; set; }
        public string TournamentName { get; set; }
        public string BracketsJsonString { get; set; }
        public DateTime Created { get; set; }
        public DateTime? LastModified { get; set; }
        public string CompanyId { get; set; }
        public bool IsCompleted { get; set; }

        public virtual AspNetUsers Company { get; set; }
        public virtual ICollection<T2p> T2p { get; set; }
    }
}
