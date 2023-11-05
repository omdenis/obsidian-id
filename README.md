# Obsidian Unique ID Plugin

This plugin is designed for use with Obsidian (https://obsidian.md), and it adds an 'id' meta-data to any note. The ID will be automatically incremented the next time a note is created, ensuring that each document can be uniquely identified by its ID. This feature can be quite useful, especially for those who want to easily reference specific notes within their Obsidian vault.

![](images/example2.png)

# Quick guideline

1. Install and activate the plugin in Obsidian.
2. Create a new note and check its metadata for a unique ID generated by the plugin.
3. Use the ID to reference the note later.
4. The plugin will automatically generate new IDs for each new note you create.

Additionally you could use such snippet for daily notes

```dataview
TABLE 
WHERE contains(string(created), "<% tp.date.now("YYYY-MM-DD") %>")  OR contains(string(updated), "<% tp.date.now("YYYY-MM-DD") %>")
SORT file.mtime DESC
```


# How to use

How to Use the Plugin:

1. Install and activate the plugin in your Obsidian vault. This can usually be done by opening the settings menu and navigating to the "Community plugins" tab.

2. Create a new note within your Obsidian vault. You can do this by clicking on the "New Note" button in the top-left corner of the interface or by using the keyboard shortcut Ctrl/Cmd + N.

3. Once the new note has been created, take a look at its metadata. You should see a new "id" meta item that has been automatically generated by the plugin. This ID will be unique to this particular note and can be used to reference it later on.

4. You can now start working on your note as usual. The ID generated by the plugin will be automatically incremented the next time you create a new note, ensuring that each note in your vault has a unique identifier.

5. If you ever need to reference a specific note within your Obsidian vault, simply locate its unique ID within the metadata and use it to quickly find the note you need.

Overall, this plugin is a simple but powerful tool that can help you keep track of your notes more easily and efficiently. By automatically generating unique IDs for each note you create, it makes it easy to quickly locate and reference specific notes within your Obsidian vault.

# Bonus

Getting unique ID you could make obsidian like project management tool.

If you're looking for a way to implement a project management system in Obsidian that's similar to those used by Azure or Jira, you might want to consider using the obsidian-db-folder plugin, which is available on https://github.com/RafaelGB/obsidian-db-folder 

![](images/example1.png)

This plugin allows you to create a folder structure within your Obsidian vault that's designed specifically for project management. Each folder represents a different project, and within each folder, you can create separate notes for tasks, subtasks, milestones, and more. You can also add tags and other metadata to each note to help keep track of its status and progress.

With this setup, you can easily visualize your entire project at a glance, monitor progress, and make adjustments as needed. 

