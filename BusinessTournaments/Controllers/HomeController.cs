using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessTournaments.Models;
using BusinessTournaments.Models.Entities;
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
        public async Task<IActionResult> Index()
        {
            var userId = accountService.GetUserId();
            var selectedTheme = await service.GetSelectedTheme(userId);
            ViewData["selectedTheme"] = selectedTheme;
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
            if(startTournament.PlayerIds.Count() > 16)
            {
                return BadRequest();
            }
            else
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

        

        [Route("deleteTournament/{tournamentId}")]
        public async Task<IActionResult> DeleteTournament(int tournamentId)
        {
            var userId = accountService.GetUserId();
            if(await service.DeleteTournamentById(tournamentId, userId))
            {
                return Ok(tournamentId);
            }
            else
            {
                return BadRequest();
            }
        }

        [Route("editPlayer/{playerId}/{newName}")]
        public async Task<IActionResult> EditPlayer(int playerId, string newName)
        {
            var userId = accountService.GetUserId();
            if (await service.EditPlayerById(playerId, newName, userId))
            {
                return Ok(newName);
            }
            else
            {
                return BadRequest();
            }
        }
        [Route("deletePlayer/{playerId}")]
        public async Task<IActionResult> DeletePlayer(int playerId)
        {
            var userId = accountService.GetUserId();
            if (await service.DeletePlayerById(playerId, userId))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [Route("GetOngoingTournament/{id}")]
        public async Task<IActionResult> GetOngoingTournament(string id)
        {
            var userId = accountService.GetUserId();
            var result = await service.GetOngoingTournament(id, userId);

            return Json(result);
        }

        [Route("GetThemes")]
        public async Task<IActionResult> GetThemes()
        {
            var userId = accountService.GetUserId();
            var (themes, isOK) = await service.GetThemes(userId);
            if (isOK)
            {
                return Ok(themes);
            }
            else
            {
                return BadRequest();
            }
        }
        [Route("SetTheme")]
        public async Task<IActionResult> SetTheme([FromBody]string theme)
        {
            var userId = accountService.GetUserId();
            var isOK = await service.SetTheme(userId, theme);
            if (isOK)
            {
                return Ok(theme);
            }
            else
            {
                return BadRequest();
            }
        }
    }
}