using BusinessTournaments.Models.Entities;
using BusinessTournaments.Models.ViewModels;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models
{
    public class BracketsService
    {
        public BracketsService(BusinessTournamentsDBContext context)
        {
            this.context = context;
        }
        Random random;
        private readonly BusinessTournamentsDBContext context;

        internal async Task<List<Bracket>> CreateBrackets(List<string> playerIds)
        {
            List<Bracket> brackets = new List<Bracket>();
            int numOfBrackets = GetNumberOfBrackets(playerIds.Count);

            random = new Random();
            var randomizedIndex = Enumerable.Range(0, playerIds.Count()).ToArray();

            // Shuffle the array
            for (int i = 0; i < randomizedIndex.Length; ++i)
            {
                int randomIndex = random.Next(randomizedIndex.Length);
                int temp = randomizedIndex[randomIndex];
                randomizedIndex[randomIndex] = randomizedIndex[i];
                randomizedIndex[i] = temp;
            }

            for (int i = 0; i < numOfBrackets; i++)
            {
                brackets.Add(new Bracket
                {
                    BracketId = i,
                });
            }

            // Now your players are randomized and you populate brackets
            var output = await PopulateBracketsWithPlayers(numOfBrackets, playerIds, randomizedIndex, brackets);

            return output;
        }

        private async Task<List<Bracket>> PopulateBracketsWithPlayers(int numOfBrackets, List<string> playerIds, int[] randomizedIndex, List<Bracket> brackets)
        {

            int startPopulateIndex = 6;

            if (numOfBrackets == 15) //id 0-14. 0 is winner. 5 players should populate 8,7 -  6,5,4,(3) - 2,1, 0
                startPopulateIndex = 14 - (8 - playerIds.Count) * 2; // 6 players should populate 10,9,8,7 - 6,5(4),(3), 2,1 - 0
            else if (numOfBrackets == 31)
                startPopulateIndex = 30 - (16 - playerIds.Count) * 2;

            var players = await context.Players.Where(p => playerIds.Contains(p.Id.ToString())).ToListAsync();

            int j = 0;
            for (int i = startPopulateIndex; i >= playerIds.Count - 1; i--)
            {
                var randomId = int.Parse(playerIds[randomizedIndex[j]]);

                brackets[i].PlayerId = randomId;
                brackets[i].PlayerName = players.Where(p => p.Id == randomId).Select(p => p.Name).SingleOrDefault();
                j++;
            }

            return brackets;
        }

        internal async Task<BracketVM> GetBracketVMAsync(string tournamentId, string userId)
        {
            var tournament = await context.Tournaments.Where(c => c.CompanyId == userId).SingleOrDefaultAsync(x => x.Id == int.Parse(tournamentId));
            var bracketstring = tournament.BracketsJsonString;
            List<Bracket> bracketArray = JsonConvert.DeserializeObject<List<Bracket>>(bracketstring);
            BracketVM viewModel = new BracketVM { Brackets = bracketArray, TournamentId = tournament.Id, TournamentName = tournament.TournamentName };
            return viewModel;
        }

        internal async Task<bool> UpdateTournamentAsync(BracketVM tournamentToUpdate, string userId)
        {
            var currentBracket = JsonConvert.SerializeObject(tournamentToUpdate.Brackets);

            //Update Tournament inDB with current bracket.
            var tournament = await context.Tournaments.Where(x => x.CompanyId == userId).SingleOrDefaultAsync(t => t.Id == tournamentToUpdate.TournamentId);

            if (tournament != null)
            {
                tournament.BracketsJsonString = currentBracket;
                await context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        private int GetNumberOfBrackets(int numOfPlayers)
        {
            if (numOfPlayers == 4)
                return 7;
            else if (numOfPlayers > 4 && numOfPlayers <= 8)
                return 15;
            else if (numOfPlayers > 8 && numOfPlayers <= 16)
                return 31;

            return 0;
        }
    }
}
