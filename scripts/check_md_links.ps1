# Simple Markdown link checker
# Scans .md files and reports internal links whose target file or anchor is missing.

Set-Location -Path (Join-Path $PSScriptRoot '..')

$mdFiles = Get-ChildItem -Path . -Recurse -Filter *.md | Where-Object { $_.FullName -notmatch '\\.git\\' }
$errors = @()

function To-GitHubSlug($text) {
    # Very basic GitHub slugger: lowercase, trim, replace spaces with '-', remove punctuation
    $s = $text.ToLower().Trim()
    $s = $s -replace "[^a-z0-9\s-]",""
    $s = $s -replace "\s+","-"
    return $s
}

foreach ($md in $mdFiles) {
    $content = Get-Content $md.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    $dir = Split-Path -Path $md.FullName -Parent
    # Find markdown links [text](target)
    $matches = [regex]::Matches($content, '\\[[^\\]]+\\]\\(([^)]+)\\)')
    foreach ($m in $matches) {
        $target = $m.Groups[1].Value
        # ignore external
        if ($target -match '^(http|https):') { continue }
        if ($target -match '^mailto:') { continue }
        # ignore anchors to same file like '#section'
        if ($target -match '^#') {
            $anchor = $target.TrimStart('#')
            $slug = To-GitHubSlug($anchor)
            # check if anchor exists in current file
            $foundAnchor = ($content -split "\r?\n") -match "^#.+$" | ForEach-Object { To-GitHubSlug(($_ -replace '^#+\s*','')) } | Where-Object { $_ -eq $slug }
            if (-not $foundAnchor) {
                $errors += [pscustomobject]@{ File = $md.FullName; Link = $target; Type = 'MissingAnchorSameFile' }
            }
            continue
        }
        # handle anchors in target file
        $seg = $target -split '#'
        $pathPart = $seg[0]
        if ($seg.Count -gt 1) { $anchorPart = $seg[1] } else { $anchorPart = $null }

        # Resolve relative path
        $resolved = $pathPart
        if ([System.IO.Path]::IsPathRooted($pathPart)) { $resolved = $pathPart }
        elseif ($pathPart -eq '') { $resolved = $md.FullName } else { $resolved = [System.IO.Path]::GetFullPath((Join-Path $dir $pathPart)) }
        if (-not (Test-Path $resolved)) {
            $errors += [pscustomobject]@{ File = $md.FullName; Link = $target; Type = 'MissingFile'; Target = $resolved }
            continue
        }
        if ($anchorPart) {
            $targetContent = Get-Content $resolved -Raw -ErrorAction SilentlyContinue
            $slug = To-GitHubSlug($anchorPart)
            $headings = ($targetContent -split "\r?\n") | Where-Object { $_ -match '^#' } | ForEach-Object { To-GitHubSlug(($_ -replace '^#+\s*','')) }
            if ($headings -notcontains $slug) {
                $errors += [pscustomobject]@{ File = $md.FullName; Link = $target; Type = 'MissingAnchorTargetFile'; Target = $resolved; Anchor = $anchorPart }
            }
        }
    }
}

if ($errors.Count -eq 0) {
    Write-Host "No broken internal md links found."; exit 0
} else {
    Write-Host "Found $($errors.Count) potential link issues:`n"
    $errors | ForEach-Object { Write-Host "[$($_.Type)] in $($_.File) -> $($_.Link) (resolved: $($_.Target))" }
    # Save report
    $report = "docs/link-check-report.txt"
    $errors | Out-File -FilePath $report -Encoding utf8
    Write-Host "Report saved to $report"
    exit 2
}
