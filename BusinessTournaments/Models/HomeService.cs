using BusinessTournaments.Models.Entities;
using BusinessTournaments.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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
        //private static List<Tournaments> tournamentslist = new List<Tournaments>();

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
                })
                .OrderByDescending(p => p.Score)
                .ToListAsync();

            var ongoingTournaments = await context.Tournaments
                .Where(c => c.CompanyId == userId && !c.IsCompleted)
                .Select(t => new TournamentVM
                {
                    TournamentId = t.Id,
                    TournamentName = t.TournamentName,
                    Date = t.Created,
                    IsCompleted = t.IsCompleted
                }).OrderByDescending(x => x.Date).ToListAsync();

            var completedTournaments = await context.Tournaments
                .Where(c => c.CompanyId == userId && c.IsCompleted)
                .Select(t => new TournamentVM
                {
                    TournamentId = t.Id,
                    TournamentName = t.TournamentName,
                    Date = t.LastModified,
                    IsCompleted = t.IsCompleted
                }).OrderByDescending(x => x.Date).Take(15).ToListAsync();

            return new IndexVM
            {
                Leaderboard = players,
                OngoingTournaments = ongoingTournaments,
                CompletedTournaments = completedTournaments,
            };
        }

        internal async Task<string> GetSelectedTheme(string userId) => 
            await context.AspNetUsers
                .Where(c => c.Id == userId)
                .Select(s => s.SelectedTheme)
                .SingleOrDefaultAsync();


        internal async Task<(List<PlayerVM>, bool)> CreatePlayersAsync(List<string> playerNames, string userId)
        {
            var allPlayerNames = await context.Players
                .Where(p => p.CompanyId == userId)
                .Select(p => p.Name)
                .ToListAsync();

            var badPlayerNames = allPlayerNames.Intersect(playerNames).ToArray();
            var badPlayers = new List<PlayerVM>();
            if (badPlayerNames.Length > 0)
            {
                foreach (var name in badPlayerNames)
                {
                    badPlayers.Add(
                        new PlayerVM
                        {
                            PlayerName = name
                        });
                }
                return (badPlayers, false);
            }

            var newPlayers = new List<EntityEntry<Players>>();
            foreach (var playerName in playerNames)
            {
                if (playerName != "")
                {
                    var newPlayer = await context.Players.AddAsync(new Players
                    {
                        Name = playerName,
                        CompanyId = userId,
                        Score = 0
                    });
                    newPlayers.Add(newPlayer);
                }
            }

            await context.SaveChangesAsync();

            var newToLeaderboard = newPlayers.Select(p => new PlayerVM
            {
                PlayerName = p.Entity.Name,
                PlayerId = p.Entity.Id,
                Score = p.Entity.Score
            }).ToList();

            return (newToLeaderboard, true);
        }

        internal async Task<bool> DeletePlayerById(int playerId, string userId)
        {
            var players = await context.Players
            .Where(p => p.CompanyId == userId)
            .ToListAsync();

            var player = players.Where(p => p.Id == playerId).SingleOrDefault();

            if (player != null)
            {
                var t2p = await context.T2p
                    .Where(p => p.PlayerId == playerId)
                    .ToListAsync();

                if (t2p.Count() != 0)
                {
                    foreach (var p in t2p)
                    {
                        context.T2p.Remove(p);
                    }

                    await context.SaveChangesAsync();
                }

                context.Players.Remove(player);
                await context.SaveChangesAsync();
                return true;
            }
            else { return false; }
        }

        internal async Task<bool> SetTheme(string userId, string theme)
        {
            var user = await context.AspNetUsers
                .Where(u => u.Id == userId)
                .SingleOrDefaultAsync();
            if (user != null)
            {
                user.SelectedTheme = theme;
                await context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        internal async Task<(List<string>, bool)> GetThemes(string userId)
        {
            var themes = await context.Theme2Company
                .Where(t => t.CompanyId == userId)
                .Select(t => t.Theme.ThemeName)
                .ToListAsync();

            if(themes.Count() != 0)
            {
                return (themes, true);
            }
            else
            {
                return (themes, false);
            }
        }

        internal async Task<bool> EditPlayerById(int playerId, string newName, string userId)
        {
            var player = await context.Players
                .Where(p => p.Id == playerId && p.CompanyId == userId)
                .SingleOrDefaultAsync();
            if (player != null)
            {
                player.Name = newName;
                await context.SaveChangesAsync();
                return true;
            }
            else { return false; }
        }

        internal async Task<List<PlayerVM>> GetOngoingTournament(string tournamentId, string userId)
        {
            var playerIds = await context.T2p.Where(t => t.TournamentId == int.Parse(tournamentId)).Select(t => t.PlayerId).ToArrayAsync();

            //var players = await context.Players
            //    .Join(playerIds, p => p.Id, i => i, (p, i) => new PlayerVM { PlayerId = i, PlayerName = p.Name }).ToListAsync();

            //var players = await context.Players
            //    .Join(playerIds, p => p.Id, i => i, (p, i) => new PlayerVM { PlayerId = i, PlayerName = p.Name }).ToListAsync();

            var players = new List<PlayerVM>();

            for (int i = 0; i < playerIds.Length; i++)
            {
                players.Add(new PlayerVM
                {
                    PlayerId = playerIds[i],
                    PlayerName = await context.Players.Where(p => p.Id == playerIds[i]).Select(p => p.Name).SingleAsync(),
                });
            }
            return players;
        }

        internal async Task<int> CreateTournamentAsync(StartTournament startTournament, string userId)
        {
            var jsonString = JsonConvert.SerializeObject(await bracketsService.CreateBrackets(startTournament.PlayerIds), Formatting.None);

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

        

        internal async Task<bool> DeleteTournamentById(int id, string userId)
        {
            var tournament = await context.Tournaments
                .Where(c => c.CompanyId == userId && c.Id == id).SingleOrDefaultAsync();

            var t2p = await context.T2p
                .Where(t => t.TournamentId == id)
                .ToListAsync();

            if (t2p.Count() != 0)
            {
                foreach (var t in t2p)
                {
                    context.T2p.Remove(t);
                }

                await context.SaveChangesAsync();
            }
            else
            {
                return false;
            }

            if (tournament != null)
            {
                context.Tournaments.Remove(tournament);
                await context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
