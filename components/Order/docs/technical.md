# Order Component Technical Docs

## Component Description

Order Component provides the data model for an order. In Saber Commerce an order is an association between a cart and a payment. The order model itself does not contain products or other saleable items, as this is the concern of the Cart Component which houses carts and cart items.

## Cart Association

Carts associated with Orders are "locked" to prevent editing. This includes editing via the WP REST API. The "locked" status ensures the cart model instance serves as an archive and represents and accurate account of the products and other line items associated with the order.

## Orders Are Initiated by the Customer

The distinction between an Order versus an Invoice is that Orders are initiated and/or finalized by the customer using their cart and the checkout process. In contrast invoices are a type of order that are not created by the customer directly. Invoices either originate because the site owner or an agent creates them, or because automation generates them. Orders are handled through a "Cart & Checkout Flow" process, whereas invoices are handled through an "Invoice Payment" process.

## Order Model Schema 

id_order
id_account
id_user
id_cart
id_payment
status
created
updated
