

## Plan: Add Payment Wireframe Flow to Game Joining

### What This Does
When a user taps "Join Game", instead of immediately joining, they'll see a **payment sheet** with card, Apple Pay, and Google Pay options. After confirming payment, they see a **confirmation screen** showing the event details and a list of players already in the game.

This is a **UI wireframe only** — no real payment processing. The flow simulates the payment experience.

### Flow
```text
[Join Game button] → [Payment Sheet slides up] → [Confirm & Pay] → [Success Screen with player list]
```

### Changes

**1. New component: `src/components/PaymentSheet.tsx`**
A bottom sheet modal triggered when user taps "Join Game" on the Game Detail page. Contains:
- Game summary (sport emoji, title, date, price placeholder e.g. "€5.00")
- Payment method selector (radio-style cards):
  - 💳 Credit/Debit Card (mock card input fields)
  - Apple Pay
  - Google Pay
- "Confirm & Pay €5.00" gold button
- Close/back button

**2. New component: `src/components/PaymentConfirmation.tsx`**
Shown after tapping "Confirm & Pay". Contains:
- Green checkmark animation
- "Payment confirmed! 🎉"
- Game title, date, location
- **Player list** — names of all participants already joined (fetched from `game_participants` + `profiles`)
- "You're in!" badge
- "View Game Chat" button → navigates to game detail
- "Back to Home" button

**3. Modify `src/pages/GameDetailPage.tsx`**
- Replace direct `handleJoin` call with opening the PaymentSheet
- On payment "confirmation" (simulated), execute the existing join logic (insert into `game_participants`, update count)
- Then show PaymentConfirmation overlay with the player list

### Technical Details
- No real Stripe/payment integration — purely UI wireframe
- Reuses existing join logic (`game_participants` insert + `games` update)
- Player list in confirmation pulled from existing `participants` state
- Both components use the app's dark theme with gold (#d4a017) accents
- Sheet uses fixed positioning with backdrop blur, matching the existing confirmation modal pattern in BookPage

