import { App, Modal, Setting } from "obsidian";

export class CreateSubTaskModal extends Modal 
{ 
  title: string;

  onSubmit: (title: string) => void;

  constructor
  (
    app: App,
    onSubmit: (title: string) => void
  ) 
  {
    super(app);
    this.title = "";
    this.onSubmit = onSubmit;
  }

  onOpen() 
  {
    const { contentEl } = this;
    contentEl.createEl("h3", { text: "Sub-task:" });

    const input_element = contentEl.createEl("input", 
    {
        attr: {
            type: "text",
            style: "width: 100%;",
            value: this.title
          }
    })

    input_element.addEventListener("change", (event) => 
    {        
        const input = event.target as HTMLInputElement;
        this.title = input.value ?? "";
    });

    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("Insert")
        .setCta()
        .onClick(() => 
        {
          this.close();
          this.onSubmit(this.title);
        })
    );
  }

  onClose() 
  {
    let { contentEl } = this;
    contentEl.empty();
  }
}