using System.ComponentModel.DataAnnotations;

namespace NET106.Shared.ViewModels;
public class RegisterModel
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; }
    [Required]
    [StringLength(50)]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 5)]
    public string Password { get; set; }

    [Required]
    [StringLength(50, MinimumLength = 5)]
    public string ConfirmPassword { get; set; }
}