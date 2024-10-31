=== Saber Commerce ===
Contributors: eatbuildplay
Donate link: https://saberwp.com/donate/
Tags: ecommerce, invoicing, time tracking
Requires at least: 5.7
Tested up to: 5.8
Requires PHP: 7.2
Stable tag: 1.4.2
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Saber Commerce is a next-generation eCommerce platform for WordPress.

== Description ==

Saber Commerce features a Gutenberg block-based approach optimized for FSE (Full Site Editing). It's next-generation eCommerce for building powerful, state-of-art eCommerce sites on the WordPress platform.

Saber Commerce provides invoicing and time tracking right in the WP Admin.

It integrates Stripe Payments so customers can pay your invoices online. Saber Commerce also provides a Customer Dashboard where your customers can view their invoices, payments and review time tracked to their account.

Latest release v1.4.2 includes Cart Blocks and Single Product Blocks. These are Gutenberg blocks that are used to construct the entire cart UX and single product UX. Future releases will include the next steps toward 100% block-coverage of all rendered output using granular blocks optimized for FSE (Full Site Editing). To test the FSE implementation, install an FSE (block theme) such as T11 Blocks.

Saber Commerce features an admin UX comprised of advanced editors that work as miniature applications right in the WP Admin. There are no page refreshes, and most data is saved automatically just like in most SaaS applications.

Saber Commerce now has some support for the sale of digital products. If your product does not require shipping, Saber Commerce is perfect for selling your digital goods, downloadable items, software licenses, access to content and much more.

Saber Commerce is a component-based system that uses modular architecture to enable maximum stability and exceptional support for external API integrations. Developers are encouraged to try it out and see the potential, there is a wide array of ways to work with Saber Commerce at a code level.

Here is some of the fun you can have tinkering with Saber Commerce:

* Connect to the Saber Commerce REST API and make PDF invoices on the fly.
* Pull down all active cart data and see shop activity in real-time with the Cart Component.
* Override the checkout template at the theme level.
* Use the field hook system to integrate custom fields.
* Build an extension plugin leveraging our PHP classes such as \SaberCommerce\Component.
* Integrate a 3rd party payment gateway by extending the \SaberCommerce\PaymentMethod class.
* Build React components for your React-enabled themes to display Saber Commerce data.

== Installation ==

1. The easiest way to install Saber Commerce is from the official WordPress plugins directory. From the WP Admin, visit the Plugins section and search for Saber Commerce.
2. Click the Install button to download the files to your WP site.
3. After the plugin is installed, click the Activate button to active Saber Commerce.

== Frequently Asked Questions ==

= Is Saber Commerce a replacement or alternative for WooCommerce? =

Yes if you don't need shipping. Currently Saber Commerce does not have a shipping calculation component. It is suitable for selling digital products, and time-based services using invoicing.

= Will Saber Commerce eventually support physical products? =

Yes. We are rapidly catching up to WooCommerce in our support for physical products.

= Is there a pro version of Saber Commerce? =

Not yet. Visit SaberWP.com for updates on the progress of the pro licensed version. The Saber Commerce dev roadmap has a pro version of Saber Commerce scheduled for release in August of 2021. Key features planned include enhanced reporting and improved customer portal, as well as 1-2 new objects such as Estimates and/or Purchase Orders.

= Does Saber Commerce have plans to build integration with accounting software? =

Currently we're focused on the core product with plans for the pro version release and support for products. Integrations with other solutions and SaaS systems is on the radar, but is not yet at the top of the list. We do intend to work on export and API (outbound) functionality in 2021, which may enable payments to be exported manually (or via API) from Saber Commerce, and then imported into the accounting software of your choice.

= What is the mission of the Saber Commerce plugin and it's development team? =

We want to provide a more comprehensive set of FINTECH software solutions for WP. We want the quality to be comparable to leading SaaS systems so that small businesses and entrepreneurs have an affordable option for using powerful tools to grow their business. We want to avoid the piece-meal approach of WooCommerce and create a more comprehensive and tightly integrated solution using modern technologies including React, NodeJS and more.

= Is there a SaaS version of Saber Commerce? =

There is a SaaS version of Saber Commerce in the works. Because Saber Commerce is already available (freely) to use in any WP site, the purpose of the SaaS is to enable multiple site support for WordPress site owners that run 2 or more sites. It's also potentially a way for start-ups to get started before their WP site is ready, or a way to temporarily prepare data before deployment. The SaaS version of Saber Commerce runs NodeJS and this will enable providing a desktop version using Electron.

= Does Saber Commerce work in multisite installations? =

Not currently. We have multisite support arriving in August of 2021. Until then our custom DB tables do not install properly on multisite so only the top level site will be able to store data.

== Screenshots ==

1. WP Admin Menu.
2. Dashboard view at WP Admin > Saber Commerce > Dashboard.
3. Payments list view.
4. Plugin activation view.
5. Checkout with Stripe Payments integration (shown in a dark version of TwentyTwentyOne).
6. Invoice action buttons for sending and downloading the invoice.
7. PDF invoice generated by Saber Commerce.
8. Invoice editor full view while editing a single invoice.
9. Timesheet editor, left side of editor where the timesheet is linked to an account, workspace and a billable rate is set.
10. Timesheet editor, editing a single timesheet with option to generate an invoice from the timesheet.
11. Timesheet items in list view.
12. Stripe payment integration. Stripe is support out-of-the-box with Saber Commerce.
13. Realtime cart monitoring report. This feature let's you see all the carts active on your site in real-time.
14. Time entry logging view.

== Changelog ==

= 1.4.2 =

Expansion of the available Gutenberg block set.

= 1.4.1 =

Expanded selection of Gutenberg blocks including blocks for checkout and customer portal.

= 1.3.8 =

Style fixes.

= 1.3.7 =

Adds new customer portal.

= 1.3.6 =

Hotfix for product add to cart failure.

= 1.3.5 =

Adds tax component. Adds more data model automation using React components.

= 1.3.4 =

* Improves checkout flow handling.
* Drafts security specifications.
* Includes improved hooks for extensions loading.

= 1.3.3 =

* Fixes to cart item subtotals.
* Adds realtime cart monitoring widget.
* Adds React support including webpack config and build enqueue.
* Adds ChartJS React project for reporting.
* Draft inclusion new Component Catalog to replace Product Component catalog creation in future versions.

= 1.3.2 =

* Refactored and extendable settings.
* Settings API endpoint added.
* All settings use gettext localization functions.

= 1.3.1 =

* Includes updates to WP Admin dashboard page.
* Moves dashboard widget to a base class and uses filter for extendable dashboard widgets.
* Adds WPCLI generated POT file for localization.
* Adds machine translations for Spanish strings.

= 1.3.0 =

Includes components to support sale of digital and downloadable products including the product component, checkout component, and introduction of cart orders model.

= 1.2.0 =

Includes fixes to invoice payment URL's and settings related to Stripe payments. Has textdomain loading and .pot file draft.

= 1.1.4 =

Fixes email send invoice params.

= 1.1.3 =

Fixes invoice line items by adding rate and quantity. Includes invoice conversion from timesheet. Includes numerous UX and styling fixes.

= 1.1.2 =

Updates to PDF invoice generation and timesheet to invoice conversion.

= 1.1.1 =

Draft PDF invoice template generation with DOMPDF library.

= 1.1.0 =

Contains fixes for the WordPress plugin review quality checks. Includes localization of scripts that were delivered by CDN.

= 1.0.1 =

* First release of Saber Commerce.

== Upgrade Notice ==

= 1.1.0 =

No upgrade notices.

= 1.0.1 =

* No upgrades have been made, this is the first release of Saber Commerce.
