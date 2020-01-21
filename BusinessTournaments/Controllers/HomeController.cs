using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessTournaments.Models;
using Microsoft.AspNetCore.Mvc;

namespace BusinessTournaments.Controllers
{
    public class HomeController : Controller
    {
        private readonly HomeService service;

        public HomeController(HomeService service)
        {
            this.service = service;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}