using CityVilleDotnet.Api.Features.AllowGames;
using CityVilleDotnet.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CityVilleDotnet.Api.Pages.Account;

// Allow Games: cambiar la contraseña con un código de un admin (para quien la olvidó).
public class ResetModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) : PageModel
{
    [BindProperty(SupportsGet = true, Name = "u")] public string? UserName { get; set; }
    [BindProperty(SupportsGet = true, Name = "code")] public string? Code { get; set; }
    [BindProperty] public string? Password { get; set; }
    [BindProperty] public string? Confirm { get; set; }
    public string? Error { get; set; }

    public void OnGet() { }

    public async Task<IActionResult> OnPostAsync()
    {
        if (string.IsNullOrWhiteSpace(UserName) || string.IsNullOrWhiteSpace(Code)) { Error = AgText.Get("BadCode"); return Page(); }
        if (string.IsNullOrEmpty(Password) || Password.Length < 6) { Error = AgText.Get("Short"); return Page(); }
        if (Password != Confirm) { Error = AgText.Get("Mismatch"); return Page(); }

        var user = await userManager.FindByNameAsync(UserName.Trim());
        if (user is null || !ResetCodeService.Consume(user.UserName!, Code)) { Error = AgText.Get("BadCode"); return Page(); }

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, token, Password);
        if (!result.Succeeded) { Error = string.Join(" ", result.Errors.Select(e => e.Description)); return Page(); }

        await signInManager.SignInAsync(user, isPersistent: true);
        TempData["AgPassChanged"] = "1";
        return LocalRedirect("/Game");
    }
}
