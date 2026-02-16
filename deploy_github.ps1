# Script di caricamento su GitHub (Versione Pro per Cloud Build)
# Assicurati di aver creato un repository vuoto su GitHub prima di iniziare.

Write-Host "Inizio caricamento CopyChatt su GitHub per Cloud Build..." -ForegroundColor Cyan

# Inizializza Git se non presente
if (!(Test-Path .git)) {
    git init
    git checkout -b main
}

# Verifica identità Git (per evitare errore "Author identity unknown")
$gitUser = git config user.name
if (!$gitUser) {
    Write-Host "Configurazione identità locale temporanea..." -ForegroundColor Gray
    git config --local user.email "salvo@copychatt.app"
    git config --local user.name "Salvo"
}

# Crea un file .gitignore se non esiste per evitare di caricare giga di roba inutile
if (!(Test-Path .gitignore)) {
    @"
node_modules/
android/app/build/
www/src/utils/config.js
.idea/
.DS_Store
*.apk
"@ | Out-File -FilePath .gitignore -Encoding utf8
}

# Aggiungi tutti i file (incluso .github per le Actions!)
git add .
git commit -m "Deploy CopyChatt V9 - Cloud APK Build Ready"

# Configura il remote
$remote = git remote get-url origin 2>$null
if (!$remote) {
    $repoUrl = Read-Host "Incolla l'URL del tuo repository GitHub (es. https://github.com/tuonome/copychatt.git)"
    git remote add origin $repoUrl
}

# Carica i file
Write-Host "Caricamento in corso... Mettiti comodo!" -ForegroundColor Yellow
git push -u origin main --force

Write-Host "`nFatto! Ora vai su GitHub -> tab 'Actions' per vedere la creazione dell'APK." -ForegroundColor Green
Read-Host "Premi Invio per chiudere"
