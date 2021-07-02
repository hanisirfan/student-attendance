# Background
During the Covid-19 pandemic, our college have created a web app to record student's attendance.
The app have a simple text input form to search for a class with a code. The code consist consist of the course code + program code (ex: 1DipIT).
I noticed that if the class code doesn't exist, you can just create a new code yourself without any authentication needed.
I also noticed that I could just send a POST request to the app submission endpoint to add my attendance record using Python (no CSRF protection).
This project is just a more friendly version of that Python code I created. I used it for a couple of my class attendance for testing purposes only. I do attend those classes! This project is created just for fun. Do not use it for cheating!

# How To Use

Again, this project is just for fun and created to not be used for cheating. But if you want to test it on your personal project, the how to use guide can be seen on the root page. You must host the project in a web server since Fetch API can't read JSON files from `file://` protocol.

# License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

2021 Muhammad Hanis Irfan Bin Mohd Zaid
