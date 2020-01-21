using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessTournaments.Models;
using BusinessTournaments.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessTournaments.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly AccountService service;

        public AccountController(AccountService service)
        {
            this.service = service;
        }

        [Route("login")]
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Login()
        {
            return Content("Hello Business TOurmant!");
        }

        [Route("login")]
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login(AccountLoginVM vm)
        {
            return RedirectToAction(nameof(Index), "Home");
        }

        [Route("register")]
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [Route("register")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register(AccountRegisterVM vm)
        {
            if (!ModelState.IsValid)
            {
                return View(vm);
            }

            var result = await service.TryCreateCompanyAsync(vm);

            return RedirectToAction(nameof(Index), "Home");
        }
    }
}