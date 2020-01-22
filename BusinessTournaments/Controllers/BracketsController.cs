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
    public class BracketsController : Controller
    {
        private readonly BracketsService service;
        private readonly AccountService accountService;


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

        [Route("GetBracketVM/{id}")]
        public async Task<IActionResult> GetBracketVM()
        {
            BracketVM viewModel = await service.GetBracketVMAsync(accountService.GetUserId());

            return Json(viewModel);
        }
    }
}