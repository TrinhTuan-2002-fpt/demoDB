using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NET106.Server.Service;
using NET106.Shared.ViewModels;

namespace NET106.Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private IUserService _userService;

    public AuthController(IUserService service)
    {
        _userService = service;
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterModel model)
    {
        if (ModelState.IsValid)
        {
            var result = await _userService.RegisterUser(model);

            if (result.IsSuccess) return Ok(result);

            return BadRequest(result);
        }

        return BadRequest("Không hợp lệ");//400
    }
    [HttpPost]
    [Route("/login")]
    public async Task<IActionResult> RegisterUser([FromBody] LoginViewModel model)
    {
        if (ModelState.IsValid)
        {
            var result = await _userService.Loginuser(model);
            Response.Cookies.Append("access_token",result.Message);
            if (result.IsSuccess) return Ok(result);

            return BadRequest(result);
        }

        return BadRequest("Đăng nhập thất bại");//400
    }

    [Authorize]
    [Route("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token");

        return NoContent();
    }
}