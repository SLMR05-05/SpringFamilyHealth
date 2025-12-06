#!/usr/bin/pwsh
Write-Host "=== Starting Backend with PowerShell ==="

# Load .env if exists
if (Test-Path /app/.env) {
    Write-Host "Loading .env file..."
    Get-Content /app/.env | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove surrounding quotes
            if ($value -match '^"(.*)"$') { $value = $matches[1] }
            [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "Loaded $key"
        }
    }
}

Write-Host "Starting Spring Boot application..."
java -jar /app/app.jar
