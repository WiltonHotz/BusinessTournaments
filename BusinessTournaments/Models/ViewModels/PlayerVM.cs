using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.Identity
{
    public class PlayerVM
    {
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public int? Score { get; set; }
    }
}
