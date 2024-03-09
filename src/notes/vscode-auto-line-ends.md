---
topics: ["VSCODE"]
publishedOn: 2024-03-09
title: VScode find and replace regular expressions
---

> I wanted to auto find all line ends in a file and add a break tag


To programmatically add a html break tag at the end of every line in VSCode:

- Open the file in VSCode.

- Press Ctrl + H (Windows/Linux) or Cmd + H (Mac) to open the Find and Replace panel.

- Click the .* button in the search bar to enable regular expressions.

- In the "Find" field, enter $ to match the end of each line.

- In the "Replace" field, enter the html tag.

- Click the "Replace All" button or use Ctrl + Alt + Enter to replace all occurrences.

