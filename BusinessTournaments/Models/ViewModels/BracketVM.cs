﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.ViewModels
{
    public class BracketVM
    {
        public List<Bracket> Brackets { get; set; }
        public int TournamentId { get; set; }
        public string TournamentName { get; set; }
    }
}
