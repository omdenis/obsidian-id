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

			callback: () => {
				console.log("Hey, you!");
			  },
			  
			editorCallback: (editor: Editor, view: MarkdownView) => 
			{
				const file = this.app.workspace.getActiveFile();
				if (file == null) 
					return;

				this.get_id(file).then(id => 
					{
						if (id == null) 
							return;

						const onSubmit = (title: string) => 
						{
							this.get_next_id().then(next_id => 
								{
									title = title.replace(/:/g, "-").replace(/\?/g, " ");

									const sub_task_content = `---\nid: ${next_id}\nref: ${id}\ntitle: ${title}\n---\n`;
									this.app.vault.create(`notes/tasks/${next_id} ${title}.md`, sub_task_content);

									const currentPos = editor.getCursor();
									const currentLine = editor.getLine(currentPos.line);
									const currentLineEnd = currentLine.length;
							
									editor.replaceRange("\n\n```dataview\nTABLE title, state\nWHERE ref=" + id + "\n```", { line: currentPos.line, ch: currentLineEnd });
								})
	
						};

						new CreateSubTaskModal(this.app, onSubmit).open();
					})
					.catch(error => 
					{
						console.error(error);
					});


			}
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



