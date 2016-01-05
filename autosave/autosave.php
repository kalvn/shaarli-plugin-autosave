<?php

/**
 * Plugin autosave.
 */

function hook_autosave_render_footer($data)
{
    if($data['_PAGE_'] === 'edit_link'){

        $js = '';
        if(isset($GLOBALS['plugins']['AUTOSAVE_INTERVAL']) && preg_match('/[0-9]+/', $GLOBALS['plugins']['AUTOSAVE_INTERVAL'])){
            $js .= 'window.autosaveInterval = ' . $GLOBALS['plugins']['AUTOSAVE_INTERVAL'] . ';';
        }

        if(isset($GLOBALS['plugins']['AUTOSAVE_LIFETIME']) && preg_match('/[0-9]+/', $GLOBALS['plugins']['AUTOSAVE_LIFETIME'])){
            $js .= 'window.autosaveLifetime = ' . $GLOBALS['plugins']['AUTOSAVE_LIFETIME'] . ';';
        }

        if(isset($GLOBALS['plugins']['AUTOSAVE_FORMNAME']) && !empty($GLOBALS['plugins']['AUTOSAVE_FORMNAME'])){
            $js .= 'window.autosaveFormname = "' . $GLOBALS['plugins']['AUTOSAVE_FORMNAME'] . '";';
        }

        if(isset($GLOBALS['plugins']['AUTOSAVE_KEYNAME']) && !empty($GLOBALS['plugins']['AUTOSAVE_KEYNAME'])){
            $js .= 'window.autosaveKeyname = "' . $GLOBALS['plugins']['AUTOSAVE_KEYNAME'] . '";';
        }

        $data['text'][] = '<script type="text/javascript">' . $js . '</script>';
        $data['js_files'][] = PluginManager::$PLUGINS_PATH . '/autosave/autosave.min.js';
    }

    return $data;
}