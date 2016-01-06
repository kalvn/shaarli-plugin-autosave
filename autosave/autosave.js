(function(){

    var interval = window.autosaveInterval || 30;
    var lifetime = window.autosaveLifetime || 18000; // 1000 * 3600 * 5 = 5h.
    var formName = 'linkform';
    var keyName = 'lf_url';
    var keyPrefix = 'autosave_';

    /**
     * Initializes the plugin by attaching events and setting the loop.
     */
    function init(){

        // Seconds to milliseconds.
        interval *= 1000;
        lifetime *= 1000;

        // If elements identified by names aren't found, the initialization is stopped.
        if(!document.querySelector('[name=' + formName + ']') || !document.querySelector('[name=' + keyName + ']')){
            console.error('Shaarli autosave plugin has incorrect parameters. Try removing parameters autosave_FORMNAME and autosave_KEYNAME via the plugin administration.');
            return;
        }

        if(hasSavedData()){
            var data = getSavedData();
            var date = new Date(data._autosaveTime);
            var dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            if(confirm('An existing draft from ' + dateStr + ' has been found for this link. Do you want to load it? Otherwise, this draft will be complitely erased.')){
                load();
            }
        }

        setInterval(function(){
            save();
        }, interval);

        // Listen to the submit event to save one last time before submitting the form to the server.
        document.querySelector('[name=' + formName + ']').addEventListener('submit', function(){
            save();
        });
    }

    /**
     * Returns the current timestamp in milliseconds.
     */
    function now(){
        return new Date().getTime();
    }

    /**
     * Gets current data from the form.
     */
    function getFormData(){
        var result = {};
        var fields = document.querySelectorAll('[name=linkform] [name]');

        for(var i in fields){
            var name = fields[i].name;
            // Excludes useless fields.
            if(['save_edit', 'cancel_edit', 'delete_link', 'token'].indexOf(name) < 0){
                if(typeof name === 'string' && name.length > 0){
                    if(fields[i].type === 'checkbox'){
                        result[name] = fields[i].checked;
                    } else if(fields[i].type === 'radio'){
                        if(fields[i].checked){
                            result[name] = fields[i].value;
                        }
                    } else{
                        result[name] = fields[i].value;
                    }
                }
            }
        }

        return result;
    }

    /**
     * Returns the correct storage key for the current link's url.
     */
    function getKey(){
        return keyPrefix + document.querySelector('[name=' + keyName + ']').value;
    }

    /**
     * Returns whether data exists for this URL or not.
     */
    function hasSavedData(){
        return localStorage.hasOwnProperty(getKey());
    }

    /**
     * Returns saved data if it exists.
     * @param key : defines the key to get data from. If null, uses the current link's key.
     */
    function getSavedData(key){
        if(!key){
            key = getKey();
        }
        if(hasSavedData(key)){
            return JSON.parse(localStorage.getItem(key));
        }
    }

    /**
     * Saves current form data in localstorage.
     */
    function save(){
        var data = getFormData();
        data['_autosaveTime'] = now();
        var key = getKey();

        if(typeof key === 'string' && key.length > keyPrefix.length && typeof data === 'object'){
            localStorage.setItem(key.trim(), JSON.stringify(data));

            console.log('Data saved');
        }

        removeOldEntries();
    }

    /**
     * Loads localStorage data into the form, if found.
     */
    function load(){
        var elements = document.querySelectorAll('[name=' + formName + '] [name]');
        var data = getSavedData();

        if(data){
            for(var i in elements){
                var el = elements[i];
                var name = el.name;
                if(data.hasOwnProperty(name)){
                    if(el.type === 'checkbox'){
                        el.checked = data[name];
                    } else if(el.type === 'radio'){
                        if(el.value === data[name]){
                            el.checked = true;
                        }
                    } else{
                        el.value = data[name];
                    }
                }
            }
        }
    }

    /**
     * Removes old entries. The lifetime of entries is defined by a parameter of the plugin.
     */
    function removeOldEntries(){
        for(key in localStorage){
            if(key.indexOf(keyPrefix) === 0){
                var data = getSavedData(key);
                if(now() - data._autosaveTime > lifetime){
                    localStorage.removeItem(key);

                    console.log('Key ' + key + ' removed.');
                }
            }
        }
    }

    init();
})();