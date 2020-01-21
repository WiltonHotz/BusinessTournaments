using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessTournaments.Models.ViewModels
{
    public class AccountLoginVM
    {
        [Required(ErrorMessage = "Enter your username")]
        [Display(Name = "Company")]
        public string CompanyName { get; set; }


        [Required(ErrorMessage = "Enter your password")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
