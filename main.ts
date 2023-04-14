import { Plugin, TFile } from 'obsidian';

export default class UniqueIdPlugin extends Plugin 
{
	async onload() 
	{
		this.registerEvent(this.app.vault.on('modify', async (file: TFile) => 
		{	
			this.updateUniqueId(file);
		}));

		this.registerEvent(this.app.vault.on('create', async (file: TFile) => 
		{	
			setTimeout(async () => { this.updateUniqueId(file); }, 500);
		}));
	}

	async updateUniqueId(file: TFile)
	{
		if(!await this.is_valid_note(file))
			return;

		const new_id = await this.get_next_id();
		let text = await this.app.vault.read(file);
		if (text.startsWith('---')) 
		{
			let lines = text.split('\n');
			if(lines.length > 3 && lines[1].startsWith("id: "))
				return;
			lines.splice(1, 0, `id: ${new_id}`);
			text = lines.join('\n');
		}
		else
		{
			text = `---\nid: ${new_id}\n---\n${text}`;
		}
		await this.app.vault.adapter.write(file.path, text);		
	}
	
	async get_next_id() 
	{
		// References
		// * https://marcus.se.net/obsidian-plugin-docs/vault

		let max_id = 0;		
		for (let file of this.app.vault.getMarkdownFiles()) 
		{
			let content = await this.app.vault.cachedRead(file);
			let match = content.match(/^id:\s*(\d+)/im);
			if (match && match[1]) 
			{
				let id = parseInt(match[1]);
				if (id > max_id) 
					max_id = id;
			}
		}
		return max_id + 1;
	}

	async is_valid_note(file: TFile) 
	{
		let text = await this.app.vault.read(file);
		if(text.toLocaleLowerCase().includes("tp.date.now"))
			return false;

		if(text.length < 6)
			return false;
			
		let match = text.match(/^id:\s*(\d+)/im);
		if (match && match[1]) 
			return false;
		
		return true;
	}
}



