# Saber Commerce Settings Developer Docs

## Settings API

Settings component provides endpoints for the WP REST API. Any active instance of Saber Commerce running on WordPress will expose these endpoints for the management of settings.

## Settings Defaults

Each setting field has a default. This can be an empty string defined by two single quotes ('') for inputs. For choice fields it should be a valid selection from the provided choices.

Settings defaults can be generated and exported as a JSON file. Defaults for native fields (fields provided by core Saber Commerce components) are provided in the setting-defaults.json file at the root of the Setting Component directory. 
