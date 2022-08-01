﻿using System.ComponentModel.DataAnnotations;

namespace NET106.Shared.ViewModels;

public class LoginViewModel
{
    [Required]
    [StringLength(50)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 5)]
    public string Password { get; set; } = string.Empty;
}