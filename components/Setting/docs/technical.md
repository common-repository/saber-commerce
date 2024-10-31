# Setting Component Technical Docs

## Terminology
Normally we use the singular "setting" instead of "settings" which works better for consistency with other data structures and in terms of object modeling and code automation. In some cases we will use the plural to specifically reference multiple "settings".

## Settings Profiles

We store settings profiles as a CPT "sacom_setting_profile". Settings are stored as post meta data.

## Default Handling

The setting-defaults.json file isn't very useful because it doesn't contain the defaults for extensions that hook into the field system, and even for the core fields it isn't based on the filtering instead it's a static list. This file needs to be generated and stored in wp-content/sacom/. We could generate it by looping over all the fields after filtering them.

## Hooks

### Filters

#### Filter Settings Pages

Use sacom_setting_page_register to register a new settings page and it's setting fields.
