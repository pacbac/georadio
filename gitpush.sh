#! /git-bash.exe

git add $1

MSG=$2
git commit -m "$MSG"

git push
