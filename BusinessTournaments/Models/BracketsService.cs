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

        internal List<Bracket> PopulateBracketsRandomly(List<string> playerIds)
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
            int startPopulateIndex = 0;

            if (numOfBrackets == 15)
                startPopulateIndex = (8 - playerIds.Count) * 2;

            int j = 0;
            for (int i = startPopulateIndex; i < playerIds.Count + startPopulateIndex; i++)
            {
                brackets[i].PlayerId = int.Parse(playerIds[randomizedIndex[j]]);
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

        private int GetNumberOfBrackets(int numOfPlayers)
        {
            if (numOfPlayers == 4)
                return 7;
            else if (numOfPlayers > 4 && numOfPlayers <= 8)
                return 15;

            return 0;
        }
    }
}
