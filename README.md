# AgroSense AI - Project Features

## User Features

### Authentication & Profile
- **Registration & Login:** Secure user authentication system.
- **Profile Management:** Users can complete their profile and update settings (`ProfileCompletionPage`, `ProfileSettingsPage`).

### Dashboard
- **Main Dashboard:** personalized dashboard for farmers to access key information (`DashboardPage`).

### Crop Management
- **Crop Guide:** Detailed guides on growing specific crops (`CropGuidePage`).
- **Crop Risk Assessment:** Tools to assess risks associated with crop cultivation (`CropRiskPage`).

### Market Intelligence
- **Market Prices:** Real-time or updated market prices for various commodities (`MarketPricesPage`).

### Weather Services
- **Weather Forecast:** Detailed weather information to help farmers plan activities (`WeatherPage`).
- **Weather Alerts:** (Backend `WeatherAlertController`) Notifications for extreme weather.

### Support & Information
- **Contact Us:** Form for user inquiries (`ContactPage`).
- **Legal:** Privacy Policy and Terms of Service pages.

---

## Admin Features

### Authentication
- **Admin Login:** Dedicated login for administrators (`AdminAuthPage`).

### Dashboard
- **Admin Dashboard:** Overview of system statistics and activities (`AdminDashboardPage`).

### User Management
- **Manage Farmers:** View and manage registered farmer accounts (`AdminFarmersPage`).
- **User Requests:** Handle requests from users (`AdminUserRequestsPage`).

### Content Management
- **Crop Management:** Add, update, or remove crop information (`AdminCropsPage`).
- **Crop Guide Management:** Manage the content of crop guides (`AdminCropGuidePage`).
- **Fertilizer Management:** Manage fertilizer recommendations/database (`AdminFertilizerPage`).
- **Market Price Management:** Update market prices (`AdminMarketPricesPage`).

------------------------------------------------------------------------------------------------------


# 🛡️ Agro Sense AI — Admin Guide

Welcome to the **Agro Sense AI Admin Panel**. This guide covers all administrative features for managing the platform's data and users.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard](#2-dashboard)
3. [Crops Management](#3-crops-management)
4. [Crop Guides Management](#4-crop-guides-management)
5. [Market Prices Management](#5-market-prices-management)
6. [Fertilizer Management](#6-fertilizer-management)
7. [Farmers (View Only)](#7-farmers-view-only)
8. [User Requests](#8-user-requests)
9. [Signing Out](#9-signing-out)

---

## 1. Getting Started

### Admin Login

1. Navigate to `/admin/login`.
2. Enter your **Email** and **Password**.
3. Click **Sign In** to access the Admin Dashboard.

### Admin Registration

1. Navigate to `/admin/register`.
2. Fill in the registration form:
   - **Full Name** — Your name
   - **Email Address** — A valid email
   - **Phone Number** — Your contact number
   - **Password** — Minimum 6 characters
   - **Confirm Password** — Must match the password
3. Click **Create Account**.
4. After successful registration, log in with your credentials.

> 🔒 Admin accounts are separate from farmer accounts and use a different authentication system.

---

## 2. Dashboard

**Path:** `/admin`

The Admin Dashboard provides a high-level overview of the platform.

### Analytics Overview Cards:
| Card | Description |
|---|---|
| **Total Crops** | Number of crops registered in the system |
| **Total Districts** | Number of Sri Lankan districts configured |
| **Total Farmers** | Number of registered farmer accounts |
| **Fertilizer Recs** | Number of fertilizer recommendations available |

### Recent Market Prices:
- Displays the 5 most recent market price entries.
- Each entry shows crop name, district, price (LKR), and date.
- Click **"View All Market Prices →"** to go to the full Market Prices management page.

---

## 3. Crops Management

**Path:** `/admin/crops`

Manage the crops available on the platform.

### View Crops:
- All crops are listed with pagination (5 per page).
- Use the **search bar** to find a specific crop by name.

### Add a New Crop:
1. Type the crop name in the **"Add new crop name"** input field.
2. Click the **+ (Add)** button.
3. The crop is added and the list refreshes.

### Edit a Crop:
1. Click the **✏️ Edit** button on a crop row.
2. Modify the crop name.
3. Click **Save** to confirm changes.

### Delete a Crop:
1. Click the **🗑️ Delete** button on a crop row.
2. Confirm the deletion.
3. The crop and all associated data will be removed.

> ⚠️ Deleting a crop may affect related market prices, crop guides, and fertilizer recommendations.

---

## 4. Crop Guides Management

**Path:** `/admin/crop-guides`

Manage cultivation guidelines that farmers see in the Crop Guide page.

### View Guidelines:
- All guidelines are listed with search and filter options.
- **Filter by Type:** All, DO (recommended practices), or DON'T (practices to avoid).
- **Search** by description text.

### Add a New Guideline:
1. Fill in the form:
   - **Crop** — Select from the dropdown
   - **Growth Stage** — Select the applicable growth stage
   - **Guideline Type** — Choose **DO** or **DONT**
   - **Description** — Enter the guideline text
   - **Priority** — Set priority level (number)
2. Click **Add Guideline**.

### Edit a Guideline:
1. Click the **✏️ Edit** button on a guideline row.
2. The form populates with existing data.
3. Modify the fields and click **Update Guideline**.

### Delete a Guideline:
1. Click the **🗑️ Delete** button.
2. The guideline is permanently removed.

---

## 5. Market Prices Management

**Path:** `/admin/market-prices`

Manage crop market prices across districts.

### View Market Prices:
- All price entries are listed showing crop, district, price, and date.

### Add a New Price Entry:
1. Fill in the form:
   - **Crop** — Select from the dropdown
   - **District** — Select from the dropdown
   - **Price (LKR)** — Enter the market price
   - **Date** — Select the date for the price entry
2. Click **Add Price**.

### Edit a Price Entry:
1. Click the **✏️ Edit** button on a price row.
2. Modify the fields and click **Update**.

### Delete a Price Entry:
1. Click the **🗑️ Delete** button.
2. The price entry is permanently removed.

---

## 6. Fertilizer Management

**Path:** `/admin/fertilizer`

Manage fertilizer recommendations linked to specific crops.

### View Recommendations:
- All fertilizer recommendations are listed.

### Add a New Recommendation:
1. Fill in the form:
   - **Crop** — Select from the dropdown
   - **Fertilizer Name** — Name of the fertilizer (e.g., Urea, TSP, MOP)
   - **Fertilizer Type** — Type category (e.g., Nitrogen, Phosphorus, Potassium)
   - **Application Stage** — Growth stage for application (e.g., Basal, Top Dressing)
   - **Dosage per Hectare** — Recommended dosage (e.g., "50 kg/ha")
   - **Application Method** — How to apply (e.g., Broadcasting, Side Dressing)
   - **Notes** — Additional notes or instructions
2. Click **Add Recommendation**.

### Edit a Recommendation:
1. Click the **✏️ Edit** button.
2. The form scrolls into view and populates with existing data.
3. Modify the fields and click **Update Recommendation**.

### Delete a Recommendation:
1. Click the **🗑️ Delete** button.
2. The recommendation is permanently removed.

---

## 7. Farmers (View Only)

**Path:** `/admin/farmers`

View all registered farmer accounts on the platform.

### Features:
- **Farmer List** — Displays all farmers with their name, email, district, and primary crop.
- **Search** — Search by farmer name or email.
- **Pagination** — 10 farmers per page with page navigation.
- **Crop Color Coding** — Each crop is shown with a distinct color badge:
  - 🟢 Rice/Paddy — Green
  - 🟡 Maize — Yellow
  - 🔴 Tomato/Chili — Red
  - 🟣 Onion — Purple
  - 🟠 Rubber — Orange
  - 🔵 Cotton — Blue
  - Other crops — Gray

> ℹ️ This is a **read-only** page. Farmer accounts cannot be edited or deleted from the admin panel.

---

## 8. User Requests

**Path:** `/admin/user-requests`

Manage contact messages submitted by users through the Contact page.

### Message Statistics:
Three stat cards are displayed at the top:
| Stat | Description |
|---|---|
| **Total Messages** | Total number of contact messages received |
| **New Messages** | Messages that haven't been read yet |
| **Read Messages** | Messages that have been marked as read |

### View Messages:
- All messages are listed with sender name, email, subject, and status.
- **Filter by Status:** All, New (unread), or Read.
- **Search** by sender name, email, or subject.
- **Pagination** — 10 messages per page.

### Read a Message:
1. Click on a message row to open a **detail modal**.
2. The modal shows the full message content, sender details, and timestamp.
3. The message is automatically marked as **Read** when opened.

### Change Message Status:
- Click **"Mark as Unread"** to change a read message back to unread.
- Click **"Mark as Read"** to mark an unread message as read.

### Delete a Message:
1. Click the **🗑️ Delete** button on a message row.
2. The message is permanently removed.

---

## 9. Signing Out

To sign out of the Admin Panel:

1. Look at the **sidebar** on the left side of the screen.
2. At the bottom, click the red **"Sign Out"** button.
3. You will be redirected to the Admin Login page.
4. Your admin session tokens are cleared from the browser.

---

## Admin Sidebar Navigation

The sidebar is always visible on the left side and provides quick access to all admin pages:

| Icon | Label | Path |
|---|---|---|
| 📊 Dashboard | Dashboard | `/admin` |
| 🌱 Eco | Crops | `/admin/crops` |
| 📖 Menu Book | Crop Guides | `/admin/crop-guides` |
| 📈 Trending Up | Market Prices | `/admin/market-prices` |
| 🧪 Science | Fertilizer | `/admin/fertilizer` |
| 👥 Groups | Farmers | `/admin/farmers` |
| 📬 Contact Mail | User Requests | `/admin/user-requests` |
| 🚪 Logout | Sign Out | (redirects to `/admin/login`) |

---

## Quick Reference

| Action | Where |
|---|---|
| View platform stats | Dashboard (`/admin`) |
| Add/Edit/Delete crops | Crops (`/admin/crops`) |
| Manage crop cultivation guidelines | Crop Guides (`/admin/crop-guides`) |
| Add/Edit/Delete market prices | Market Prices (`/admin/market-prices`) |
| Manage fertilizer recommendations | Fertilizer (`/admin/fertilizer`) |
| View registered farmers | Farmers (`/admin/farmers`) |
| Handle contact messages | User Requests (`/admin/user-requests`) |

---

*Agro Sense AI Admin Panel — Managing Agricultural Intelligence for Sri Lanka* 🛡️


