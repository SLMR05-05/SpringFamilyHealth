# run-backend.ps1
# Usage:
#   .\run-backend.ps1                # uses existing OPENAI_API_KEY if set
#   .\run-backend.ps1 -openaiKey "sk-..."   # set OPENAI_API_KEY for current user and run

param(
    [string]$openaiKey
)
if ($openaiKey) {
    Write-Host "Setting OPENAI_API_KEY for current user (via setx)."
    setx OPENAI_API_KEY $openaiKey | Out-Null
    Write-Host "OPENAI_API_KEY set (will be available in new shells)."
    Write-Host "Note: if you want this current shell to see the value immediately, also run:`n$env:OPENAI_API_KEY = '$openaiKey'"
    $env:OPENAI_API_KEY = $openaiKey
} else {
    # Try to auto-load from .env files (backend/.env or repo root .env)
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
    # Resolve repo root (parent of backend)
    try {
        $parent = Resolve-Path (Join-Path $scriptDir "..") | Select-Object -First 1
        $parentPath = $parent.Path
    } catch {
        $parentPath = (Join-Path $scriptDir "..")
    }

    $candidatePaths = @()
    $candidatePaths += Join-Path $scriptDir ".env"
    $candidatePaths += Join-Path $parentPath ".env"

    $loaded = $false
    foreach ($p in $candidatePaths) {
        if (Test-Path $p) {
            Write-Host "Loading environment variables from $p"
            try {
                Get-Content $p | ForEach-Object {
                    if ($_ -match '^[\s#]*$') { return }
                    if ($_ -match '^[\s#]*([^=\s]+)\s*=\s*(.*)$') {
                        $k = $matches[1]
                        $v = $matches[2]
                        # remove surrounding quotes
                        if ($v -match '^"(.*)"$') { $v = $matches[1] }
                        if ($k -eq 'OPENAI_API_KEY') {
                            $env:OPENAI_API_KEY = $v
                            Write-Host "Loaded OPENAI_API_KEY from $p"
                            $loaded = $true
                        } else {
                            # set other envs for convenience if desired
                            # Use Set-Item to set dynamic env var name
                            try {
                                Set-Item -Path "Env:$k" -Value $v -ErrorAction Stop
                            } catch {
                                # Fallback to Process-level environment setter
                                [System.Environment]::SetEnvironmentVariable($k, $v, 'Process')
                            }
                        }
                    }
                }
            } catch {
                Write-Warning ("Failed to parse {0}: {1}" -f $p, $_)
            }
            if ($loaded) { break }
        }
    }

    if (-not $loaded) {
        Write-Host "Using existing OPENAI_API_KEY environment variable (if set)."
    }
}

# Change to backend folder (script is placed inside backend)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Host "Starting Spring Boot application..."
# Run Maven wrapper to start Spring Boot
if (Test-Path .\mvnw.cmd) {
    .\mvnw.cmd spring-boot:run
} else {
    Write-Host "mvnw.cmd not found. Please run the backend using your IDE or 'mvn spring-boot:run' from this folder."
}
