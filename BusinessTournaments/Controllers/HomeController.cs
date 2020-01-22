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
    public class HomeController : Controller
    {
        private readonly HomeService service;
        private readonly AccountService accountService;

        public HomeController(HomeService service, AccountService accountService)
        {
            this.service = service;
            this.accountService = accountService;
        }

        [Route("")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("GetIndexVM")]
        public async Task<IActionResult> GetIndexVM()
        {
            IndexVM viewModel = await service.GetIndexVMAsync(accountService.GetUserId());

            return Json(viewModel);
        }
        [Route("AddPlayer")]
        public async Task<IActionResult> AddPlayer([FromBody]string playerName)
        {
            var userId = accountService.GetUserId();
            PlayerVM newPlayer = await service.CreatePlayerAsync(playerName, userId);
            return Json(newPlayer);
        }

        [Route("CreateTournament")]
        public async Task<IActionResult> CreateTournament([FromBody]StartTournament startTournament)
        {
            var userId = accountService.GetUserId();
            TournamentVM newTournament;
            if (startTournament.TournamentId == "")
            {
            newTournament = await service.CreateTournamentAsync(startTournament, userId); 
            }
            else
            {
             newTournament = await service.ResumeTournamentAsync(startTournament, userId);
            }

            return RedirectToAction(nameof(Index), "Brackets");
        }
    }
}