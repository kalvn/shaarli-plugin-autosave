# Shaarli AutoSave

Shaarli AutoSave is a plugin for the famous [Shaarli application](https://github.com/shaarli/shaarli).

It automatically saves data when editing a link to avoid any loss in case of crash or unexpected shutdown.


## Installation without the plugin administration page
Copy the `autosave` folder in the `plugins` directory of your Shaarli installation.
Then, edit the `data/config.php` file and add `autosave` in the array `$GLOBALS['config']['ENABLED_PLUGINS']`. It'll look like this (potentially with other plugins):

```php
$GLOBALS['config']['ENABLED_PLUGINS'] = array (
  'autosave'
);
```

## Installation with the plugin administration page
If your Shaarli installation is recent enough to have the plugin administration page, you just have to copy the `autosave` folder in the `plugins` folder.

Then, go to the plugin administration page, check `autosave` and save.


## Configure

You can configure either via the plugin administration if you have it or via the `data/config.php` file in which you need to add lines with the following format (for each parameter you want to set):

```php
$GLOBALS['plugins']['<PARAMETER_NAME>'] = PARAMETER_VALUE;
```

`AUTOSAVE_INTERVAL` [default: 30] interval of time between each save, in seconds.

`AUTOSAVE_LIFETIME` [default: 18000] lifetime of saved data, in seconds. After this time, data is automatically erased to avoid taking too much space with outdated data.

`AUTOSAVE_FORMNAME` [default: 'linkform'] the name attribute of the form tag as defined in the theme you use. You probably won't have to change this but in case you use a very custom theme, you may have to touch this.

`AUTOSAVE_KEYNAME` [default: 'lf_url'] the name of the form input field for the URL which is used as a unique key to define to which link is saved data related. You shouldn't have to change this either.


## Important notice
Please keep in mind that the save is purely local. It uses the local storage of your browser, nothing is saved on the server.
It means that if you open a link previously saved on another browser, you won't have access to saved data.
It also means that if you clear the local data of your browser, your local content will be lost.
This behavior may evolve in the future if Shaarli provide an API or something to make it easier.


## TODO
- Adding events to enable theme developer to display information and controls for the plugin.
- Finding a workaround for when you save a link, edit it again and get the popup which make no sense in such case. Deleting local data when saving is not an option because I have no way to know the data has been saved properly, on the editlink page.
