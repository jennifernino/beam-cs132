# beam-cs132
## adding github to your computer so you can edit files ...
1. move into a directory you would like keep the final project files (IE: mkdir cs132-final; cd cs132-final)
2. clone the project to your computer using the link provided at the clone button
   `git clone https://github.com/<username>/beam-cs132.git`
## making edits to the project and saving them
You can edit the files in the directory there and push your changes to github, but here is a quick example of what that may look like. 
1. Make edits to a new file (here were adding hi to the hi.txt file)
  `touch hi.txt; echo "hi" > hi.txt`
2. Add files with changes to repo
  `git add -A` to add all files 
  `git add hi.txt` for just that file
3. Commit changes and don't forget to include a note! 
  `git commit -m <message>`
  `git commit -m "Added new file">`
4. Push to github (to finally add everything
  `git push`

That's all! 
