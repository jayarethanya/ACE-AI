@echo off
title ACE AI - AI-Powered Event Intelligence Platform
echo ========================================================
echo Starting ACE AI Local Web Server...
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
