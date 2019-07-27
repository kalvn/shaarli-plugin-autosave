<?php

use Shaarli\Plugin\PluginManager;

/**
 * Plugin autosave.
 */

function hook_autosave_render_footer($data, $config)
{
    if($data['_PAGE_'] === 'edit_link'){

        if(isset($config)){
            $autosaveInterval = $config->get('plugins.AUTOSAVE_INTERVAL');
            $autosaveLifetime = $config->get('plugins.AUTOSAVE_LIFETIME');
        } else{
            $autosaveInterval = isset($GLOBALS['plugins']['AUTOSAVE_INTERVAL']) ? $GLOBALS['plugins']['AUTOSAVE_INTERVAL'] : '';
            $autosaveLifetime = isset($GLOBALS['plugins']['AUTOSAVE_LIFETIME']) ? $GLOBALS['plugins']['AUTOSAVE_LIFETIME'] : '';
        }

        $js = '';
        if(!empty($autosaveInterval) && preg_match('/[0-9]+/', $autosaveInterval)){
            $js .= 'window.autosaveInterval = ' . $autosaveInterval . ';';
        }

        if(!empty($autosaveLifetime) && preg_match('/[0-9]+/', $autosaveLifetime)){
            $js .= 'window.autosaveLifetime = ' . $autosaveLifetime . ';';
        }

        $data['endofpage'][] = '<script type="text/javascript">' . $js . '</script>';
        $data['js_files'][] = PluginManager::$PLUGINS_PATH . '/autosave/autosave.min.js';
    }

    return $data;
}
