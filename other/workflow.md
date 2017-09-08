1. set SSH
  * create a SSH key: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/
  ```
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ```
  * add your SSH key to the ssh-keygen
  ```
  ssh-add -K ~/.ssh/id_rsa
  ```
  * add a new SSH key to your github account
    - in the user setting

2. clone project
```
git clone [ssh href]
```

3. git stash
```
git stash
git status: look status
git stash apply
```

4. add a branch
```
git checkout -b [branch]: add branch
git branch: look branch
git checkout [branch]: change branch
```

5. programming

6. before commit
```
git pull origin master --no-ff
```

7. commit the change to owner branch
```
git commit -am "comment"
git push origin [branch]
```

8. create a merge in the http://ai-gogs.tap4fun.com/AI/mml-fe/pulls

9. update the master branch
```
git checkout master
git fetch
```

10. publish
* use the docker
```
npm run build
bash tools/docker/build-push.sh [project]
```
