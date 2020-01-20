using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.Identity
{
    public class CompanyContext : IdentityDbContext<CompanyUser> 
    {
        public CompanyContext(DbContextOptions<CompanyContext> options) : base(options)
        {
            var result = Database.EnsureCreated();
        }
    }
}
