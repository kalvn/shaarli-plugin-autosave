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

        $data['endofpage'][] = '<script type="text/javascript">' . $js . '</script>';
        $data['js_files'][] = PluginManager::$PLUGINS_PATH . '/autosave/autosave.js';
    }

    return $data;
}