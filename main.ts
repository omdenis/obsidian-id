import { Plugin, TFile } from 'obsidian';

interface UniqueIdPluginSettings 
{
	next_id: string;
}

const DEFAULT_SETTINGS: UniqueIdPluginSettings = 
{
	next_id: '1'
}

export default class UniqueIdPlugin extends Plugin 
{
	settings: UniqueIdPluginSettings;

	async onload() 
	{
		await this.loadSettings();

		
		this.registerEvent(this.app.vault.on('modify', async (file: TFile) => 
		{	
			this.updateUniqueId(file);
		}));

		this.registerEvent(this.app.vault.on('create', async (file: TFile) => 
		{	
			setTimeout(async () => { this.updateUniqueId(file); }, 500);
		}));
		  

	}

	async loadSettings() 
	{
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() 
	{
		await this.saveData(this.settings);
	}

	async updateUniqueId(file: TFile)
	{
		const new_id = parseInt(this.settings.next_id) + 1;		
		
		// Add meta-data with unique ID
		let text = await this.app.vault.read(file);
		if (text.startsWith('---')) 
		{
			// Add the new line with ID
			let lines = text.split('\n');

			// ID is already defined
			if(lines.length > 3 && lines[1].startsWith("id: "))
				return;
				
			lines.splice(1, 0, `id: ${new_id}`);
			text = lines.join('\n');
		}
		else
		{
			// Create the meta-data section and add the unique ID
			text = `---\nid: ${new_id}\n---\n${text}`;
		}

		// Save the file with the new ID
		await this.app.vault.adapter.write(file.path, text);
		
		// Save the next ID
		this.settings.next_id = new_id.toString();		
		await this.saveSettings();
	}
}
