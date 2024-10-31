## Settings

### Settings Presets

* By default all shops will have taxes "turned on".
* By default tax calculations will be done automatically based on the "Business Location" settings.

### Price Tax Exclusivity
Enter prices inclusive or exclusive of tax.
Default - exclusive.

### Shipping tax classes default setting.

This can (likely) be overridden per product.

### Rounding

Optionally round at the subtotal level instead of per line.

### Price display suffix.

Text to display after product price to indicate tax included for instance.

### Display tax total

Itemized or as a single total combined.


## Tax Rate Schema

ID
Tax Class ID [FK]
Country Code
State Code
Postal or Zip
City
Rate %
Tax Name
Priority
Compound
Shipping

## Tax Class Schema

ID
Title
Description
