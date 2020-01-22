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
    public class BracketsController : Controller
    {
        private readonly BracketsService service;

        public BracketsController(BracketsService service)
        {
            this.service = service;
        }

        
        [Route("brackets/{id}")]
        public IActionResult Index(string id)
        {
            //service.GetBracketVM(id);
            return Content(id);
        }
    }
}