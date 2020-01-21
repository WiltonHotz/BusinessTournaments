using System;
using System.Collections.Generic;

namespace BusinessTournaments.Models.Entities
{
    public partial class Players
    {
        public Players()
        {
            T2p = new HashSet<T2p>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string CompanyId { get; set; }
        public int Score { get; set; }

        public virtual AspNetUsers Company { get; set; }
        public virtual ICollection<T2p> T2p { get; set; }
    }
}
