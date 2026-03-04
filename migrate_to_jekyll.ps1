# Funzione per rimuovere attributi HTML comuni
function Remove-HtmlTags {
    param([string]$html)

    # Rimuove back-navigation links (prima e dopo il contenuto)
    $html = $html -replace '(?s)<p>\s*<a href="[^"]*">&#8592[^<]*</a>\s*</p>', ''
    $html = $html -replace '(?s)<p>\s*<a href="[^"]*">&#8592</a>\s*</p>', ''

    # h1 -> # Heading
    $html = $html -replace '(?s)<h1[^>]*>\s*(.*?)\s*</h1>', "`n# `$1`n"
    # h2 -> ## Heading
    $html = $html -replace '(?s)<h2[^>]*>\s*(.*?)\s*</h2>', "`n## `$1`n"
    # h3 -> ### Heading
    $html = $html -replace '(?s)<h3[^>]*>\s*(.*?)\s*</h3>', "`n### `$1`n"
    # h4 -> #### Heading
    $html = $html -replace '(?s)<h4[^>]*>\s*(.*?)\s*</h4>', "`n#### `$1`n"

    # Italic (match sia <i> che </i>)
    $html = $html -replace '(?s)<i>\s*(.*?)\s*</i>', '*$1*'

    # Bold
    $html = $html -replace '(?s)<b>\s*(.*?)\s*</b>', '**$1**'

    # <br> -> due spazi + newline (markdown hard break)
    $html = $html -replace '<br\s*/?>', "  `n"

    # <hr> -> ---
    $html = $html -replace '<hr\s*/?>', "`n---`n"

    # Paragrafi con classe descrizione -> span kramdown
    $html = $html -replace '(?s)<p class="descrizione">\s*(.*?)\s*</p>', "`n{: .descrizione}`n`$1`n"

    # Paragrafi generici: estrai contenuto (gestisci anche paragrafi annidati)
    # Prima passa: rimuovi <p> annidati (non standard) mantenendo il contenuto
    $html = $html -replace '(?s)<p[^>]*>\s*(.*?)\s*</p>', "`n`$1`n"
    # Seconda passa per eventuali <p> rimasti
    $html = $html -replace '(?s)<p[^>]*>\s*(.*?)\s*</p>', "`n`$1`n"

    # Rimuovi tag HTML rimanenti (eccetto sup con classe n_versetto che serve per i versetti)
    # Mantieni <sup class="n_versetto"> e </sup>
    $html = $html -replace '<(?!/?sup|/?table|/?tr|/?td|/?br)[^>]+>', ''

    # Normalizza spazi bianchi: rimuovi indentazione eccesiva da ogni riga
    $lines = $html -split "`n"
    $cleanLines = $lines | ForEach-Object { $_.TrimEnd() } | ForEach-Object {
        # Rimuovi solo l'indentazione (massimo 8 spazi) all'inizio
        $_ -replace '^ {1,8}', ''
    }
    $html = $cleanLines -join "`n"

    # Rimuovi righe vuote eccessive (max 2 consecutive)
    $html = $html -replace "`n{3,}", "`n`n"
    $html = $html.Trim()

    return $html
}

# Mapping: file -> (layout, title, parent_url, sottotitolo)
# Format: "percorso_relativo" = @{layout=; title=; parent_url=; sottotitolo=}
$simplePages = @{

    # Preghiere semplici (layout: preghiera)
    "preghiere\preghieradelmattino\index.html" = @{
        layout = "preghiera"; title = "Preghiera del mattino"; parent_url = "/"
    }
    "preghiere\preghieradellasera\index.html" = @{
        layout = "preghiera"; title = "Preghiera della sera"; parent_url = "/"
    }
    "preghiere\spiritosanto\index.html" = @{
        layout = "preghiera"; title = "Spirito Santo"; parent_url = "/"
    }
    "preghiere\sanmichelearcangelo\index.html" = @{
        layout = "preghiera"; title = "San Michele Arcangelo"; parent_url = "/"
    }
    "preghiere\sanfrancescodassisi\index.html" = @{
        layout = "preghiera"; title = "San Francesco d'Assisi"; parent_url = "/"
    }
    "preghiere\santissimicosmaedamiano\index.html" = @{
        layout = "preghiera"; title = "SS. Cosma e Damiano"; parent_url = "/"
    }
    "preghiere\beataeustochiobellini\index.html" = @{
        layout = "preghiera"; title = "Beata Eustochio Bellini"; parent_url = "/"
    }
    "preghiere\santommasoapostolo\index.html" = @{
        layout = "preghiera"; title = "San Tommaso Apostolo"; parent_url = "/"
    }
    "preghiere\sacrocuore\consacrazione_al_sacro_cuore.html" = @{
        layout = "preghiera"; title = "Consacrazione al Sacro Cuore di Gesù"; parent_url = "/preghiere/sacrocuore/"
    }
    "preghiere\sacrocuore\coroncina_al_sacro_cuore.html" = @{
        layout = "preghiera"; title = "Coroncina al Sacro Cuore di Gesù"; parent_url = "/preghiere/sacrocuore/"
    }
    "preghiere\sangiudataddeo\preghiera_a_san_giuda.html" = @{
        layout = "preghiera"; title = "Preghiera a San Giuda Taddeo"; parent_url = "/preghiere/sangiudataddeo/"
    }
    "preghiere\sangiudataddeo\preghiera_casi_difficili.html" = @{
        layout = "preghiera"; title = "Preghiera per i casi difficili"; parent_url = "/preghiere/sangiudataddeo/"
    }
    "preghiere\santemidio\preghiera_a_sant_emidio.html" = @{
        layout = "preghiera"; title = "Preghiera a Sant'Emidio"; parent_url = "/preghiere/santemidio/"
    }
    "preghiere\santemidio\triduo_a_sant_emidio\giorno_uno.html" = @{
        layout = "preghiera"; title = "Triduo a Sant'Emidio - Giorno 1"; parent_url = "/preghiere/santemidio/triduo_a_sant_emidio/"
    }
    "preghiere\santemidio\triduo_a_sant_emidio\giorno_due.html" = @{
        layout = "preghiera"; title = "Triduo a Sant'Emidio - Giorno 2"; parent_url = "/preghiere/santemidio/triduo_a_sant_emidio/"
    }
    "preghiere\santemidio\triduo_a_sant_emidio\giorno_tre.html" = @{
        layout = "preghiera"; title = "Triduo a Sant'Emidio - Giorno 3"; parent_url = "/preghiere/santemidio/triduo_a_sant_emidio/"
    }
    "preghiere\santemidio\triduo_a_sant_emidio\litanie.html" = @{
        layout = "preghiera"; title = "Litanie a S. Emidio"; parent_url = "/preghiere/santemidio/triduo_a_sant_emidio/"
    }
    "preghiere\credo\credo_apostolico.html" = @{
        layout = "preghiera"; title = "Credo Apostolico"; parent_url = "/preghiere/credo/"
    }
    "preghiere\credo\credo_niceocostantinopolitano.html" = @{
        layout = "preghiera"; title = "Credo Niceo-Costantinopolitano"; parent_url = "/preghiere/credo/"
    }
    "preghiere\giubileo\1_giubileo.html" = @{
        layout = "preghiera"; title = "1. Mi fermo e apro il cuore allo Spirito"; parent_url = "/preghiere/giubileo/"
    }
    "preghiere\giubileo\2_giubileo.html" = @{
        layout = "preghiera"; title = "2. Prego"; parent_url = "/preghiere/giubileo/"
    }
    "preghiere\giubileo\3_giubileo.html" = @{
        layout = "preghiera"; title = "3. Riconosco l'amore di Dio"; parent_url = "/preghiere/giubileo/"
    }
    "preghiere\giubileo\4_giubileo.html" = @{
        layout = "preghiera"; title = "4. Ascolto"; parent_url = "/preghiere/giubileo/"
    }
    "preghiere\giubileo\5_giubileo.html" = @{
        layout = "preghiera"; title = "5. Chiedo perdono"; parent_url = "/preghiere/giubileo/"
    }
    "preghiere\giubileo\6_giubielo.html" = @{
        layout = "preghiera"; title = "6. Mi affido al Signore"; parent_url = "/preghiere/giubileo/"
    }
    "preghiere\giubileo\7_giubileo.html" = @{
        layout = "preghiera"; title = "7. Lodo e ringrazio il Signore"; parent_url = "/preghiere/giubileo/"
    }
    "preghiere\giubileo\8_giubileo.html" = @{
        layout = "preghiera"; title = "8. Mi affido a Maria"; parent_url = "/preghiere/giubileo/"
    }
}

# Pagine indice (layout: categoria)
$categoryPages = @{
    "preghiere\sacrocuore\index.html" = @{
        title = "Sacro Cuore di Gesù"; parent_url = "/preghiere/"
        voci = @(
            @{label="Consacrazione al Sacro Cuore di Gesù"; url="consacrazione_al_sacro_cuore.html"},
            @{label="Coroncina al Sacro Cuore di Gesù"; url="coroncina_al_sacro_cuore.html"}
        )
    }
    "preghiere\sangiudataddeo\index.html" = @{
        title = "San Giuda Taddeo"; parent_url = "/preghiere/"
        voci = @(
            @{label="Preghiera a San Giuda"; url="preghiera_a_san_giuda.html"},
            @{label="Preghiera per i casi difficili"; url="preghiera_casi_difficili.html"}
        )
    }
    "preghiere\santemidio\index.html" = @{
        title = "Sant'Emidio"; parent_url = "/preghiere/"
        voci = @(
            @{label="Preghiera a Sant'Emidio"; url="preghiera_a_sant_emidio.html"},
            @{label="Triduo a Sant'Emidio"; url="triduo_a_sant_emidio/"}
        )
    }
    "preghiere\santemidio\triduo_a_sant_emidio\index.html" = @{
        title = "Triduo a Sant'Emidio"; parent_url = "/preghiere/santemidio/"
        sottotitolo = "di Fratel Cosimo. Triduo di preghiera composto in onore di S. Emidio, vescovo e martire, protettore contro il terremoto. (In preparazione alla sua festa che si celebra ogni anno il 5 Agosto, giorno del martirio.)"
        voci = @(
            @{label="Giorno 1"; url="giorno_uno.html"},
            @{label="Giorno 2"; url="giorno_due.html"},
            @{label="Giorno 3"; url="giorno_tre.html"},
            @{label="Litanie"; url="litanie.html"}
        )
    }
    "preghiere\credo\index.html" = @{
        title = "Credo"; parent_url = "/preghiere/"
        voci = @(
            @{label="Apostolico"; url="credo_apostolico.html"},
            @{label="Niceo-Costantinopolitano"; url="credo_niceocostantinopolitano.html"}
        )
    }
    "preghiere\giubileo\index.html" = @{
        title = "Giubileo 2025"; parent_url = "/preghiere/"
        sottotitolo = "Preghiere tratte dalla brochure 'Per la preghiera personale' della Diocesi di Macerata orientata alla preparazione per il Giubileo 2025 a cura dell'Ordo Virginum Diocesano (variazioni rimosse, testi ufficiali CEI 2008)."
        voci = @(
            @{label="1. Mi fermo e apro il cuore allo Spirito"; url="1_giubileo.html"},
            @{label="2. Prego"; url="2_giubileo.html"},
            @{label="3. Riconosco l'amore di Dio"; url="3_giubileo.html"},
            @{label="4. Ascolto"; url="4_giubileo.html"},
            @{label="5. Chiedo perdono"; url="5_giubileo.html"},
            @{label="6. Mi affido al Signore"; url="6_giubielo.html"},
            @{label="7. Lodo e ringrazio il Signore"; url="7_giubileo.html"},
            @{label="8. Mi affido a Maria"; url="8_giubileo.html"}
        )
    }
}

$basePath = "C:\Users\Tommaso\Documents\GitHub\preghiere"
$converted = 0
$errors = 0

# Processa le pagine semplici (preghiera layout)
foreach ($relativePath in $simplePages.Keys) {
    $meta = $simplePages[$relativePath]
    $fullPath = Join-Path $basePath $relativePath

    if (-not (Test-Path $fullPath)) {
        Write-Warning "File non trovato: $fullPath"
        $errors++
        continue
    }

    # Leggi il file con codifica UTF-8 (evita problemi di encoding di PowerShell)
    $content = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)

    # Estrai il contenuto del body
    if ($content -match '(?s)<body>(.*)</body>') {
        $bodyContent = $matches[1].Trim()
    } else {
        Write-Warning "Impossibile trovare <body> in: $relativePath"
        $errors++
        continue
    }

    # Converti HTML a Markdown
    $mdContent = Remove-HtmlTags -html $bodyContent

    # Componi il front matter
    $frontMatter = "---`nlayout: $($meta.layout)`ntitle: `"$($meta.title)`"`nparent_url: $($meta.parent_url)`n---`n`n"

    # Scrivi il nuovo file
    $newContent = $frontMatter + $mdContent
    [System.IO.File]::WriteAllText($fullPath, $newContent, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Convertito: $relativePath"
    $converted++
}

# Processa le pagine categoria
foreach ($relativePath in $categoryPages.Keys) {
    $meta = $categoryPages[$relativePath]
    $fullPath = Join-Path $basePath $relativePath

    if (-not (Test-Path $fullPath)) {
        Write-Warning "File non trovato: $fullPath"
        $errors++
        continue
    }

    # Costruisci YAML voci
    $vociYaml = "voci:`n"
    foreach ($voce in $meta.voci) {
        $vociYaml += "  - label: `"$($voce.label)`"`n    url: $($voce.url)`n"
    }

    # Componi front matter
    $fm = "---`nlayout: categoria`ntitle: `"$($meta.title)`"`nparent_url: $($meta.parent_url)`n"
    if ($meta.sottotitolo) {
        $fm += "sottotitolo: `"$($meta.sottotitolo)`"`n"
    }
    $fm += $vociYaml
    $fm += "---`n"

    # Scrivi il nuovo file (contenuto vuoto - tutto è nel front matter)
    [System.IO.File]::WriteAllText($fullPath, $fm, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Convertito categoria: $relativePath"
    $converted++
}

Write-Host ""
Write-Host "Completato: $converted file convertiti, $errors errori."
