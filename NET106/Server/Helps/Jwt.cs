using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace NET106.Server.Helps;


public class Jwt
{
    private readonly string JWT_PUBLIC_KEY;

    public Jwt(IConfiguration configuration)
    {
        JWT_PUBLIC_KEY = configuration["JWT_PUBLIC_KEY"];
    }

    public string GenerateJwtToken(IdentityUser account)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, account.Id),
            new Claim(ClaimTypes.Name, account.UserName)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var publicKey = Encoding.ASCII.GetBytes(JWT_PUBLIC_KEY);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(publicKey), SecurityAlgorithms.HmacSha256)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}