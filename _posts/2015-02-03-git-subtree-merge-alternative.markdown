---
layout: post
title: Git Subtree Merge Alternatives
published: true
tags:
- git
- merge
type: post
status: publish
---

Recently for work I've had the need to pull data from a Subversion repository for use in a project whose code is stored in Git.  It seemed obvious to use [git-svn](https://www.kernel.org/pub/software/scm/git/docs/git-svn.html) to retrieve my data but there was a catch: the data in my svn repo was stored in a different path structure from the data in my git branch of choice.  If it were a case of only one or two paths needing to be relocated, setting the svn path to the subpath and having multiple configured git-svn repos might be the answer, but for several subpaths on a particularly large repo this could prove incredibly inefficient.

I learned quickly that [git-subtree](https://github.com/git/git/blob/master/contrib/subtree/git-subtree.txt) and the [subtree merge strategy](http://git-scm.com/book/en/v1/Git-Tools-Subtree-Merging) were not actually the same things and that use of git-subtree with svn branches in the same repo wouldn't fly.  I'd have to play with the subtree merge strategy.

This involved use of [git-read-tree](https://www.kernel.org/pub/software/scm/git/docs/git-read-tree.html) to map paths on the git-svn branch to paths on the index/working directory as follows.

    $ git read-tree --prefix=lib\ -u svn-branch:subproject\lib

Note the `:subproject\lib` after the git-svn branch name. The files in that directory within the git-svn branch will be read to the prefix `lib\` in the local index/working directory. The `-u` will ensure the files in the destination index are updated immediately in the working directory.  This will fail if files already exist in the working directory.  The assumption then is that we can use this approach to populate the tree and there should be a merge option that properly attends to the mapping on the svn branch.  Unfortunately, I could not locate one.

The merge strategy recommended in all places appears to be the subtree merge strategy (`merge -s subtree`). This is insufficient. While it supports a prefix option (`-X subtree=...`) to prevent git from having to guess at the subtree path, it does not allow specification of a source path within the source branch!  Executing a subtree merge in this way results in an enormous mess and none of the desired mapping to prefixes.

Eventually, I found a method that works but it's certainly not pretty, efficient, or error-proof.  If one knows the directory structure will be in place _for sure_, and one filters out volatile actions like deletes as necessary, one can produce diffs of the source branch path against the prefixed path in the working directory, then apply the diffs to the directory with `git apply`.  My exmple is as follows:

    $ git diff-tree -r -p --diff-filter=ACMRTU HEAD:lib\ svn-branch:subproject\lib | git apply --index --whitespace=nowarn --directory=lib\

This works for subdirectories.  For single files, the following works:

    $ git diff -p --raw svn-branch:subproject\lib\onenecessaryfile.py -- lib\onenecessaryfile.py | git apply --index --whitespace=nowarn --reverse

There might be a better approach than the above, but I haven't found it yet.
