# 📬 Project S.H.E. // Google Apps Script Dispatch Engine

This directory contains the complete, standalone Google Apps Script (`Code.gs`) that powers:
1. **Automated Google Sheets Record Logging**:
   - `Subscribers`: Records email, source, timestamp, and status.
   - `Reviews_Moderation`: Captures new public testimonials before moderation.
   - `Feedback_Suggestions`: Records confidential feedback and community suggestions.
2. **Awwwards-Level Responsive HTML Emails**:
   - **Subscriber Welcome Dispatch**: Dark brutalist luxury styling, crimson accents, Lady Justice manifesto, crisis contact lines, and direct portal link.
   - **Admin Instant Alerts**: Real-time notifications for incoming reviews, subscriber milestones, or urgent inquiries.
   - **Mass Broadcast Dispatcher**: Formatted directive broadcasts to all active subscribers.

---

## 🚀 60-Second Setup Guide

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name the spreadsheet: **`Project S.H.E. - Community Hub`**.

### Step 2: Open Apps Script Editor
1. In the top menu, click **Extensions** > **Apps Script**.
2. Erase any default template code inside `Code.gs`.
3. Copy the entire contents of [`Code.gs`](./Code.gs) and paste it into the editor.

### Step 3: Configure Settings (Top of `Code.gs`)
1. Change `ADMIN_EMAIL` to your organization's primary notification email (e.g. `projectshe.ngo@gmail.com`).
2. Update `SECRET_TOKEN` to match your secret (default: `she_secret_token_2026_goated`).
3. Click the **Save** floppy disk icon (or press `Ctrl + S` / `Cmd + S`).

### Step 4: Deploy as a Web App
1. At the top-right, click **Deploy** > **New deployment**.
2. Click the gear icon beside "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Project S.H.E. Dispatch Webhook`
   - **Execute as**: `Me (<your-email>)`
   - **Who has access**: `Anyone` *(crucial so your website can send subscriptions!)*
4. Click **Deploy**.
5. When prompted, click **Authorize access**, choose your Google account, click **Advanced**, and proceed to grant permissions.

### Step 5: Connect to Website
1. Copy the generated **Web App URL** (ends in `/exec`).
2. Paste it into your `.env.local` file:
   ```bash
   GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   GOOGLE_APPS_SCRIPT_TOKEN="she_secret_token_2026_goated"
   ```
3. That's it! Every new subscriber from the center modal or website forms will automatically log to your Google Sheet and receive the styled welcome email.
