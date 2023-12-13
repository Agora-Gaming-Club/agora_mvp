# Admin Page Documentation

- View the admin page at [https://dev.agoragaming.gg/admin/](https://dev.agoragaming.gg/admin/)
- You will see 3 sections on the left side: ADMIN_APP, API, and AUTHENTICATION AND AUTHORIZATION
  - ADMIN_API: Represent the objects in a nice view that a staff member will most likely be most interested in
  - API: Contains the raw objects. Modify with care.
  - AUTHETNICATION AND AUTHORIZATION: Contains objects that represent the raw form of the User objects

The majority of staff member tasks will be Adding Games, Settling Disputes, and Paying out winners.

### Adding a new Platform

1. Click on "Platforms" in the ADMIN_API section.
2. Click "ADD PLATFORM +" in upper right side.
3. Type out platform's name in the box and hit SAVE

### Adding a new Game Name

1. Click on "Game Names" in the ADMIN_API section.
2. Click "ADD GAME NAME +" in upper right side.
3. Type out Game's name in the box and hit SAVE

### Adding a new Term

1. Click on "Terms" in the ADMIN_API section.
2. Click "ADD TERM +" in upper right side.
3. Type out Terms's conditions in the box and hit SAVE

### Adding a new Game

1. Click on "Games" in the ADMIN_API section.
2. Select a Platform, Game and Terms, and fill out the Discord link, and hit SAVE

## Settling a Wager Dispute

1. Click on "Wager Disputes" in the ADMIN_API section.
2. You will see all Wageres in the "Disputed" status, and who voted for who.
3. Select a Wager that you want to Resolve (You can see Who voted for who, below.)
4. Select a Winner using the magnifying glass (using the evidence given to you) and fill out the winning amt.
5. Change the "Status" to "Completed", and click SAVE.
6. This will put the Wager into the Payouts section in  the ADMIN_APP.

## Paying out a winner

1. Click "Payouts" in the ADMIN_API section.
2. You can sort on the right side by if they were paid or not. So select "No" to only show non-paid wagers.
3. Once you find one that you want to pay out, Click on it.
4. Grab the winner PayPal username/email and the winning amount. 
5. Pay the user, and enter the PayPal payment ID inside of the PayPal payment ID field and hit Save. Do this to each one that is ready to pay.
6. Back at the Payouts overview, select the boxes next to the payouts that you just marked PayPal payment ID on and then select under the action box "Mark Wagers as paid"
7. Click "go" and it will change the Winner Paid to a green checkmark, marking them down as paid in our system, and sending off an SMS to them notifying them of their payout.