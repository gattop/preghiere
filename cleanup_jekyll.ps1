# Script di pulizia post-migrazione
# Rimuove <p> orfani, corregge indentazione e encoding nei file già convertiti

$basePath = "C:\Users\Tommaso\Documents\GitHub\preghiere"

# Tutti i file HTML da ripulire (già convertiti)
$files = Get-ChildItem -Path $basePath -Include "*.html" -Recurse |
    Where-Object { $_.FullName -notlike "*rosario*" } |
    Where-Object { $_.FullName -notlike "*_site*" }

$cleaned = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

    # Salta file senza front matter Jekyll (es. rosario)
    if (-not $content.StartsWith("---")) { continue }

    $original = $content

    # --- FIX 1: encoding garbled nel front matter ---
    # Il problema è nei bytes UTF-8 di caratteri italiani letti come CP1252
    # .NET regex \uXXXX funziona nel PATTERN; usiamo [char] nel REPLACEMENT
    $content = $content -replace '\u00c3\u00b9', ([char]0x00F9)   # ù
    $content = $content -replace '\u00c3\u00ba', ([char]0x00FA)   # ú
    $content = $content -replace '\u00c3\u00a0', ([char]0x00E0)   # à
    $content = $content -replace '\u00c3\u00a8', ([char]0x00E8)   # è
    $content = $content -replace '\u00c3\u00a9', ([char]0x00E9)   # é
    $content = $content -replace '\u00c3\u00ac', ([char]0x00EC)   # ì
    $content = $content -replace '\u00c3\u00b2', ([char]0x00F2)   # ò
    $content = $content -replace '\u00c3\u00be', ([char]0x00FE)   # þ (edge case)

    # --- FIX 2: Separa il front matter dal body per processare solo il corpo ---
    # Front matter è delimitato dai primi due ---
    if ($content -match '(?s)^(---\n.*?\n---\n)(.*)$') {
        $frontMatter = $matches[1]
        $body = $matches[2]
    } else {
        continue
    }

    # --- FIX 3: Rimuovi tag <p> e </p> rimasti nel corpo ---
    $body = $body -replace '</?p[^>]*>', ''

    # --- FIX 4: Rimuovi tag <div> rimasti ---
    $body = $body -replace '</?div[^>]*>', ''

    # --- FIX 5: Trim indentazione eccessiva (max 2 spazi per linea) ---
    $lines = $body -split "`n"
    $cleanLines = $lines | ForEach-Object {
        # Rimuovi fino a 12 spazi di indentazione iniziale
        $_ -replace '^( {1,12})', ''
    }
    $body = $cleanLines -join "`n"

    # --- FIX 6: Normalizza righe vuote (max 2 consecutive) ---
    $body = $body -replace "(`n){3,}", "`n`n"
    $body = $body.Trim()

    $content = $frontMatter + "`n" + $body + "`n"

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Pulito: $($file.FullName -replace [regex]::Escape($basePath), '')"
        $cleaned++
    }
}

Write-Host ""
Write-Host "Pulizia completata: $cleaned file modificati."
