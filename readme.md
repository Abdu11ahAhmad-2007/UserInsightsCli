# User Insights Cli
A command line interface tool that fetches data from a jsonplaceholder API, sorts it, performs different actions, and displays data in formatted form.

## Overview
This script retrieves data for the users, posts and todos using asynchronus network requests, and displays it after performing different actions without using for or while loops.

## Features
Concurrent Data Fetching: It utilizes Promise.all() to fetch data simaltaneously for better performance.
Sorting: It sorts the array in descending order of posts, while also using alphabetical sort in a tiebreaker.
Summary Statistics: It uses array method reduce() to find total no. of posts, avg posts per user, and to find the user with the highest completed tasks.
Error Handeling: If there is some problem in data fetching, it shows a friendly error and ends the process using a non zero code.
Running: Runs by a single "npm start" command.
