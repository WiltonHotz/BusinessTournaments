using System;
using System.Collections.Generic;

namespace BusinessTournaments.Models.Entities
{
    public partial class Themes
    {
        public Themes()
        {
            Theme2Company = new HashSet<Theme2Company>();
        }

        public int Id { get; set; }
        public string ThemeName { get; set; }

        public virtual ICollection<Theme2Company> Theme2Company { get; set; }
    }
}
