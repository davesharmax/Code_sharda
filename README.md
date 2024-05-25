# coding platform for college 
Code Sharda

### Built With React, NextJS, TypeScript, TailwindCSS, Firebase
Welcome to Code Sharda, a comprehensive collection of competitive programming solutions and coding practice problems. This repository is designed to help you enhance your problem-solving skills and prepare for coding competitions.

Table of Contents
About
Features
Getting Started
Prerequisites
Installation
Usage
Contributing
License
Contact
About

# To Setup this project in your local computer follow these steps:-
Code Sharda is a repository that contains solutions to various coding problems from different competitive programming platforms. Whether you are preparing for coding contests or just looking to improve your coding skills, this repository provides a diverse set of problems and solutions.

1. git clone this repositry by forking from the main repositry
2. open vs code terminal  git clone https://github.com/davesharmax/Code_sharda.git in folder you want to.
3. Run the command npm i
4. Also run the command npm i react-firebase-hooks
5. In the main folder create a file and name it .env.local
6. Now we can setup firebase for our database 
8. Go to firebase and create a project then add an app into the project select web app. go to your terminal and type npm i firebase
9. Then in firebase console go to project setting > general > scroll down to your apps section > copy the unique firebase config ID's details
10.*In .env.local file copy and paste the following:-*
NEXT_PUBLIC_FIREBASE_API_KEY = "__your api key _"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = " copy your details as mentioned in  step 9 and type here respectively "
NEXT_PUBLIC_FIREBASE_PROJECT_ID =" copy your details as mentioned in  step 9 and type here respectively "
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = " copy your details as mentioned in  step 9 and type here respectively "
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = " copy your details as mentioned in  step 9 and type here respectively "
NEXT_PUBLIC_FIREBASE_APP_ID = " copy your details as mentioned in  step 9 and type here respectively "
Features
📝 A wide range of problems from beginner to advanced levels.
🌐 Solutions in multiple programming languages.
📚 Well-documented code for better understanding.
🔄 Regular updates with new problems and solutions.
Getting Started
To get a local copy of this project up and running, follow these simple steps.

11. In firebase console setup authentiacation by adding email id and user that you will use to access the platform
12. To fetch questions data on your app go to cloud firestore > collection > start collection > name the collection as problems and then in problems collection add document > you have to add feilds to fetch details successfully.
13. for example :-  click on add document > document id = two-sum >  add fields :
_category =   "Array"
     (string)
id="two-sum"
     (string)
order="1"
    (string)
title="1.Two Sum"
     (string)
videoId=""_
Prerequisites
Ensure you have the following installed:

14. To add more question to your localhost and to fetch more question details follow :-
    1. go to directory src > mockproblems > problems.ts
    2. copy the details of the problem and add fields in firebase console according to the direction provided in the step 12 and 13
15. Lastly type commond in your terminal as_ *npm run dev*_ .
Git
Python (if you want to run Python scripts)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/Upadhyayayush30/Code_sharda.git
Navigate to the project directory:

bash
Copy code
cd Code_sharda
Usage
Explore the directories to find problems and their solutions. Each directory typically corresponds to a specific competitive programming platform or a type of problem. For example:

codechef/ contains problems from CodeChef.
codeforces/ contains problems from Codeforces.
leetcode/ contains problems from LeetCode.
Platform Logos
CodeChef Logo

LeetCode Logo

Open any file to view the problem statement and its solution. For example, to run a Python solution:

bash
Copy code
python3 path/to/your_script.py
Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
License
Distributed under the MIT License. See LICENSE for more information.

Contact
Ayush Upadhyay - your.email@example.com

Project Link: https://github.com/Upadhyayayush30/Code_sharda
