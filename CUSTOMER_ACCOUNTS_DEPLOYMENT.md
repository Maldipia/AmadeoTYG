# Deployment Guide: Customer Accounts & Login

**Date:** January 28, 2026
**Version:** 5.0
**Feature:** Customer Accounts & Login System

---

## 🚀 Overview

This guide provides the step-by-step instructions for deploying the new **Customer Accounts & Login** feature to the Amadeo Marketplace production environment. This involves updating the Google Apps Script backend and deploying the new frontend files via Vercel.

**Please follow these steps carefully to ensure a smooth deployment.**

---

## 📋 Pre-Deployment Checklist

- [ ] **Code Review:** All new code has been reviewed and adheres to project standards.
- [ ] **Testing Completed:** All test cases in `CUSTOMER_ACCOUNTS_TESTING.md` have been executed and passed.
- [ ] **Backup:** A backup of the current `Code.gs` script has been made.
- [ ] **Backup:** The Google Sheets database has been backed up (File > Make a copy).

---

## ⚙️ Deployment Steps

### **Part 1: Update Backend (Google Apps Script)**

1.  **Open Google Apps Script Editor:**
    - Navigate to the Google Sheet that serves as the database for the marketplace.
    - Go to **Extensions > Apps Script** to open the script editor.

2.  **Replace Backend Code:**
    - Open the `Code.gs` file in the editor.
    - Delete the **entire existing content** of the script.
    - Open the updated `Code.gs` file from this project (`/home/ubuntu/amadeo-repo/Code.gs`).
    - Copy the **entire content** of the updated file.
    - Paste the new code into the Google Apps Script editor.

3.  **Save the Project:**
    - Click the **Save project** icon (floppy disk) in the Apps Script toolbar.

4.  **Deploy the New Version:**
    - Click the **Deploy** button in the top right corner.
    - Select **New deployment**.
    - In the "Select type" dialog, ensure **Web app** is selected.
    - For the "Description", enter: `v5.0 - Customer Accounts & Login Feature`.
    - Ensure "Execute as" is set to **Me**.
    - Ensure "Who has access" is set to **Anyone**.
    - Click **Deploy**.

5.  **Copy the New Web App URL:**
    - After deployment, a new Web app URL will be provided. **This URL should be the same as the previous one.**
    - Copy the URL and verify it matches the `API_BASE` variable in the frontend JavaScript files. It should be:
      ```
      https://script.google.com/macros/s/AKfycbzBw-bLMAooXcWvcCo0VHsndaC_RpaZz-xKNpGn-nljZ4H4fyKAerf7u12-SUFfOG2nAQ/exec
      ```

### **Part 2: Deploy Frontend (Vercel)**

*This process assumes the project is configured for automatic deployments from the `main` branch of the GitHub repository.*

1.  **Commit and Push Changes to GitHub:**
    - Ensure all updated frontend files have been committed to the local Git repository:
      - `index.html`
      - `account.html`
      - `signup.html`
      - `customer-login.html`
      - `CUSTOMER_ACCOUNTS_FEATURE.md`
      - `CUSTOMER_ACCOUNTS_TESTING.md`
      - `CUSTOMER_ACCOUNTS_DEPLOYMENT.md`
    - Push the commits to the `main` branch of the `Maldipia/AmadeoTYG` repository on GitHub.
      ```bash
      git push origin main
      ```

2.  **Monitor Vercel Deployment:**
    - Open the Vercel dashboard for the `amadeomarketplace` project.
    - A new deployment should be automatically triggered by the push to the `main` branch.
    - Monitor the build logs to ensure the deployment completes successfully.

3.  **Verify Deployment:**
    - Once the deployment is complete, navigate to the live site: https://www.amadeomarketplace.com
    - Perform a quick smoke test to ensure the new features are live and working as expected.

---

## ✅ Post-Deployment Verification

1.  **Database Schema Check:**
    - Open the Google Sheets database.
    - Verify that a new sheet named **`CustomerSessions`** has been automatically created after the first customer login.
    - Verify that the **`Orders`** sheet now has a `CustomerId` column.

2.  **Live Site Smoke Test:**
    - **Register a new account:** Go to `/signup` and create a test customer.
    - **Login:** Go to `/customer-login` and log in with the new account.
    - **View Account Page:** Confirm you are redirected to `/account` and can see the dashboard.
    - **Place an Order:** Add an item to the cart and complete a checkout while logged in.
    - **Check Order History:** Verify the new order appears in your account dashboard.
    - **Logout:** Click the logout button and confirm you are redirected to the login page.

---

## ⏪ Rollback Plan

If a critical issue is discovered after deployment, follow these steps to roll back:

1.  **Frontend Rollback (Vercel):**
    - In the Vercel dashboard, navigate to the **Deployments** tab.
    - Find the previous production deployment (before the v5.0 update).
    - Click the "..." menu and select **Redeploy** to instantly roll back to the previous version.

2.  **Backend Rollback (Google Apps Script):**
    - Open the Apps Script editor.
    - Replace the content of `Code.gs` with the backed-up version of the previous script.
    - Deploy a new version with a description like `v4.1 - Rollback from Customer Accounts`.

**Immediately investigate the cause of the issue in a separate development environment.**
