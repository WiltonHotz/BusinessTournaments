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
            return View();
        }

        [Route("login")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login(AccountLoginVM vm)
        {
            if (!ModelState.IsValid)
            {
                return View(vm);
            }

            var result = await service.TryLoginCompanyAsync(vm);
            if (!result.Succeeded)
            {
                ModelState.AddModelError("", "Invalid input");
                return View();
            } 
            else
            {
                return RedirectToAction(nameof(Index), "Home");
            }  

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

            if (!result.Succeeded)
            {
                ModelState.AddModelError("", "Invalid input");
                return View();
            }

            return RedirectToAction(nameof(Login));
        }
    }
}