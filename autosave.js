(function(){

var interval = window.autosaveInterval || 10;
var lifetime = window.autosaveLifetime || 18000; // 1000 * 3600 * 5 = 5h.
var formName = 'linkform';
var keyName = 'lf_url';
var keyPrefix = 'autosave_';

var isSaveAllowed = true;

var $shaarliAutosave = document.getElementById('shaarli-autosave');
var $shaarliAutosaveP = document.querySelector('#shaarli-autosave p');
var $shaarliAutosaveRestoreButton = document.getElementById('shaarli-autosave-restore');
var $shaarliAutosaveDiscardButton = document.getElementById('shaarli-autosave-discard');

/**
 * Initializes the plugin by attaching events and setting the loop.
 */
function init(){
    log('Initializing Shaarli Autosave...');

    // Seconds to milliseconds.
    interval *= 1000;
    lifetime *= 1000;

    // If elements identified by names aren't found, the initialization is stopped.
    if(!document.querySelector('[name=' + formName + ']') || !document.querySelector('[name=' + keyName + ']')){
        console.error('Shaarli autosave plugin has incorrect parameters. Try removing parameters autosave_FORMNAME and autosave_KEYNAME via the plugin administration.');
        return;
    }

    if(hasSavedData()){
        log('Previously saved content found for this link!');

        var data = getSavedData();
        var date = new Date(data._autosaveTime);
        var dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        var dateFromNow = null;
        var moment = window.moment || null;

        if (moment) {
            var dateFromNow = moment(date).fromNow();
        }

        if (isSavedDataAndFormDataDifferent()) {
            // Stop saving content until the user decides whether we wants to retore or not.
            isSaveAllowed = false;
            $shaarliAutosaveP.innerHTML = 'An existing draft from <strong>' + dateStr + (dateFromNow ? ' (' + dateFromNow + ')' : '') + '</strong> has been found for this link. Do you want to load it? Otherwise, this draft will be completely erased. <br>Saving is paused until you take a decision.';
            $shaarliAutosave.style.display = 'block';

            $shaarliAutosaveRestoreButton.addEventListener('click', function () {
                load();
                isSaveAllowed = true;
                $shaarliAutosave.style.display = 'none';
            });

            $shaarliAutosaveDiscardButton.addEventListener('click', function () {
                isSaveAllowed = true;
                $shaarliAutosave.style.display = 'none';
            });
        }

        // if(isSavedDataAndFormDataDifferent() && confirm('An existing draft from ' + dateStr + ' has been found for this link. Do you want to load it? Otherwise, this draft will be complitely erased.')){
        //     load();
        // }
    }

    setInterval(function(){
        save();
    }, interval);

    // Listen to the submit event to save one last time before submitting the form to the server.
    document.querySelector('[name=' + formName + ']').addEventListener('submit', function(){
        save();
    });

    // Try to save before leaving the page.
    window.onbeforeunload = function () {
        save();
    };
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
        if(['save_edit', 'cancel_edit', 'delete_link', 'token', 'returnurl'].indexOf(name) < 0){
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

            if(result[name]){
                result[name] = result[name];
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
 * Check whether saved data and form data are different to avoid unnecessary popup.
 */
function isSavedDataAndFormDataDifferent(){
    var savedData = getSavedData();
    var formData = getFormData();

    delete(savedData._autosaveTime);
    delete(formData.item);

    return JSON.stringify(savedData) !== JSON.stringify(formData);
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
    if (!isSaveAllowed) {
        log('Save was temporarily disabled until you decide what to do with previously saved content.');
        return;
    }

    var data = getFormData();
    data['_autosaveTime'] = now();
    var key = getKey();

    if(typeof key === 'string' && key.length > keyPrefix.length && typeof data === 'object'){
        localStorage.setItem(key.trim(), JSON.stringify(data));

        log('Content saved.');
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

                log('Key ' + key + ' removed.');
            }
        }
    }
}

function log (message) {
    console.log('Shaarli Autosave: ' + message);
}

init();

})();