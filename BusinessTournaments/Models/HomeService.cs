using BusinessTournaments.Models.Entities;
using BusinessTournaments.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace BusinessTournaments.Models
{
    public class HomeService
    {
        private readonly BusinessTournamentsDBContext context;
        private readonly BracketsService bracketsService;

        public HomeService(BusinessTournamentsDBContext context, BracketsService bracketsService)
        {
            this.context = context;
            this.bracketsService = bracketsService;
        }
        internal async Task<IndexVM> GetIndexVMAsync(string userId)
        {
            var players = await context.Players
                .Where(c => c.CompanyId == userId)
                .Select(p => new PlayerVM
                {
                    PlayerId = p.Id,
                    PlayerName = p.Name,
                    Score = p.Score
                }).ToListAsync();

            var tournaments = await context.Tournaments
                .Where(c => c.CompanyId == userId)
                .Select(t => new TournamentVM
                {
                    TournamentId = t.Id,
                    TournamentName = t.TournamentName,
                    Date = t.Created,
                    IsCompleted = t.IsCompleted
                }).ToListAsync();

            return new IndexVM
            {
                Leaderboard = players,
                OngoingTournaments = tournaments.Where(t => t.IsCompleted == false),
                CompletedTournaments = tournaments.Where(t => t.IsCompleted == true)
            };
        }

        internal async Task<PlayerVM> CreatePlayerAsync(string playerName, string userId)
        {
            var newPlayer = await context.Players.AddAsync(new Players
            {
                Name = playerName,
                CompanyId = userId,
                Score = 0
            });
            await context.SaveChangesAsync();
            return new PlayerVM
            {
                PlayerName = newPlayer.Entity.Name,
                PlayerId = newPlayer.Entity.Id,
                Score = newPlayer.Entity.Score
            };
        }

        internal async Task<int> CreateTournamentAsync(StartTournament startTournament, string userId)
        {
            var jsonString = JsonConvert.SerializeObject(bracketsService.PopulateBracketsRandomly(startTournament.PlayerIds));

            //Add new tournament to database
            var newTournament = await context.Tournaments.AddAsync(new Tournaments
            {
                TournamentName = startTournament.TournamentName,
                CompanyId = userId,
                BracketsJsonString = jsonString,
                Created = DateTime.Now,
            });
            await context.SaveChangesAsync();

            // Add players to T2P table
            for (int i = 0; i < startTournament.PlayerIds.Count; i++)
            {
                await context.T2p.AddAsync(new T2p
                {
                    PlayerId = int.Parse(startTournament.PlayerIds[i]),
                    TournamentId = newTournament.Entity.Id,
                });
            };

            await context.SaveChangesAsync();

            return newTournament.Entity.Id;
        }
    }
}
