﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace BusinessTournaments.Controllers
{
    public class BracketsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}