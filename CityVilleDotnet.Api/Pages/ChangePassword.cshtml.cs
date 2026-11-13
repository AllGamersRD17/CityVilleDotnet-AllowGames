using CityVilleDotnet.Api.Pages.Account;
using CityVilleDotnet.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CityVilleDotnet.Api.Pages;

// Allow Games: el jugador cambia su contraseña sabiendo la actual.
[Authorize]
public class ChangePasswordModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) : PageModel
{
    [BindProperty] public string? Current { get; set; }
    [BindProperty] public string? Password { get; set; }
    [BindProperty] public string? Confirm { get; set; }
    public string? Error { get; set; }
    public bool Done { get; set; }

    public void OnGet() { }

    public async Task<IActionResult> OnPostAsync()
    {
        if (string.IsNullOrEmpty(Password) || Password.Length < 6) { Error = AgText.Get("Short"); return Page(); }
        if (Password != Confirm) { Error = AgText.Get("Mismatch"); return Page(); }
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Challenge();
        var result = await userManager.ChangePasswordAsync(user, Current ?? "", Password);
        if (!result.Succeeded) { Error = AgText.Get("WrongCurrent"); return Page(); }
        await signInManager.RefreshSignInAsync(user);
        Done = true;
        return Page();
    }
}
