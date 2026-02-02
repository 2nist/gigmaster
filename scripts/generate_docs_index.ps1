Set-Location -Path (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)\\..\\

$out='docs/index.md'
$header = "# Documentation Index\n\nAuto-generated index. Update `docs/SOP.md` for structure rules.\n\n"
$body = ''

Get-ChildItem -Path docs -Recurse -Filter *.md | Where-Object { $_.FullName -notmatch 'docs\\index.md' -and $_.FullName -notmatch 'docs\\SOP.md' -and $_.FullName -notmatch 'docs\\README.md' } | Sort-Object FullName | ForEach-Object {
    $rel = $_.FullName.Replace((Get-Location).ProviderPath+'\\','')
    $content = Get-Content $_.FullName -ErrorAction SilentlyContinue
    $first = ($content | Select-String '^#\s+' -SimpleMatch | Select-Object -First 1).ToString().Trim()
    if ($first -match '^#\s*(.+)') { $title = $matches[1] } else { $title = '—' }
    $link = $rel -replace '\\','/'
    $body += "- [$title]($link) - `$rel`\n"
}

Set-Content -Path $out -Value ($header + $body)

git add $out
if (-not (git diff --cached --quiet)) { git commit -m 'docs: update docs/index.md TOC' } else { Write-Host 'No changes to commit' }

Write-Host 'Updated index with' (Get-ChildItem -Path docs -Recurse -Filter *.md | Measure-Object).Count 'markdown files'
