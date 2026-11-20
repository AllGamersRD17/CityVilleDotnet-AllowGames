# CityVille Revived - Allow Games: crea la app de Android (CityVilleRevived.apk) en tu PC.
# La primera vez baja Java y las herramientas de Android (~600 MB) dentro de esta carpeta.
# La llave de firma (allowgames.jks) se crea una sola vez: GUARDALA, sin ella no se pueden sacar updates de la app.
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'

$here   = Split-Path -Parent $MyInvocation.MyCommand.Path
$tools  = Join-Path $here 'herramientas'
$jdkDir = Join-Path $tools 'jdk'
$sdk    = Join-Path $tools 'sdk'
$build  = Join-Path $here 'build'
$src    = Join-Path $here 'src'
$log    = Join-Path $here 'crear_app_log.txt'
$versionCode = 32
$versionName = '0.32'
$api = '34'
$bt  = '34.0.0'

function Log($m) { $l = (Get-Date -Format 'HH:mm:ss') + '  ' + $m; Write-Host $l; Add-Content -Path $log -Value $l }
function Bajar($url, $out) {
    for ($i = 1; $i -le 4; $i++) {
        try { Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing; return } catch { Log "  fallo la descarga ($i): $($_.Exception.Message)"; Start-Sleep -Seconds (5 * $i) }
    }
    throw "No se pudo bajar $url"
}
function Run($exe, [string[]]$argv) {
    $old = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    & $exe @argv 2>&1 | ForEach-Object { Add-Content -Path $log -Value ("    " + $_) }
    $code = $LASTEXITCODE
    $ErrorActionPreference = $old
    if ($code -ne 0) { throw "Fallo: $exe $($argv -join ' ')" }
}

Set-Content -Path $log -Value "== Crear app Android $(Get-Date)"
New-Item -ItemType Directory -Force -Path $tools | Out-Null

# 1) Java 17
$java = Get-ChildItem -Path $jdkDir -Recurse -Filter java.exe -ErrorAction SilentlyContinue | Where-Object { $_.DirectoryName -like '*\bin' } | Select-Object -First 1
if (-not $java) {
    Log 'Bajando Java 17 (Microsoft OpenJDK)...'
    $z = Join-Path $tools 'jdk.zip'
    Bajar 'https://aka.ms/download-jdk/microsoft-jdk-17-windows-x64.zip' $z
    Expand-Archive -Path $z -DestinationPath $jdkDir -Force
    Remove-Item $z
    $java = Get-ChildItem -Path $jdkDir -Recurse -Filter java.exe | Where-Object { $_.DirectoryName -like '*\bin' } | Select-Object -First 1
}
$env:JAVA_HOME = Split-Path -Parent $java.DirectoryName
$jbin = $java.DirectoryName
Log "Java: $env:JAVA_HOME"

# 2) Herramientas de Android
$sdkm = Join-Path $sdk 'cmdline-tools\latest\bin\sdkmanager.bat'
if (-not (Test-Path $sdkm)) {
    Log 'Bajando herramientas de Android...'
    $z = Join-Path $tools 'cmdline.zip'
    Bajar 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip' $z
    $tmp = Join-Path $tools 'cmdtmp'
    Expand-Archive -Path $z -DestinationPath $tmp -Force
    New-Item -ItemType Directory -Force -Path (Join-Path $sdk 'cmdline-tools') | Out-Null
    Move-Item -Path (Join-Path $tmp 'cmdline-tools') -Destination (Join-Path $sdk 'cmdline-tools\latest')
    Remove-Item $z; Remove-Item $tmp -Recurse -Force
}
$androidJar = Join-Path $sdk "platforms\android-$api\android.jar"
$btDir = Join-Path $sdk "build-tools\$bt"
if (-not (Test-Path $androidJar) -or -not (Test-Path (Join-Path $btDir 'aapt2.exe'))) {
    Log "Instalando Android $api y build-tools $bt (acepta licencias)..."
    $yes = ("y`n" * 30)
    $ErrorActionPreference = 'Continue'
    $yes | & $sdkm "--sdk_root=$sdk" --licenses 2>&1 | Out-Null
    $yes | & $sdkm "--sdk_root=$sdk" "platforms;android-$api" "build-tools;$bt" 2>&1 | ForEach-Object { Add-Content -Path $log -Value ("    " + $_) }
    $ErrorActionPreference = 'Stop'
}
if (-not (Test-Path $androidJar)) { throw 'No se instalo android.jar' }
$aapt2 = Join-Path $btDir 'aapt2.exe'
$aapt  = Join-Path $btDir 'aapt.exe'
$d8    = Join-Path $btDir 'd8.bat'
$zipal = Join-Path $btDir 'zipalign.exe'
$signer = Join-Path $btDir 'apksigner.bat'

# 3) Llave de firma (una sola vez)
$ks = Join-Path $here 'allowgames.jks'
$ksPassFile = Join-Path $here 'allowgames_clave.txt'
if (-not (Test-Path $ks)) {
    Log 'Creando la llave de firma de Allow Games (allowgames.jks)...'
    $pass = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ })
    Set-Content -Path $ksPassFile -Value $pass -NoNewline
    Run (Join-Path $jbin 'keytool.exe') @('-genkeypair', '-keystore', $ks, '-alias', 'allowgames', '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000',
        '-storepass', $pass, '-keypass', $pass, '-dname', 'CN=Allow Games, OU=AllGamersRD, O=Allow Games, C=DO')
}
$pass = (Get-Content -Path $ksPassFile -Raw).Trim()

# 4) Compilar
if (Test-Path $build) { Remove-Item $build -Recurse -Force }
$gen = Join-Path $build 'gen'; $cls = Join-Path $build 'classes'; $dex = Join-Path $build 'dex'
New-Item -ItemType Directory -Force -Path $gen, $cls, $dex | Out-Null

Log 'Recursos (aapt2)...'
$resZip = Join-Path $build 'res.zip'
Run $aapt2 @('compile', '--dir', (Join-Path $src 'res'), '-o', $resZip)
$base = Join-Path $build 'base.apk'
Run $aapt2 @('link', '-o', $base, '-I', $androidJar, '--manifest', (Join-Path $src 'AndroidManifest.xml'), '--java', $gen,
    '--min-sdk-version', '24', '--target-sdk-version', $api, '--version-code', "$versionCode", '--version-name', $versionName, '--auto-add-overlay', $resZip)

Log 'Codigo (javac)...'
$javaFiles = @(Get-ChildItem -Path (Join-Path $src 'java'), $gen -Recurse -Filter *.java | ForEach-Object { $_.FullName })
Run (Join-Path $jbin 'javac.exe') (@('-encoding', 'UTF-8', '-source', '8', '-target', '8', '-nowarn', '-bootclasspath', $androidJar, '-classpath', $androidJar, '-d', $cls) + $javaFiles)

Log 'Dex (d8)...'
$classFiles = @(Get-ChildItem -Path $cls -Recurse -Filter *.class | ForEach-Object { $_.FullName })
Run $d8 (@('--release', '--min-api', '24', '--lib', $androidJar, '--output', $dex) + $classFiles)

Log 'Empaquetando...'
Push-Location $dex
try { Run $aapt @('add', $base, 'classes.dex') } finally { Pop-Location }
$aligned = Join-Path $build 'aligned.apk'
Run $zipal @('-p', '-f', '4', $base, $aligned)
$apk = Join-Path $build 'CityVilleRevived.apk'
Run $signer @('sign', '--ks', $ks, '--ks-key-alias', 'allowgames', '--ks-pass', "pass:$pass", '--key-pass', "pass:$pass", '--out', $apk, $aligned)
Run $signer @('verify', $apk)

# 5) Dejarla lista para subir al servidor y en la carpeta del juego
$serv = Split-Path -Parent $here
$dest = Join-Path $serv 'assets_nuevos\app'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item $apk (Join-Path $dest 'CityVilleRevived.apk') -Force
Copy-Item $apk (Join-Path (Split-Path -Parent $serv) 'CityVilleRevived.apk') -Force
$kb = [math]::Round((Get-Item $apk).Length / 1KB)
Log "APP_LISTA CityVilleRevived.apk v$versionName ($kb KB)"
