# Obsidian QMD Plugin

This plugin allows you to work with .qmd files in Obsidian by adding two custom commands:

- Convert QMD to MD: Flags all .qmd files in the vault, converts them to .md, and updates all links pointing to those .qmd files to point to the new .md paths.
- Convert MD to QMD: Converts files back to .qmd and updates the links to point to the .qmd paths.

This enables you to create, modify, and visualize .qmd files in Obsidian, including in the graph view.

For the plugin to work optimally, I recommend the following settings:

- Options -> Editor -> Properties in document -> Visible
- Options -> Files and links -> Use [[Wikilinks]] -> False
- Options -> Files and links -> Detect all file extensions -> True

Note: These custom commands might be slow if you have a large number of files in the vault.

## Install the plugin

1. Download the source from this github repo
2. Move the the source into .obsidian/plugins
3. Run npm install and npm run dev to install and build the plugin
