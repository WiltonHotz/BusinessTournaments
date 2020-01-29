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
        private readonly HomeService homeService;

        public BracketsController(BracketsService service, AccountService accountService, HomeService homeService)
        {
            this.service = service;
            this.accountService = accountService;
            this.homeService = homeService;
        }

        
        [Route("brackets/{id}")]
        public async Task<IActionResult> Index(int id)
        {
            var userId = accountService.GetUserId();
            var selectedTheme = await homeService.GetSelectedTheme(userId);
            ViewData["selectedTheme"] = selectedTheme;

            var viewModel =  new BracketIdVM { BracketId = id };
            return View(viewModel);
        }

        [Route("brackets/b/{id}")]
        public async Task<IActionResult> GetBracketVM(string id)
        {
            var viewModel = await service.GetBracketVMAsync(id,accountService.GetUserId());

            return Json(viewModel);
        }

        [Route("brackets/updatetournamentbracket")]
        public async Task<IActionResult> UpdateTournament([FromBody]BracketVM ongoingBracket)
        {
            //Get user(company)id
            var userId = accountService.GetUserId();
            
            await service.UpdateTournamentAsync(ongoingBracket, userId);

            return Ok();
        }

        [Route("brackets/finalizetournament")]
        public async Task<IActionResult> FinalizeTournament([FromBody]FinalizeTournamentVM finalizetournament)
        {
            //Get user(company)id
            var userId = accountService.GetUserId();

            await service.FinalizeTournamentAsync(finalizetournament, userId);

            return Ok();
        }

        [Route("getbracketspartialview/{numOfPlayers}")]
        public async Task<IActionResult> GetBracketsPartialView(int numOfPlayers)
        {
            if (numOfPlayers > 8)
                return PartialView("_16playersBrackets");
            else
                return PartialView("_8playersBrackets");
        }
    }
}