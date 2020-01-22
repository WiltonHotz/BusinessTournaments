using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models
{
    public class BracketsService
    {
        Random random;

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
            for (int i = startPopulateIndex; i < playerIds.Count; i++)
            {

                brackets[i].PlayerId = int.Parse(playerIds[randomizedIndex[j]]);
                j++;
            }

            return brackets;
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
