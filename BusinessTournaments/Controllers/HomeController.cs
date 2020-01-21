using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessTournaments.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessTournaments.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly HomeService service;

        public HomeController(HomeService service)
        {
            this.service = service;
        }

        [Route("")]
        public IActionResult Index()
        {
            return View();
        }
    }
}