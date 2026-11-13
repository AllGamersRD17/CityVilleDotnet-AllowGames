using CityVilleDotnet.Api.Features.AllowGames;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CityVilleDotnet.Api.Pages.Admin;

// Allow Games: panel para cambiar la temporada de todas las ciudades
public class TemporadasModel : PageModel
{
    [BindProperty] public bool Auto { get; set; }
    [BindProperty] public List<string> Selected { get; set; } = [];
    [BindProperty] public string? Banner { get; set; }
    public string? Message { get; set; }

    public void OnGet()
    {
        var c = SeasonService.Config;
        Auto = c.Auto;
        Selected = c.Collections;
        Banner = c.Banner;
    }

    public IActionResult OnPost()
    {
        SeasonService.Save(Auto, Selected, Banner);
        TempData["agMsg"] = "ok";
        return RedirectToPage();
    }

    public IActionResult OnPostPreset(string preset)
    {
        if (SeasonService.Presets.TryGetValue(preset, out var cols))
            SeasonService.Save(false, cols, SeasonService.Config.Banner);
        TempData["agMsg"] = "ok";
        return RedirectToPage();
    }
}
