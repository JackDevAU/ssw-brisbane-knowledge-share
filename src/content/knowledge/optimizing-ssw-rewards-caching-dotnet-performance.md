---
title: "Optimizing SSW Rewards: Caching and .NET Performance Techniques"
date: "2025-01-23"
presenter: "Jernej Kavka (JK)"
summary: "Jernej Kavka tackles severe performance bottlenecks in the SSW Rewards system by refactoring SQL queries and implementing a robust caching layer. He explains how high CPU usage and timeouts on the SQL Server were alleviated through in-memory caching, selective data retrieval, and concurrency locks—ultimately speeding up the leaderboard functionality by hundreds of times. Jernej also previews how hybrid caching in .NET 10 could further streamline and future-proof the solution."
tags: ["Performance", "Caching", ".NET", "SQL", "Optimization", "Leaderboards", "In-Memory Caching", "Hybrid Cache"]
githubRepo: "https://github.com/SSWConsulting/SSW.Rewards.Mobile"
videoUrl: "https://sswcom-my.sharepoint.com/:v:/r/personal/samwagner_ssw_com_au/Documents/Recordings/%F0%9F%8E%B1%20Knowledge%20sharing%20-%20Brook,%20JK%20and%20Luke%20%F0%9F%A7%A0-20250123_125107-Meeting%20Recording.mp4?csf=1&web=1&e=Kmyll1&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D"
---