using BusinessTournaments.Models.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models
{
    public class AccountService
    {
        private readonly UserManager<CompanyUser> userManager;
        private readonly SignInManager<CompanyUser> signInManager;

        public AccountService(
            UserManager<CompanyUser> userManager,
            SignInManager<CompanyUser> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }
    }
}
