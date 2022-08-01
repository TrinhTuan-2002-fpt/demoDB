using Microsoft.AspNetCore.Identity;

namespace NET106.Shared.Models;

public class Account : IdentityUser
{
    public Students? Student { get; set; }
    public int StudentId { get; set; }
}