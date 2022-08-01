using Microsoft.AspNetCore.Identity;
using NET106.Server.Helps;
using NET106.Shared.Models;
using NET106.Shared.Respone;
using NET106.Shared.ViewModels;

namespace NET106.Server.Service;

    public interface IUserService
    {
        Task<UserManagerRespone> RegisterUser(RegisterModel model);
        Task<UserManagerRespone> Loginuser(LoginViewModel model);
    }

    public class UserService : IUserService
    {
        private readonly UserManager<Account> _userManager;
        private readonly Jwt _jwt;
        public UserService(UserManager<Account> userManager,Jwt jwt)
        {
            _userManager = userManager;
            _jwt = jwt;
        }
        public async Task<UserManagerRespone> RegisterUser(RegisterModel model)
        {
            if (model == null) throw new NullReferenceException("Chưa đủ thong tin đăng ký ");
            if (model.ConfirmPassword != model.Password)
                return new UserManagerRespone
                {
                    Message = "sai mật khẩu confirm Password",
                    IsSuccess = false
                };

            var identityUser = new Account()
            {
                Email = model.Email,
                UserName = model.Name,
            };
            var result = await _userManager.CreateAsync(identityUser, model.Password);
            if (result.Succeeded)
            {
                return new UserManagerRespone
                {
                    IsSuccess = true,
                    Message = "Người dùng đã được dăng ký"
                };
            }

            return new UserManagerRespone
            {
                IsSuccess = false,
                Message = "Người dùng chưa được dăng ký",
                Error = result.Errors.Select(c => c.Description)
            };
        }

        public async Task<UserManagerRespone> Loginuser(LoginViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return new UserManagerRespone
                {
                    Message = "Người dùng chưa được đăng ký",
                    IsSuccess = false
                };
            var result = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!result)
            {
                return new UserManagerRespone
                {
                    Message = "Pass sai",
                    IsSuccess = false
                };
            }

            var token = _jwt.GenerateJwtToken(user);
            return new UserManagerRespone
            {
                Message = token,
                IsSuccess = true
            };
        }
    }

