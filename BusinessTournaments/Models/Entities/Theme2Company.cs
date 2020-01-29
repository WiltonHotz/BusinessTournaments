using System;
using System.Collections.Generic;

namespace BusinessTournaments.Models.Entities
{
    public partial class Theme2Company
    {
        public int Id { get; set; }
        public int ThemeId { get; set; }
        public string CompanyId { get; set; }

        public virtual AspNetUsers Company { get; set; }
        public virtual Themes Theme { get; set; }
    }
}
