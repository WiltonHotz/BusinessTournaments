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


        public BracketsController(BracketsService service, AccountService accountService)
        {
            this.service = service;
            this.accountService = accountService;
        }

        
        [Route("brackets/{id}")]
        public IActionResult Index(string id)
        {
           var viewModel =  new BracketIdVM { BracketId = id };
            return View(viewModel);
        }

        [Route("brackets/b/{id}")]
        public async Task<IActionResult> GetBracketVM(string id)
        {
            var viewModel = await service.GetBracketVMAsync(id,accountService.GetUserId());

            return Json(viewModel);
        }

        [Route("getbracketspartialview/{numOfPlayers}")]
        public async Task<IActionResult> GetBracketsPartialView(int numOfPlayers)
        {
            if (numOfPlayers < 8)
                return PartialView("_16playersBrackets");
            else
                return PartialView("_8playersBrackets");
        }
    }
}