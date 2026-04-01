# PowerShell script to convert TypeScript to JavaScript
# This script renames .tsx -> .jsx and .ts -> .js files

$root = "c:\Users\bhara\Desktop\finance-dashboard-zorvyn"

# Step 1: Rename all .tsx files in src/ to .jsx
Get-ChildItem -Path "$root\src" -Recurse -Filter "*.tsx" | ForEach-Object {
    $newName = $_.FullName -replace '\.tsx$', '.jsx'
    Rename-Item -Path $_.FullName -NewName $newName -Force
    Write-Output "Renamed: $($_.FullName) -> $newName"
}

# Step 2: Rename all .ts files (except .d.ts) in src/ to .js
Get-ChildItem -Path "$root\src" -Recurse -Filter "*.ts" | Where-Object { $_.Name -notmatch '\.d\.ts$' } | ForEach-Object {
    $newName = $_.FullName -replace '\.ts$', '.js'
    Rename-Item -Path $_.FullName -NewName $newName -Force
    Write-Output "Renamed: $($_.FullName) -> $newName"
}

# Step 3: Delete vite-env.d.ts
$dtsFile = "$root\src\vite-env.d.ts"
if (Test-Path $dtsFile) {
    Remove-Item $dtsFile -Force
    Write-Output "Deleted: $dtsFile"
}

# Step 4: Rename root config files
# vite.config.ts -> vite.config.js
if (Test-Path "$root\vite.config.ts") {
    Rename-Item "$root\vite.config.ts" "vite.config.js" -Force
    Write-Output "Renamed: vite.config.ts -> vite.config.js"
}

# tailwind.config.ts -> tailwind.config.js
if (Test-Path "$root\tailwind.config.ts") {
    Rename-Item "$root\tailwind.config.ts" "tailwind.config.js" -Force
    Write-Output "Renamed: tailwind.config.ts -> tailwind.config.js"
}

# vitest.config.ts -> vitest.config.js
if (Test-Path "$root\vitest.config.ts") {
    Rename-Item "$root\vitest.config.ts" "vitest.config.js" -Force
    Write-Output "Renamed: vitest.config.ts -> vitest.config.js"
}

# playwright-fixture.ts -> playwright-fixture.js
if (Test-Path "$root\playwright-fixture.ts") {
    Rename-Item "$root\playwright-fixture.ts" "playwright-fixture.js" -Force
    Write-Output "Renamed: playwright-fixture.ts -> playwright-fixture.js"
}

# playwright.config.ts -> playwright.config.js
if (Test-Path "$root\playwright.config.ts") {
    Rename-Item "$root\playwright.config.ts" "playwright.config.js" -Force
    Write-Output "Renamed: playwright.config.ts -> playwright.config.js"
}

# Step 5: Delete tsconfig files
@("$root\tsconfig.json", "$root\tsconfig.app.json", "$root\tsconfig.node.json") | ForEach-Object {
    if (Test-Path $_) {
        Remove-Item $_ -Force
        Write-Output "Deleted: $_"
    }
}

Write-Output "`nFile renaming and cleanup complete!"
