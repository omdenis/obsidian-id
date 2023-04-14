import { Editor, MarkdownView, Plugin, TFile } from 'obsidian';
import { CreateSubTaskModal } from 'src/CreateSubTaskDialog';

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

		this.addCommand({
			id: 'obsidian-id-create-sub-task-command',
			name: 'Create sub-task',

			callback: () => 
			{
				const active_note = this.app.workspace.getActiveFile();
				if (active_note == null) 
					return;

				this.get_id(active_note).then(id => 
					{
						if (id == null) 
							return;

						const onSubmit = (title: string) => 
						{
							this.get_next_id().then(next_id => 
								{
									const new_filename = title.replace(/:/g, "-").replace(/\?/g, " ");
									const now = (new Date()).toISOString().split('T')[0]; 
									const sub_task_content = `---\npriority: 10\nid: ${next_id}\nparent: ${id}\nalias: '${title}'\ncreated: ${now}\n---\nup:: [[${active_note.name.replace(".md", "")}]]\n\n`;
									this.app.vault.create(`notes/tasks/${next_id} - ${new_filename}.md`, sub_task_content);

									this.app.vault.read(active_note).then(active_note_content =>
										{
											const query = "```dataview\nTABLE priority, state\nWHERE parent=" + id + " SORT priority ASC\n```";
											if(active_note_content.includes(query))
												return;

											active_note_content = active_note_content + "\n\n\n" + query;
											this.app.vault.adapter.write(active_note.path, active_note_content).then(() => 
											{
												;
											});		
										});
								})	
						};

						new CreateSubTaskModal(this.app, onSubmit).open();
					})
					.catch(error => 
					{
						console.error(error);
					});

			},

		});
	}

	async updateUniqueId(file: TFile)
	{
		if(!await this.is_valid_note(file))
			return;

		let text = await this.app.vault.read(file);
		let lines = text.split('\n');
		const new_id = await this.get_next_id();
		lines.splice(1, 0, `id: ${new_id}`);
		text = lines.join('\n');		

		await this.app.vault.adapter.write(file.path, text);		
	}
	
	async get_next_id() 
	{
		let max_id = 0;		
		for (let file of this.app.vault.getMarkdownFiles()) 
		{
			const id = await this.get_id(file);
			if(id != null && id > max_id)
				max_id = id;
		}
		return max_id + 1;
	}

	async get_id(file: TFile)
	{
		let content = await this.app.vault.cachedRead(file);
		let match = content.match(/^id:\s*(\d+)/im);
		if (match && match[1]) 
		{
			let id = parseInt(match[1]);
			return id;
		}

		return null;
	}

	async is_valid_note(file: TFile) 
	{
		let text = await this.app.vault.read(file);
		if(text.toLocaleLowerCase().includes("tp.date.now"))
			return false;

		if(text.length < 6)
			return false;
			
		if (!text.startsWith('---')) 
			return false;

		let match = text.match(/^id:\s*(\d+)/im);
		if (match && match[1]) 
			return false;
		
		let lines = text.split('\n');
		if(lines.length < 3 && lines[1].startsWith("id: "))
			return false;

		return true;
	}
}



