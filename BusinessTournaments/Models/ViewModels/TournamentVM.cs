using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.ViewModels
{
    public class TournamentVM
    {
        public int TournamentId { get; set; }

        public string TournamentName { get; set; }

        [DisplayFormat(DataFormatString = "{0:dd MMM yyyy}")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        public bool IsCompleted { get; set; }
    }
}
