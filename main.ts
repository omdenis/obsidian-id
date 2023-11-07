import { Plugin, TFile } from "obsidian";

export default class UniqueIdPlugin extends Plugin {
	async onload() {
		console.log("loading Unique-ID plugin");

		this.registerEvent(
			this.app.vault.on("modify", async (file: TFile) => {
				this.updateDocument(file);
			})
		);

		this.registerEvent(
			this.app.vault.on("create", async (file: TFile) => {
				setTimeout(async () => {
					this.updateDocument(file);
				}, 500);
			})
		);
	}

	async onunload() {
		console.log("unloading Unique-ID plugin");
	}

	async updateDocument(file: TFile) {
		// avoid adding to the text snippets and empty files
		const content = await this.app.vault.read(file);
		if (!content.startsWith("---")) return;
		if (content.contains("<%")) return;

		this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			if (!("id" in frontmatter)) {
				frontmatter["id"] = this.get_next_id();
			}

			const newDate = new Date().toISOString().split("T")[0];

			if (!("created" in frontmatter)) {
				frontmatter["created"] = newDate;
			}

			if (!("updated" in frontmatter)) {
				frontmatter["updated"] = newDate;
			}
		});
	}

	get_next_id() {
		let max_id = 0;
		for (let file of this.app.vault.getMarkdownFiles()) {
			const frontmatter =
				this.app.metadataCache.getFileCache(file)?.frontmatter;
			if (!frontmatter) continue;
			if (!frontmatter.id) continue;

			if (frontmatter.id != null && frontmatter.id > max_id)
				max_id = frontmatter.id;
		}
		return max_id + 1;
	}
}
