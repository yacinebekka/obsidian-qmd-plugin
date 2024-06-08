import { Plugin, TFile, Notice } from 'obsidian';

export default class QuartoPlugin extends Plugin {
    async onload() {
        this.registerExtensions(['qmd'], 'markdown');
        this.addCommand({
            id: 'rename-qmd-to-md',
            name: 'Convert QMD to MD',
            callback: () => this.renameQmdToMd()
        });

        this.addCommand({
            id: 'convert-md-to-qmd',
            name: 'Convert MD to QMD',
            callback: () => this.convertMdToQmd()
        });
    }

    async renameQmdToMd() {
        const files = this.app.vault.getFiles();
        let linksToUpdate = new Map();

        // First collect all qmd files and prepare new paths
        files.forEach(file => {
            if (file.extension === 'qmd') {
                const newPath = file.path.replace(/\.qmd$/, '.md');
                linksToUpdate.set(file.path, newPath);
            }
        });

        // Update content and rename files

        for (const file of files) {
            let content = await this.app.vault.read(file);
            let modified = false;

            // Update links in all files
            linksToUpdate.forEach((newPath, oldPath) => {
                let linkRegex = new RegExp(`\\[\\[(${this.escapeRegex(oldPath.replace(/\.qmd$/, ''))})(\\|[^\\]]+)?\\]\\]`, 'g');

                if (content.match(linkRegex)) {
                    content = content.replace(linkRegex, `[[${newPath.replace(/\.md$/, '')}$2]]`);
                    modified = true;
                }
            });

            if (modified) {
                await this.app.vault.modify(file, content);
            }

            // Specifically rename qmd to md if it's one of those files
            if (linksToUpdate.has(file.path)) {
                await this.app.fileManager.renameFile(file, linksToUpdate.get(file.path));

                // Add or adjust frontmatter to indicate file was originally qmd
                let fileContent = await this.app.vault.read(file);
                const frontMatterExists = fileContent.startsWith('---');
                const newFrontMatter = `isQMD: true\n`;
                
                if (frontMatterExists) {
                    fileContent = fileContent.replace(/---/, `---\n${newFrontMatter}`);
                } else {
                    fileContent = `---\n${newFrontMatter}---\n` + fileContent;
                }
                
                await this.app.vault.modify(file, fileContent);

                new Notice(`Converted ${file.basename} to .md and updated links.`);
            }
        }
    }

    async convertMdToQmd() {
        const files = this.app.vault.getFiles();
        let linksToUpdate = new Map();

        // First collect all md files marked as isQMD and prepare new paths
        for (const file of files) {
            if (file.extension === 'md') {
                let content = await this.app.vault.read(file);
                if (content.includes('isQMD: true')) {
                    const newPath = file.path.replace(/\.md$/, '.qmd');
                    linksToUpdate.set(file.path, newPath);
                }
            }
        }

        // Update content and rename files
        for (const file of files) {
            let content = await this.app.vault.read(file);
            let modified = false;

            // Update links in all files
            linksToUpdate.forEach((newPath, oldPath) => {
                let linkRegex = new RegExp(`\\[\\[(${this.escapeRegex(oldPath.replace(/\.md$/, ''))})(\\|[^\\]]+)?\\]\\]`, 'g');
                if (content.match(linkRegex)) {
                    content = content.replace(linkRegex, `[[${newPath.replace(/\.qmd$/, '')}$2]]`);
                    modified = true;
                }
            });

            if (modified) {
                await this.app.vault.modify(file, content);
            }

            // Specifically rename md to qmd if it's one of those files
            if (linksToUpdate.has(file.path)) {
                await this.app.fileManager.renameFile(file, linksToUpdate.get(file.path));
                
                // Remove the isQMD property
                let updatedContent = await this.app.vault.read(file);
                updatedContent = updatedContent.replace(/\n?isQMD: true\n?/, ''); // Removing the isQMD line
                await this.app.vault.modify(file, updatedContent);

                new Notice(`Converted ${file.basename} to .qmd and updated links.`);
            }
        }
    }

    escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}


