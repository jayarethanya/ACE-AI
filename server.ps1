# ACE AI Local HTTP Server (Pure PowerShell)
# Starts a local static web server on port 8000 and launches the browser

$Port = 8000
$Root = $PSScriptRoot
if (-not $Root) { $Root = Get-Location }

$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add("http://localhost:$Port/")
$Listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $Listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  ACE AI - AI-Powered Event Intelligence Platform" -ForegroundColor Cyan
    Write-Host "  Server running at: http://localhost:$Port/" -ForegroundColor Yellow
    Write-Host "  Press Ctrl+C in this terminal to stop the server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green

    # Launch default web browser
    Start-Process "http://localhost:$Port/"

    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $UrlPath = $Request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($UrlPath) -or $UrlPath -eq "/") {
            $UrlPath = "index.html"
        }

        # Normalize path
        $FilePath = Join-Path $Root $UrlPath

        if (Test-Path $FilePath -PathType Leaf) {
            $Extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = switch ($Extension) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $Response.ContentType = $ContentType
            $Response.AddHeader("Access-Control-Allow-Origin", "*")
            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentLength64 = $Bytes.Length
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
        } else {
            $Response.StatusCode = 404
            $NotFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $UrlPath")
            $Response.OutputStream.Write($NotFoundBytes, 0, $NotFoundBytes.Length)
        }

        $Response.OutputStream.Close()
    }
} catch {
    Write-Host "Server stopped or error occurred: $_" -ForegroundColor Red
} finally {
    if ($Listener.IsListening) {
        $Listener.Stop()
    }
    $Listener.Close()
}
