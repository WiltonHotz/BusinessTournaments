using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessTournaments.Models;
using Microsoft.AspNetCore.Mvc;

namespace BusinessTournaments.Controllers
{
    public class BracketsController : Controller
    {
        private readonly BracketsService service;

        public BracketsController(BracketsService service)
        {
            this.service = service;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}