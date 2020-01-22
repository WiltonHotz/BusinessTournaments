using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessTournaments.Models;
using BusinessTournaments.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

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
        [Route("AddPlayers")]
        public async Task<IActionResult> AddPlayers([FromBody]List<string> playerNames)
        {
            var userId = accountService.GetUserId();
            (IEnumerable<PlayerVM> addToLeaderboard, bool isOK)  = await service.CreatePlayersAsync(playerNames, userId);
            if(isOK)
            {
                return Ok(addToLeaderboard);
            }
            else
            {
                return BadRequest(addToLeaderboard);
            }
        }

        [Route("CreateTournament")]
        public async Task<IActionResult> StartTournament([FromBody]StartTournament startTournament)
        {
            var userId = accountService.GetUserId();
            string tournamentId;
            int newTournament;

            if (startTournament.TournamentId == "")
            {
                newTournament = await service.CreateTournamentAsync(startTournament, userId);
                tournamentId = newTournament.ToString();
            }
            else
            {
                tournamentId = startTournament.TournamentId;
            }
            
            return Json(tournamentId);
        }
    }
}