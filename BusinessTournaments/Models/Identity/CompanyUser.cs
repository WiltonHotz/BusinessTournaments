﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.Identity
{
    public class CompanyUser : IdentityUser
    {
        public string CompanyName { get; set; }
    }
}