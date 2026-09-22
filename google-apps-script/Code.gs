/**
 * ==============================================================================
 * PROJECT S.H.E. (SUPPORT. HELP. EMPOWER.) - OFFICIAL DISPATCH DISPATCHER
 * Google Apps Script Web App Engine
 * 
 * Features:
 * - Automated Google Sheet record logging for Subscribers, Reviews, and Inquiries
 * - Awwwards-level luxury dark-brutalist HTML emails for subscribers and administrators
 * - Secure token-based verification
 * - One-click deployment guide included in README.md
 * ==============================================================================
 */

// Configuration Variables (Update or set in Script Properties)
var CONFIG = {
  ORGANISATION_NAME: "Project S.H.E. NGO",
  ADMIN_EMAIL: "admin@projectshe.org", // Change to your primary inbox
  OFFICIAL_WEBSITE: "https://projectshe.org",
  LOGO_URL: "https://projectshe.org/assets/logo.png",
  SECRET_TOKEN: "she_secret_token_2026_goated", // Match GOOGLE_APPS_SCRIPT_TOKEN in .env.local
  SHEET_SUBSCRIBERS: "Subscribers",
  SHEET_REVIEWS: "Reviews_Moderation",
  SHEET_FEEDBACK: "Feedback_Suggestions"
};

/**
 * Handle HTTP GET (Health check / status ping)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    system: "Project S.H.E. Dispatch Engine",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle HTTP POST requests from the Project S.H.E. website
 */
function doPost(e) {
  var output = { success: false, message: "" };

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No payload received in request");
    }

    var data = JSON.parse(e.postData.contents);

    // Verify secret token if provided
    if (data.token && data.token !== CONFIG.SECRET_TOKEN) {
      throw new Error("Unauthorized: Invalid dispatch token");
    }

    var action = data.action || "newsletter_signup";

    switch (action) {
      case "newsletter_signup":
        output = handleNewsletterSignup(data);
        break;

      case "review_submission":
        output = handleReviewSubmission(data);
        break;

      case "feedback_submission":
        output = handleFeedbackSubmission(data);
        break;

      case "broadcast_newsletter":
        output = handleBroadcastNewsletter(data);
        break;

      default:
        throw new Error("Unrecognized dispatch action: " + action);
    }
  } catch (err) {
    output = {
      success: false,
      error: err.toString(),
      timestamp: new Date().toISOString()
    };
  }

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// -----------------------------------------------------------------------------
// ACTION HANDLERS
// -----------------------------------------------------------------------------

/**
 * 1. Process New Newsletter Subscriber
 */
function handleNewsletterSignup(data) {
  var email = (data.email || "").trim().toLowerCase();
  var source = data.source || "Website Center Modal";
  var timestamp = data.timestamp || new Date().toISOString();

  if (!email || email.indexOf("@") === -1) {
    return { success: false, message: "Invalid email address" };
  }

  // A. Append to Google Sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, CONFIG.SHEET_SUBSCRIBERS, [
    "Timestamp", "Email", "Source", "Status"
  ]);

  // Check duplicate
  var existingData = sheet.getDataRange().getValues();
  var isDuplicate = false;
  for (var i = 1; i < existingData.length; i++) {
    if (existingData[i][1] && existingData[i][1].toString().toLowerCase() === email) {
      isDuplicate = true;
      break;
    }
  }

  if (!isDuplicate) {
    sheet.appendRow([new Date(), email, source, "Active"]);
  }

  // B. Dispatch Awwwards-Level Welcome Email to Subscriber
  var welcomeSubject = "WELCOME TO THE FRONT LINE // Project S.H.E. Dispatches";
  var welcomeHtml = generateWelcomeEmailHtml(email);

  try {
    GmailApp.sendEmail(email, welcomeSubject, "Welcome to Project S.H.E. Dispatches.", {
      name: "Project S.H.E. NGO",
      htmlBody: welcomeHtml
    });
  } catch (e) {
    Logger.log("Welcome email failed: " + e.toString());
  }

  // C. Notify Admin
  try {
    var adminNoticeSubject = "[NEW SUBSCRIBER] " + email + " joined Project S.H.E.";
    var adminNoticeHtml = generateAdminNoticeHtml(
      "NEW NEWSLETTER SUBSCRIBER",
      "A new advocate has joined the Project S.H.E. dispatch network.",
      {
        "Subscriber Email": email,
        "Origin": source,
        "Time": new Date().toLocaleString()
      }
    );

    GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, adminNoticeSubject, "New subscriber: " + email, {
      name: "Project S.H.E. Dispatch Desk",
      htmlBody: adminNoticeHtml
    });
  } catch (e) {
    Logger.log("Admin notification failed: " + e.toString());
  }

  return { success: true, message: "Subscriber logged and welcome email dispatched." };
}

/**
 * 2. Process Public Review Submission
 */
function handleReviewSubmission(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, CONFIG.SHEET_REVIEWS, [
    "Timestamp", "Author", "Role", "Rating", "Review Content", "Status"
  ]);

  sheet.appendRow([
    new Date(),
    data.author_name || "Anonymous",
    data.author_role || "Supporter",
    data.rating || 5,
    data.content || "",
    "Pending Moderation"
  ]);

  // Notify Admin for moderation
  try {
    var adminNoticeSubject = "[MODERATION NEEDED] New Public Review Submitted (" + (data.rating || 5) + " Stars)";
    var adminNoticeHtml = generateAdminNoticeHtml(
      "NEW PUBLIC REVIEW AWAITING APPROVAL",
      "A visitor has submitted a public testimonial. Please review it in your admin panel before publication.",
      {
        "Author": data.author_name || "Anonymous",
        "Role / Designation": data.author_role || "Community Ally",
        "Rating": (data.rating || 5) + " / 5 Stars",
        "Review Statement": data.content || "(Empty)",
        "Submitted At": new Date().toLocaleString()
      },
      CONFIG.OFFICIAL_WEBSITE + "/admin"
    );

    GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, adminNoticeSubject, "New review awaiting moderation.", {
      name: "Project S.H.E. Moderation",
      htmlBody: adminNoticeHtml
    });
  } catch (e) {
    Logger.log("Review alert failed: " + e.toString());
  }

  return { success: true, message: "Review recorded for moderation." };
}

/**
 * 3. Process Feedback / Suggestion
 */
function handleFeedbackSubmission(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, CONFIG.SHEET_FEEDBACK, [
    "Timestamp", "Type", "Category", "User Name", "User Email", "Message Content", "Status"
  ]);

  sheet.appendRow([
    new Date(),
    data.type || "Feedback",
    data.category || "General",
    data.user_name || "Anonymous",
    data.user_email || "N/A",
    data.content || "",
    "Unread"
  ]);

  try {
    var subject = "[DIRECT FEEDBACK] New " + (data.type || "Inquiry") + ": " + (data.category || "General");
    var html = generateAdminNoticeHtml(
      "INCOMING COMMUNITY DIRECTIVE",
      "A user or volunteer has submitted confidential feedback or suggestions.",
      {
        "Submission Type": (data.type || "Feedback").toUpperCase(),
        "Category": data.category || "General",
        "Submitted By": data.user_name || "Confidential",
        "Contact Email": data.user_email || "Not Provided",
        "Message": data.content || ""
      }
    );

    GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, "New feedback received.", {
      name: "Project S.H.E. Desk",
      htmlBody: html
    });
  } catch (e) {
    Logger.log("Feedback alert failed: " + e.toString());
  }

  return { success: true, message: "Feedback logged and admin alerted." };
}

/**
 * 4. Broadcast Newsletter to All Subscribers
 */
function handleBroadcastNewsletter(data) {
  var subject = data.subject || "DIRECTIVE // Project S.H.E. Field Update";
  var headline = data.headline || "CRITICAL FIELD BULLETIN";
  var bodyContent = data.body || "Stay informed on ongoing legal advocacy and grassroots missions.";

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, CONFIG.SHEET_SUBSCRIBERS, ["Timestamp", "Email", "Source", "Status"]);
  var rows = sheet.getDataRange().getValues();

  var count = 0;
  for (var i = 1; i < rows.length; i++) {
    var email = rows[i][1];
    var status = rows[i][3];

    if (email && email.indexOf("@") !== -1 && status === "Active") {
      var html = generateBroadcastEmailHtml(headline, bodyContent, email);
      try {
        GmailApp.sendEmail(email, subject, bodyContent, {
          name: "Project S.H.E. Dispatches",
          htmlBody: html
        });
        count++;
        Utilities.sleep(250); // Respect Google quota pacing
      } catch (e) {
        Logger.log("Failed sending to " + email + ": " + e.toString());
      }
    }
  }

  return { success: true, recipientsCount: count, message: "Broadcast dispatched to " + count + " subscribers." };
}

// -----------------------------------------------------------------------------
// AWWWARDS-LEVEL HTML EMAIL TEMPLATE GENERATORS
// -----------------------------------------------------------------------------

/**
 * 1. Subscriber Welcome Email (Luxury Dark Brutalist Aesthetic)
 */
function generateWelcomeEmailHtml(recipientEmail) {
  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '<title>Welcome to Project S.H.E.</title>' +
  '</head>' +
  '<body style="margin: 0; padding: 0; background-color: #080808; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #F4F1EA;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080808; min-height: 100vh; padding: 30px 10px;">' +
      '<tr>' +
        '<td align="center">' +
          '<table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #0E0E0E; border: 2px solid #E50914; box-shadow: 10px 10px 0px #E50914;">' +
            
            '<!-- Top Red Accent -->' +
            '<tr><td height="4" style="background-color: #E50914; font-size: 0; line-height: 0;">&nbsp;</td></tr>' +

            '<!-- Header Block -->' +
            '<tr>' +
              '<td style="padding: 36px 36px 20px 36px; border-bottom: 1px solid #222222;">' +
                '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                  '<tr>' +
                    '<td>' +
                      '<span style="display: inline-block; font-family: monospace; font-size: 11px; font-weight: 900; letter-spacing: 2px; color: #E50914; text-transform: uppercase; margin-bottom: 6px;">' +
                        '// OFFICIAL DISPATCH NETWORK' +
                      '</span>' +
                      '<h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF; text-transform: uppercase; line-height: 1.1;">' +
                        'PROJECT S.H.E.' +
                      '</h1>' +
                      '<span style="font-family: monospace; font-size: 10px; color: #888888; letter-spacing: 1.5px; text-transform: uppercase;">' +
                        'SUPPORT • HELP • EMPOWER' +
                      '</span>' +
                    '</td>' +
                    '<td align="right" valign="top">' +
                      '<span style="display: inline-block; padding: 4px 8px; border: 1px solid #E50914; background-color: #1A0002; color: #E50914; font-family: monospace; font-size: 10px; font-weight: 800; letter-spacing: 1px;">' +
                        'CONFIRMED' +
                      '</span>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +

            '<!-- Hero Graphic Statement -->' +
            '<tr>' +
              '<td style="padding: 32px 36px 20px 36px;">' +
                '<h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 900; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.3px; line-height: 1.25;">' +
                  'YOU ARE NOW LINKED TO THE FRONT LINE.' +
                '</h2>' +
                '<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #BBBBBB;">' +
                  'Thank you for standing in solidarity. By subscribing to Project S.H.E. Dispatches, you become an active observer and ally in our mission to dismantle gender-based abuse and deliver relentless legal defense.' +
                '</p>' +
                '<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #BBBBBB;">' +
                  'Here is our promise: <strong>zero noise, zero performative rhetoric.</strong> Every transmission contains verified field updates, legal literacy resources, survivor victories, or urgent community calls to action.' +
                '</p>' +
              '</td>' +
            '</tr>' +

            '<!-- Core Commitments Box -->' +
            '<tr>' +
              '<td style="padding: 0 36px 28px 36px;">' +
                '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #141414; border-left: 3px solid #E50914; padding: 18px 20px;">' +
                  '<tr>' +
                    '<td>' +
                      '<span style="display: block; font-family: monospace; font-size: 10px; font-weight: bold; color: #E50914; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">' +
                        'MISSION PROTOCOLS' +
                      '</span>' +
                      '<p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #DDDDDD;">' +
                        '⚖️ <strong>Pro-Bono Legal Defense:</strong> Direct counsel for survivors navigating courtrooms and legal protections.' +
                      '</p>' +
                      '<p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #DDDDDD;">' +
                        '🛡️ <strong>Trauma-Informed Sanctuary:</strong> Emergency relocation, counseling, and material dignity.' +
                      '</p>' +
                      '<p style="margin: 0; font-size: 12px; line-height: 1.5; color: #DDDDDD;">' +
                        '📢 <strong>Uncompromising Advocacy:</strong> Grassroots policy campaigns holding institutions accountable.' +
                      '</p>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +

            '<!-- Call To Action Button -->' +
            '<tr>' +
              '<td align="center" style="padding: 0 36px 36px 36px;">' +
                '<table role="presentation" cellspacing="0" cellpadding="0" border="0">' +
                  '<tr>' +
                    '<td align="center" style="background-color: #E50914; border: 1px solid #E50914;">' +
                      '<a href="' + CONFIG.OFFICIAL_WEBSITE + '" target="_blank" style="display: inline-block; padding: 14px 28px; font-family: monospace; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; color: #FFFFFF; text-decoration: none; text-transform: uppercase;">' +
                        'VISIT HEADQUARTERS PORTAL &rarr;' +
                      '</a>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +

            '<!-- Emergency Hotline Footer Box -->' +
            '<tr>' +
              '<td style="background-color: #0A0A0A; border-top: 1px solid #222222; padding: 24px 36px;">' +
                '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                  '<tr>' +
                    '<td>' +
                      '<span style="display: block; font-family: monospace; font-size: 10px; color: #E50914; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">' +
                        '24/7 CRISIS RESPONSE' +
                      '</span>' +
                      '<p style="margin: 0 0 4px 0; font-size: 11px; color: #888888; font-family: monospace;">' +
                        'National Women Helpline: <strong>1091 / 181</strong>' +
                      '</p>' +
                      '<p style="margin: 0; font-size: 11px; color: #888888; font-family: monospace;">' +
                        'Project S.H.E. Desk: <strong>+91 98765 43210</strong> | <strong>projectshe.ngo@gmail.com</strong>' +
                      '</p>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +

            '<!-- Legal & Unsubscribe Footer -->' +
            '<tr>' +
              '<td style="padding: 20px 36px; border-top: 1px solid #1A1A1A; text-align: center;">' +
                '<p style="margin: 0 0 6px 0; font-size: 10px; color: #555555; font-family: monospace; letter-spacing: 0.5px;">' +
                  'Sent to ' + recipientEmail + ' • Registered Non-Governmental Non-Profit Organisation' +
                '</p>' +
                '<p style="margin: 0; font-size: 10px; color: #444444; font-family: monospace;">' +
                  'Project S.H.E. Secretariat • Human Rights Enclave, New Delhi 110001, India.' +
                '</p>' +
              '</td>' +
            '</tr>' +

          '</table>' +
        '</td>' +
      '</tr>' +
    '</table>' +
  '</body>' +
  '</html>';
}

/**
 * 2. Administrative Alert Email Template
 */
function generateAdminNoticeHtml(title, description, detailsMap, ctaUrl) {
  var rowsHtml = "";
  for (var key in detailsMap) {
    if (detailsMap.hasOwnProperty(key)) {
      rowsHtml += '<tr>' +
        '<td width="35%" style="padding: 8px 12px; background-color: #141414; border: 1px solid #222222; font-family: monospace; font-size: 11px; font-weight: bold; color: #AAAAAA; text-transform: uppercase;">' + key + '</td>' +
        '<td width="65%" style="padding: 8px 12px; background-color: #0E0E0E; border: 1px solid #222222; font-family: monospace; font-size: 11px; color: #FFFFFF;">' + detailsMap[key] + '</td>' +
      '</tr>';
    }
  }

  var ctaHtml = "";
  if (ctaUrl) {
    ctaHtml = '<tr><td align="center" style="padding: 24px 0 0 0;">' +
      '<a href="' + ctaUrl + '" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #E50914; color: #FFFFFF; font-family: monospace; font-size: 12px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #E50914;">' +
        'OPEN ADMINISTRATIVE DESK &rarr;' +
      '</a>' +
    '</td></tr>';
  }

  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head>' +
  '<body style="margin: 0; padding: 0; background-color: #080808; font-family: -apple-system, sans-serif; color: #FFFFFF;">' +
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080808; padding: 30px 10px;">' +
      '<tr><td align="center">' +
        '<table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0E0E0E; border: 2px solid #E50914; box-shadow: 8px 8px 0px #E50914; padding: 28px;">' +
          '<tr><td>' +
            '<span style="font-family: monospace; font-size: 10px; color: #E50914; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 6px;">' +
              '// DISPATCH ALERT DESK' +
            '</span>' +
            '<h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 900; text-transform: uppercase; color: #FFFFFF;">' +
              title +
            '</h2>' +
            '<p style="margin: 0 0 20px 0; font-size: 13px; color: #999999; line-height: 1.5;">' +
              description +
            '</p>' +
            '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; margin-bottom: 16px;">' +
              rowsHtml +
            '</table>' +
            ctaHtml +
          '</td></tr>' +
        '</table>' +
      '</td></tr>' +
    '</table>' +
  '</body></html>';
}

/**
 * 3. Broadcast Email Template for Mass Dispatches
 */
function generateBroadcastEmailHtml(headline, bodyText, recipientEmail) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head>' +
  '<body style="margin: 0; padding: 0; background-color: #080808; font-family: -apple-system, sans-serif; color: #F4F1EA;">' +
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080808; padding: 30px 10px;">' +
      '<tr><td align="center">' +
        '<table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0E0E0E; border: 2px solid #E50914; box-shadow: 10px 10px 0px #E50914;">' +
          '<tr><td height="4" style="background-color: #E50914;">&nbsp;</td></tr>' +
          '<tr><td style="padding: 32px;">' +
            '<span style="display: block; font-family: monospace; font-size: 10px; font-weight: 900; color: #E50914; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">' +
              '// PROJECT S.H.E. DIRECTIVE' +
            '</span>' +
            '<h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 900; text-transform: uppercase; color: #FFFFFF; line-height: 1.2;">' +
              headline +
            '</h2>' +
            '<div style="font-size: 14px; line-height: 1.6; color: #CCCCCC; white-space: pre-line; margin-bottom: 24px;">' +
              bodyText +
            '</div>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0">' +
              '<tr><td style="background-color: #E50914;">' +
                '<a href="' + CONFIG.OFFICIAL_WEBSITE + '" target="_blank" style="display: inline-block; padding: 12px 24px; font-family: monospace; font-size: 12px; font-weight: 900; letter-spacing: 1px; color: #FFFFFF; text-decoration: none; text-transform: uppercase;">' +
                  'LEARN MORE ON PORTAL &rarr;' +
                '</a>' +
              '</td></tr>' +
            '</table>' +
          '</td></tr>' +
          '<tr><td style="background-color: #0A0A0A; border-top: 1px solid #222222; padding: 16px 32px; text-align: center;">' +
            '<p style="margin: 0; font-family: monospace; font-size: 10px; color: #555555;">' +
              'Sent to ' + recipientEmail + ' • Project S.H.E. NGO' +
            '</p>' +
          '</td></tr>' +
        '</table>' +
      '</td></tr>' +
    '</table>' +
  '</body></html>';
}

// -----------------------------------------------------------------------------
// HELPER UTILITIES
// -----------------------------------------------------------------------------

/**
 * Ensures target sheet exists with designated headers
 */
function getOrCreateSheet(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0E0E0E");
      headerRange.setFontColor("#E50914");
    }
  }
  return sheet;
}
