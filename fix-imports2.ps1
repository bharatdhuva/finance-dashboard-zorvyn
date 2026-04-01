# Fix broken "import * from" statements using line-by-line processing

$uiDir = "c:\Users\bhara\Desktop\finance-dashboard-zorvyn\src\components\ui"

$mappings = @{
    'react' = 'React'
    '@radix-ui/react-accordion' = 'AccordionPrimitive'
    '@radix-ui/react-alert-dialog' = 'AlertDialogPrimitive'
    '@radix-ui/react-avatar' = 'AvatarPrimitive'
    '@radix-ui/react-checkbox' = 'CheckboxPrimitive'
    '@radix-ui/react-collapsible' = 'CollapsiblePrimitive'
    '@radix-ui/react-context-menu' = 'ContextMenuPrimitive'
    '@radix-ui/react-dialog' = 'DialogPrimitive'
    '@radix-ui/react-dropdown-menu' = 'DropdownMenuPrimitive'
    '@radix-ui/react-hover-card' = 'HoverCardPrimitive'
    '@radix-ui/react-label' = 'LabelPrimitive'
    '@radix-ui/react-menubar' = 'MenubarPrimitive'
    '@radix-ui/react-navigation-menu' = 'NavigationMenuPrimitive'
    '@radix-ui/react-popover' = 'PopoverPrimitive'
    '@radix-ui/react-progress' = 'ProgressPrimitive'
    '@radix-ui/react-radio-group' = 'RadioGroupPrimitive'
    '@radix-ui/react-scroll-area' = 'ScrollAreaPrimitive'
    '@radix-ui/react-select' = 'SelectPrimitive'
    '@radix-ui/react-separator' = 'SeparatorPrimitive'
    '@radix-ui/react-slider' = 'SliderPrimitive'
    '@radix-ui/react-switch' = 'SwitchPrimitive'
    '@radix-ui/react-tabs' = 'TabsPrimitive'
    '@radix-ui/react-toast' = 'ToastPrimitives'
    '@radix-ui/react-toggle' = 'TogglePrimitive'
    '@radix-ui/react-toggle-group' = 'ToggleGroupPrimitive'
    '@radix-ui/react-tooltip' = 'TooltipPrimitive'
    'recharts' = 'RechartsPrimitive'
    'react-resizable-panels' = 'ResizablePrimitive'
}

Get-ChildItem -Path $uiDir -Filter "*.jsx" | ForEach-Object {
    $file = $_.FullName
    $lines = Get-Content $file -Encoding UTF8
    $changed = $false
    
    $newLines = foreach ($line in $lines) {
        $modified = $line
        if ($line -match '^import \* from "([^"]+)"') {
            $moduleName = $Matches[1]
            if ($mappings.ContainsKey($moduleName)) {
                $alias = $mappings[$moduleName]
                $modified = "import * as $alias from `"$moduleName`";"
                $changed = $true
            }
        }
        
        # Also fix forwardRef generics on the same line
        if ($modified -match 'React\.forwardRef<') {
            $modified = $modified -replace 'React\.forwardRef<[^>]+>\(', 'React.forwardRef('
            $changed = $true
        }
        
        $modified
    }
    
    if ($changed) {
        $newLines | Set-Content -Path $file -Encoding UTF8
        Write-Output "Fixed: $($_.Name)"
    }
}

Write-Output "`nDone!"
