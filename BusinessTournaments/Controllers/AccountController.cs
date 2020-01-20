using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessTournaments.Models;
using Microsoft.AspNetCore.Mvc;

namespace BusinessTournaments.Controllers
{

    public class AccountController : Controller
    {
        private readonly AccountService service;

        public AccountController(AccountService service)
        {
            this.service = service;
        }

        [Route("")]
        public IActionResult Index()
        {
            return Content("Hello Business TOurmant!");
        }
    }
}