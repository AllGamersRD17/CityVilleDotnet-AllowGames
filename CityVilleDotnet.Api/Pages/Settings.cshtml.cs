using CityVilleDotnet.Api.Pages.Account;
using CityVilleDotnet.Domain.Entities;
using CityVilleDotnet.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CityVilleDotnet.Api.Pages;

// Allow Games: ajustes del jugador (calidad, sonidos, avisos, muro, bloqueados y cuenta)
[Authorize]
public class SettingsModel(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, CityVilleDbContext db, ILogger<SettingsModel> logger) : PageModel
{
    public string UserName { get; set; } = "";
    public DateTime Joined { get; set; }
    public int Level { get; set; }
    public int FriendCount { get; set; }
    public string? Error { get; set; }
    public bool Deleted { get; set; }
    [BindProperty] public string? ConfirmName { get; set; }

    private async Task<bool> LoadAsync()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return false;
        var p = await db.Set<Player>().AsNoTracking().FirstOrDefaultAsync(x => x.AppUser!.Id == user.Id);
        UserName = p?.Username ?? user.UserName ?? "";
        Joined = user.CreationDate;
        Level = p?.Level ?? 1;
        FriendCount = p is null ? 0 : await db.Set<Friend>().CountAsync(f => f.Player!.Id == p.Id && f.Status == FriendshipStatus.Accepted);
        ViewData["PlayerName"] = UserName;
        ViewData["PlayerLevel"] = Level;
        ViewData["ProfilePictureUrl"] = p?.ProfilePictureUrl ?? "/blank.png";
        return true;
    }

    public async Task<IActionResult> OnGetAsync() => await LoadAsync() ? Page() : Challenge();

    public async Task<IActionResult> OnPostDeleteAsync()
    {
        if (!await LoadAsync()) return Challenge();
        if (!string.Equals((ConfirmName ?? "").Trim(), UserName, StringComparison.OrdinalIgnoreCase)) { Error = AgText.Get("DeleteBadName"); return Page(); }
        var user = await userManager.GetUserAsync(User);
        if (user is null || user.IsAdmin) { Error = AgText.Get("DeleteFail"); return Page(); }
        await using var tx = await db.Database.BeginTransactionAsync();
        try
        {
            var p = await db.Set<Player>().FirstOrDefaultAsync(x => x.AppUser!.Id == user.Id);
            if (p is not null)
            {
                db.Set<Friend>().RemoveRange(await db.Set<Friend>().Where(f => f.Player!.Id == p.Id || f.FriendPlayer!.Id == p.Id).ToListAsync());
                await db.SaveChangesAsync();
                db.Set<Player>().Remove(p);
                await db.SaveChangesAsync();
            }
            var r = await userManager.DeleteAsync(user);
            if (!r.Succeeded) throw new Exception(string.Join("; ", r.Errors.Select(e => e.Description)));
            await tx.CommitAsync();
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            db.ChangeTracker.Clear();
            logger.LogError(ex, "Account delete failed for {User}", UserName);
            Error = AgText.Get("DeleteFail");
            return Page();
        }
        await signInManager.SignOutAsync();
        Deleted = true;
        return Page();
    }
}
