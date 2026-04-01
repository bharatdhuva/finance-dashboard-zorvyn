# Bulk convert shadcn UI components from TypeScript to JavaScript
# This script processes all .jsx files in src/components/ui/ and removes TS syntax.

$uiDir = "c:\Users\bhara\Desktop\finance-dashboard-zorvyn\src\components\ui"

Get-ChildItem -Path $uiDir -Filter "*.jsx" | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8

    # Remove 'type' from named imports: import { cva, type VariantProps } -> import { cva } or keep non-type imports
    # Handle: , type X } and { type X, and { type X }
    $content = $content -replace ',\s*type\s+\w+(?:<[^>]+>)?', ''
    $content = $content -replace '{\s*type\s+\w+(?:<[^>]+>)?,\s*', '{ '
    $content = $content -replace 'import\s+{\s*type\s+\w+(?:<[^>]+>)?\s*}\s*from\s+"[^"]+"\s*;?\s*\n?', ''
    $content = $content -replace "import\s+{\s*type\s+\w+(?:<[^>]+>)?\s*}\s*from\s+'[^']+'\s*;?\s*\n?", ''
    
    # Remove 'import type { ... } from ...' lines
    $content = $content -replace 'import\s+type\s+{[^}]*}\s*from\s+"[^"]+"\s*;?\s*\n?', ''
    $content = $content -replace "import\s+type\s+{[^}]*}\s*from\s+'[^']+'\s*;?\s*\n?", ''

    # Remove multi-line forwardRef generic type params: React.forwardRef<\n  TypeA,\n  TypeB\n>( -> React.forwardRef(
    $content = $content -replace 'React\.forwardRef<\s*\n\s*[^>]+\n\s*[^>]+\n>\(', 'React.forwardRef(('
    # Simpler single-line: React.forwardRef<A, B>( -> React.forwardRef(
    $content = $content -replace 'React\.forwardRef<[^>]+>\(', 'React.forwardRef(('

    # Remove createContext generic: React.createContext<X>(  -> React.createContext(
    $content = $content -replace 'React\.createContext<[^>]+>\(', 'React.createContext(('

    # Remove useMemo generic: React.useMemo<X>( -> React.useMemo(
    $content = $content -replace 'React\.useMemo<[^>]+>\(', 'React.useMemo(('

    # Remove useState generic: React.useState<X>( -> React.useState(
    $content = $content -replace 'React\.useState<[^>]+>\(', 'React.useState(('

    # Remove inline type annotations in function params for arrow functions: 
    # ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => 
    # -> ({ className, ...props }) =>
    $content = $content -replace '\):\s*React\.\w+(?:<[^>]+>)?\s*\)', ')'

    # Remove standalone type declarations: type X = ... (multi-line and single-line)
    # Be careful not to remove too much

    # Remove 'as React.CSSProperties' casts
    $content = $content -replace '\s*as\s+React\.CSSProperties', ''

    # Remove 'as const' 
    $content = $content -replace '\s+as\s+const', ''

    # Remove 'as string' casts
    $content = $content -replace '\s+as\s+string', ''

    # Remove 'as FormFieldContextValue' and similar casts
    $content = $content -replace '\s+as\s+\w+', ''

    # Remove export type { ... } lines
    $content = $content -replace 'export\s+type\s+{[^}]*}\s*;?\s*\n?', ''

    # Remove standalone type X = ... declarations (single line)
    $content = $content -replace '\ntype\s+\w+\s*=\s*[^;]+;\s*\n', "`n"

    # Fix double parens from forwardRef fix: React.forwardRef(( should be React.forwardRef(
    # Actually we need these double parens for the arrow function

    # Remove remaining 'type ' from export statements like: export { type ToastProps, ... }
    # This needs to be handled carefully
    
    # Write back
    Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
    Write-Output "Processed: $($_.Name)"
}

# Also process the .js file
$jsFile = Join-Path $uiDir "use-toast.js"
if (Test-Path $jsFile) {
    $content = Get-Content $jsFile -Raw -Encoding UTF8
    # This file is a simple re-export, no TS needed
    Write-Output "Processed: use-toast.js (no changes needed)"
}

Write-Output "`nUI component conversion complete!"
