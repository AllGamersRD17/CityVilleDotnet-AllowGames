using System.Security.Cryptography;
using System.Text;

namespace CityVilleDotnet.Api.Features.AllowGames;

// Allow Games: códigos para cambiar la contraseña cuando alguien la olvida (el juego no usa correo).
// Un admin genera el código desde el panel, o el dueño lo crea con el script 8_cambiar_clave.bat.
// Se guarda solo el hash del código, dura poco tiempo y se usa una sola vez.
// Formato de cada línea en reset_codes.txt:  usuario|sha256(codigo)|vence_unix
public static class ResetCodeService
{
    private const string Alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    private const int MaxAttempts = 5;
    private static readonly object Lock = new();
    private static readonly Dictionary<string, int> Attempts = new(StringComparer.OrdinalIgnoreCase);
    private static string _path = "reset_codes.txt";

    public static void Initialize(string contentRoot) => _path = Path.Combine(contentRoot, "reset_codes.txt");

    public static string Create(string userName, TimeSpan ttl)
    {
        var code = RandomNumberGenerator.GetString(Alphabet, 8);
        var expires = DateTimeOffset.UtcNow.Add(ttl).ToUnixTimeSeconds();
        lock (Lock)
        {
            var keep = Read().Where(e => !e.User.Equals(userName, StringComparison.OrdinalIgnoreCase)).ToList();
            keep.Add(new Entry(userName, Hash(code), expires));
            Write(keep);
            Attempts.Remove(userName);
        }
        return code;
    }

    // true si el código es válido para ese usuario; lo borra para que no se pueda reutilizar
    public static bool Consume(string userName, string? code)
    {
        if (string.IsNullOrWhiteSpace(code)) return false;
        var given = Convert.FromHexString(Hash(code));
        lock (Lock)
        {
            var all = Read();
            var entry = all.FirstOrDefault(e => e.User.Equals(userName, StringComparison.OrdinalIgnoreCase));
            if (entry is null) return false;
            var ok = CryptographicOperations.FixedTimeEquals(given, Convert.FromHexString(entry.Hash));
            if (!ok)
            {
                Attempts[userName] = Attempts.GetValueOrDefault(userName) + 1;
                if (Attempts[userName] >= MaxAttempts) { all.Remove(entry); Write(all); Attempts.Remove(userName); }
                return false;
            }
            all.Remove(entry); Write(all); Attempts.Remove(userName);
            return true;
        }
    }

    private sealed record Entry(string User, string Hash, long Expires);

    private static string Hash(string code) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(code.Trim().ToUpperInvariant()))).ToLowerInvariant();

    private static List<Entry> Read()
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        if (!File.Exists(_path)) return [];
        var list = new List<Entry>();
        foreach (var line in File.ReadAllLines(_path))
        {
            var p = line.Trim().Split('|');
            if (p.Length != 3 || p[1].Length != 64 || !long.TryParse(p[2], out var exp) || exp < now) continue;
            list.Add(new Entry(p[0].Trim(), p[1].Trim().ToLowerInvariant(), exp));
        }
        return list;
    }

    private static void Write(List<Entry> entries) =>
        File.WriteAllLines(_path, entries.Select(e => $"{e.User}|{e.Hash}|{e.Expires}"));
}
