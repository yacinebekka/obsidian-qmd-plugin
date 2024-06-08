# Obsidian QMD Plugin

Plugin that allow to works with .qmd file in Obsidian by adding two custom command :

- Convert QMD to MD : Flag all .qmd files in the vault, converts them to .md and update all links going to those .qmd file to point to new .md path
- Convert MD to QMD : Converts back files to .qmd and reupdate the links to point to .qmd

This allow to create/modify .qmd file in Obsidian and also to visualize them in the graph view.

In order for the plugin to works optimally i recommedn the below settings :
- Options -> Editor -> Properties in document -> Visible
- Options -> Files and links -> Use [[Wikilinks]] -> False
- Options -> Files and links -> Detect all file extensions -> True

Note : Those custom command might be slow if have larger number of files in the vault.
