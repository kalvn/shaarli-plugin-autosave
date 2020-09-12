# Shaarli AutoSave
Shaarli AutoSave is a plugin for the famous [Shaarli application](https://github.com/shaarli/shaarli).

It automatically saves data when editing a link to avoid any loss in case of crash or unexpected shutdown.


## Compatibility
- v2.X.X is compatible with Shaarli v0.12.X and above.
- v1.X.X is compatible with Shaarli v0.11.X and below.


## Installation
### Via Git
Run the following command from the `plugins` folder of your Shaarli installation:

```bash
git clone https://github.com/kalvn/shaarli-plugin-autosave autosave
```

It'll create the `autosave` folder.

### Manually
Create the folder `plugins/autosave` in your Shaarli installation.
Download the ZIP file of this repository and copy all files in the newly created folder.


## Activation
If your Shaarli installation is recent enough to have the plugin administration page, you just need to go to the plugin administration page, check `autosave` and save.


## Configure
You can configure either via the plugin administration if you have it or via the `data/config.php` file.

`AUTOSAVE_INTERVAL` [default: 10] interval of time between each save, in seconds.

`AUTOSAVE_LIFETIME` [default: 18000] lifetime of saved data, in seconds. After this time, data is automatically erased to avoid taking too much space with outdated data.


## Update
I you installed it through Git, run the following command from within this plugin's folder `plugins/autosave`:

```shell
git pull
```

Otherwise, download the ZIP file again from Github and override existing files with new ones.


## Important notice
Please keep in mind that the save is purely local. It uses the local storage of your browser, nothing is saved on the server.
It means that if you open a link previously saved on another browser, you won't have access to saved data.
It also means that if you clear the local data of your browser, your local content will be lost.
This behavior may evolve in the future if Shaarli provides an API to make it easier.

