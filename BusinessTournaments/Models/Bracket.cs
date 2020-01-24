﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models
{
    public class Bracket
    {
        public int BracketId { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string BracketState { get; set; }
    }
}
