# Fix broken import statements: "import * from" -> "import * as X from"
# The original regex script incorrectly removed the "as X" portion

$uiDir = "c:\Users\bhara\Desktop\finance-dashboard-zorvyn\src\components\ui"

# Mapping of module paths to their original namespace aliases
$importMappings = @{
    '"react"' = 'React'
    '"@radix-ui/react-accordion"' = 'AccordionPrimitive'
    '"@radix-ui/react-alert-dialog"' = 'AlertDialogPrimitive'
    '"@radix-ui/react-avatar"' = 'AvatarPrimitive'
    '"@radix-ui/react-checkbox"' = 'CheckboxPrimitive'
    '"@radix-ui/react-collapsible"' = 'CollapsiblePrimitive'
    '"@radix-ui/react-context-menu"' = 'ContextMenuPrimitive'
    '"@radix-ui/react-dialog"' = 'DialogPrimitive'
    '"@radix-ui/react-dropdown-menu"' = 'DropdownMenuPrimitive'
    '"@radix-ui/react-hover-card"' = 'HoverCardPrimitive'
    '"@radix-ui/react-label"' = 'LabelPrimitive'
    '"@radix-ui/react-menubar"' = 'MenubarPrimitive'
    '"@radix-ui/react-navigation-menu"' = 'NavigationMenuPrimitive'
    '"@radix-ui/react-popover"' = 'PopoverPrimitive'
    '"@radix-ui/react-progress"' = 'ProgressPrimitive'
    '"@radix-ui/react-radio-group"' = 'RadioGroupPrimitive'
    '"@radix-ui/react-scroll-area"' = 'ScrollAreaPrimitive'
    '"@radix-ui/react-select"' = 'SelectPrimitive'
    '"@radix-ui/react-separator"' = 'SeparatorPrimitive'
    '"@radix-ui/react-slider"' = 'SliderPrimitive'
    '"@radix-ui/react-switch"' = 'SwitchPrimitive'
    '"@radix-ui/react-tabs"' = 'TabsPrimitive'
    '"@radix-ui/react-toast"' = 'ToastPrimitives'
    '"@radix-ui/react-toggle"' = 'TogglePrimitive'
    '"@radix-ui/react-toggle-group"' = 'ToggleGroupPrimitive'
    '"@radix-ui/react-tooltip"' = 'TooltipPrimitive'
    '"recharts"' = 'RechartsPrimitive'
    '"react-resizable-panels"' = 'ResizablePrimitive'
}

Get-ChildItem -Path $uiDir -Filter "*.jsx" | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8
    $changed = $false

    foreach ($module in $importMappings.Keys) {
        $pattern = "import \* from $module"
        $replacement = "import * as $($importMappings[$module]) from $module"
        if ($content -match [regex]::Escape($pattern)) {
            $content = $content.Replace($pattern, $replacement)
            $changed = $true
        }
    }

    # Fix remaining forwardRef generics - multi-line pattern
    # React.forwardRef<\n  ...\n  ...\n>( -> React.forwardRef(
    while ($content -match 'React\.forwardRef<[^(]+>\(') {
        $content = $content -replace 'React\.forwardRef<[^(]+>\(', 'React.forwardRef('
        $changed = $true
    }

    # Fix createContext generics
    while ($content -match 'React\.createContext<[^(]+>\(') {
        $content = $content -replace 'React\.createContext<[^(]+>\(', 'React.createContext('
        $changed = $true
    }

    # Remove interface blocks
    $content = $content -replace '(?ms)^interface\s+\w+[^{]*\{[^}]*\}\s*\n', ''
    $content = $content -replace '(?ms)^export interface\s+\w+[^{]*\{[^}]*\}\s*\n', ''

    # Remove TS type annotations from arrow function params: ({ x, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
    $content = $content -replace '\}:\s*React\.\w+<[^>]+>', '}'

    # Remove type declarations
    $content = $content -replace '(?m)^type\s+\w+\s*=[^;]+;\s*$', ''
    $content = $content -replace '(?m)^export type\s+\{[^}]+\};\s*$', ''

    if ($changed) {
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Output "Fixed: $($_.Name)"
    }
}

# Also fix the .js file in the same dir
Get-ChildItem -Path $uiDir -Filter "*.js" | ForEach-Object {
    # No fixes needed for use-toast.js
}

Write-Output "`nImport fix complete!"
