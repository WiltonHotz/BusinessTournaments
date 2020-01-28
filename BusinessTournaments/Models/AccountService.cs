using BusinessTournaments.Models.Identity;
using BusinessTournaments.Models.ViewModels;
using Microsoft.AspNetCore.Http;
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
        private readonly IHttpContextAccessor accessor;

        public AccountService(
            UserManager<CompanyUser> userManager,
            SignInManager<CompanyUser> signInManager,
            IHttpContextAccessor accessor)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.accessor = accessor;
        }

        internal async Task<IdentityResult> TryCreateCompanyAsync(AccountRegisterVM vm)
        {
            var result = await userManager.CreateAsync(new CompanyUser
            {
                UserName = vm.UserName
            }, vm.Password);

            return result;
        }

        internal async Task<SignInResult> TryLoginCompanyAsync(AccountLoginVM vm)
        {
            var result = await signInManager.PasswordSignInAsync(vm.CompanyName,vm.Password, true, false);

            return result;
        }
        internal string GetUserId() => userManager.GetUserId(accessor.HttpContext.User);

        internal async Task LogoutMemberAsync() => await signInManager.SignOutAsync();
    }
}
