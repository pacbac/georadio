#! /git-bash.exe

git add $1
echo "Git add complete."

MSG=$2
git commit -m "$MSG"
echo "Finished commit $2"

git push
echo "Pushed to "
