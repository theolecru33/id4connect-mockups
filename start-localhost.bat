@echo off
title iD4Connect V2.5 - localhost:8000
echo.
echo ============================================
echo   iD4Connect V2.5 - Serveur de developpement
echo ============================================
echo.
echo URL : http://localhost:8000
echo Dossier : %CD%
echo.
echo Ctrl+C pour arreter le serveur.
echo.
start "" "http://localhost:8000"
python -m http.server 8000
pause
