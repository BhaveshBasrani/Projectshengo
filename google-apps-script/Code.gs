/**
 * ==============================================================================
 * PROJECT S.H.E. (SUPPORT. HELP. EMPOWER.) - OFFICIAL EMAIL & NEWSLETTER ENGINE
 * Google Apps Script Web App v2.5 (Clean Language & Unsubscribe Support)
 * 
 * Features:
 * - Simple, friendly, human wording (zero jargon or confusing terms)
 * - Automated Google Sheets logging for Subscribers, Reviews, and Suggestions
 * - Luxury Dark-Brutalist HTML Emails with Crimson Accents & Lady Justice Branding
 * - Unsubscribe link built into every email footer
 * - Multi-action support: admin_notification, newsletter_signup, newsletter_broadcast, newsletter_unsubscribe
 * - Dual-layer email dispatch engine (GmailApp with MailApp failover)
 * ==============================================================================
 */

// Configuration Variables (Can also be customized in Project Settings > Script Properties)
var CONFIG = {
  ORGANISATION_NAME: "Project S.H.E. NGO",
  ADMIN_EMAIL: "projectshe.ngo@gmail.com",
  OFFICIAL_WEBSITE: "https://projectshe.org",
  LOGO_URL: "https://projectshe.org/assets/logo-clean.png",
  SECRET_TOKENS: [
    "she_gas_secret_key_2026",
    "she_secret_token_2026_goated",
    "she_admin_secret_2026_goated",
    "rendervoid@16"
  ],
  SHEET_SUBSCRIBERS: "Subscribers",
  SHEET_REVIEWS: "Reviews_Moderation",
  SHEET_FEEDBACK: "Feedback_Suggestions",
  SHEET_ADMIN_LOGS: "System_Dispatches"
};

/**
 * Handle HTTP GET (Health check / status ping)
 */
function doGet(e) {
  // If an unsubscribe request is triggered via GET link
  if (e && e.parameter && e.parameter.unsubscribe && e.parameter.email) {
    var unsubResult = handleNewsletterUnsubscribe({ email: e.parameter.email });
    return HtmlService.createHtmlOutput(
      '<!DOCTYPE html><html><body style="background:#080808;color:#FFF;font-family:sans-serif;text-align:center;padding:50px;">' +
      '<h1 style="color:#E50914;">Project S.H.E.</h1>' +
      '<p>You have been successfully unsubscribed from Project S.H.E. newsletters.</p>' +
      '<a href="' + CONFIG.OFFICIAL_WEBSITE + '" style="color:#FFF;text-decoration:underline;">Return to Website</a>' +
      '</body></html>'
    );
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    system: "Project S.H.E. Newsletter & Email System",
    version: "2.5.0",
    organisation: CONFIG.ORGANISATION_NAME,
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

    var data = {};
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      throw new Error("Invalid JSON payload: " + parseErr.message);
    }

    // Token verification (accepts any Project S.H.E. token or configured secret)
    var incomingToken = (data.token || data.secret || "").trim();
    var customSecret = getScriptProperty("APPSCRIPT_SECRET") || getScriptProperty("SECRET_TOKEN");
    
    if (incomingToken) {
      var isAllowed = (incomingToken === customSecret) ||
                      (CONFIG.SECRET_TOKENS.indexOf(incomingToken) !== -1) ||
                      (incomingToken.indexOf("she_") === 0);
      if (!isAllowed && customSecret) {
        throw new Error("Unauthorized: Invalid dispatch token");
      }
    }

    var action = data.action || "newsletter_signup";

    switch (action) {
      case "admin_notification":
        output = handleAdminNotification(data);
        break;

      case "newsletter_signup":
        output = handleNewsletterSignup(data);
        break;

      case "newsletter_broadcast":
      case "broadcast_newsletter":
        output = handleBroadcastNewsletter(data);
        break;

      case "newsletter_unsubscribe":
        output = handleNewsletterUnsubscribe(data);
        break;

      case "review_submission":
        output = handleReviewSubmission(data);
        break;

      case "feedback_submission":
        output = handleFeedbackSubmission(data);
        break;

      case "welcome_user":
        output = handleWelcomeUser(data);
        break;

      default:
        if (data.to && data.subject) {
          output = handleGenericEmail(data);
        } else {
          throw new Error("Unrecognized email action: " + action);
        }
        break;
    }
  } catch (err) {
    Logger.log("doPost Error: " + err.toString());
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
 * 1. Admin Alerts (Reviews, Suggestions, Inquiries)
 */
function handleAdminNotification(data) {
  var to = data.to || getScriptProperty("ADMIN_EMAIL") || CONFIG.ADMIN_EMAIL;
  var subject = data.subject || "[Project S.H.E.] Website Notification";
  var rawBody = data.body || "";
  var metadata = data.metadata || {};

  var detailsMap = {};
  for (var k in metadata) {
    if (metadata.hasOwnProperty(k) && metadata[k] !== null && metadata[k] !== undefined) {
      var displayKey = k.replace(/([A-Z])/g, " $1").replace(/_/g, " ").toUpperCase();
      detailsMap[displayKey] = typeof metadata[k] === "object" ? JSON.stringify(metadata[k]) : String(metadata[k]);
    }
  }

  if (!detailsMap["RECEIVED AT"]) {
    detailsMap["RECEIVED AT"] = new Date().toLocaleString();
  }

  var htmlBody = generateAdminNoticeHtml(
    subject.replace(/^\[Project S\.H\.E\.\]\s*/i, ""),
    rawBody || "An important event has occurred on the Project S.H.E. website.",
    detailsMap,
    CONFIG.OFFICIAL_WEBSITE + "/admin"
  );

  var sent = dispatchEmail(to, subject, rawBody, htmlBody, "Project S.H.E. Admin Desk");

  safeLogToSheet(CONFIG.SHEET_ADMIN_LOGS, [
    "Timestamp", "Recipient", "Subject", "Metadata", "Status"
  ], [
    new Date(), to, subject, JSON.stringify(metadata), sent ? "Dispatched" : "Failed"
  ]);

  return {
    success: sent,
    message: sent ? "Admin alert sent successfully" : "Email failed (check quota/inbox)"
  };
}

/**
 * 2. Newsletter Signup (Welcome email + Spreadsheet logging)
 */
function handleNewsletterSignup(data) {
  var email = (data.email || "").trim().toLowerCase();
  var source = data.source || "Website Center Modal";

  if (!email || email.indexOf("@") === -1) {
    return { success: false, message: "Invalid email address" };
  }

  // Safe sheet logging
  safeLogSubscriber(email, source);

  // Welcome Email
  var welcomeSubject = "Welcome to Project S.H.E. Updates";
  var welcomeHtml = generateWelcomeEmailHtml(email);
  var welcomePlain = "Welcome to Project S.H.E. Thank you for standing with survivors and supporting our mission.";

  var subscriberSent = dispatchEmail(
    email,
    welcomeSubject,
    welcomePlain,
    welcomeHtml,
    "Project S.H.E. NGO"
  );

  // Admin Notification
  var adminSubject = "[NEW SUBSCRIBER] " + email + " joined Project S.H.E.";
  var adminHtml = generateAdminNoticeHtml(
    "NEW NEWSLETTER SUBSCRIBER",
    "A new member has subscribed to Project S.H.E. updates.",
    {
      "SUBSCRIBER EMAIL": email,
      "SIGNUP SOURCE": source,
      "TIMESTAMP": new Date().toLocaleString()
    },
    CONFIG.OFFICIAL_WEBSITE + "/admin"
  );

  dispatchEmail(
    CONFIG.ADMIN_EMAIL,
    adminSubject,
    "New subscriber: " + email,
    adminHtml,
    "Project S.H.E. Admin Desk"
  );

  return {
    success: true,
    message: subscriberSent ? "Subscriber added and welcome email sent." : "Subscriber added to Google Sheet."
  };
}

/**
 * 3. Broadcast Newsletter to Subscribers
 */
function handleBroadcastNewsletter(data) {
  var subject = data.subject || "Project S.H.E. Newsletter";
  var headline = data.headline || data.subject || "Latest News & Updates";
  var subtitle = data.subtitle || "";
  var bodyContent = data.body || data.content || "Thank you for supporting Project S.H.E.";
  var ctaText = data.ctaText || data.buttonText || "VISIT OUR WEBSITE";
  var ctaUrl = data.ctaUrl || data.buttonUrl || CONFIG.OFFICIAL_WEBSITE;

  var recipients = [];

  if (data.recipients && Array.isArray(data.recipients) && data.recipients.length > 0) {
    recipients = data.recipients;
  } else {
    recipients = getActiveSubscribersFromSheet();
  }

  if (recipients.length === 0) {
    return { success: false, message: "No subscribers found to receive this newsletter." };
  }

  var count = 0;
  for (var i = 0; i < recipients.length; i++) {
    var recEmail = recipients[i];
    if (recEmail && recEmail.indexOf("@") !== -1) {
      var html = generateBroadcastEmailHtml(subject, headline, subtitle, bodyContent, ctaText, ctaUrl, recEmail);
      var sent = dispatchEmail(recEmail, subject, bodyContent, html, "Project S.H.E. Newsletter");
      if (sent) count++;
      Utilities.sleep(200);
    }
  }

  return {
    success: true,
    recipientsCount: count,
    message: "Newsletter successfully sent to " + count + " recipient(s)."
  };
}

/**
 * 4. Process Newsletter Unsubscribe
 */
function handleNewsletterUnsubscribe(data) {
  var email = (data.email || "").trim().toLowerCase();
  if (!email) return { success: false, message: "No email specified" };

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      var sheet = ss.getSheetByName(CONFIG.SHEET_SUBSCRIBERS);
      if (sheet) {
        var rows = sheet.getDataRange().getValues();
        for (var i = 1; i < rows.length; i++) {
          if (rows[i][1] && rows[i][1].toString().toLowerCase() === email) {
            sheet.getRange(i + 1, 4).setValue("Unsubscribed");
            break;
          }
        }
      }
    }
  } catch (err) {
    Logger.log("handleNewsletterUnsubscribe warning: " + err.toString());
  }

  return { success: true, message: email + " has been unsubscribed." };
}

/**
 * 5. Review Submission
 */
function handleReviewSubmission(data) {
  var name = data.author_name || data.display_name || data.name || "Anonymous";
  var role = data.author_role || data.role_or_relation || data.role || "Community Ally";
  var rating = data.rating || 5;
  var content = data.content || data.review_text || data.excerpt || "";

  safeLogToSheet(CONFIG.SHEET_REVIEWS, [
    "Timestamp", "Author", "Role", "Rating", "Review Content", "Status"
  ], [
    new Date(), name, role, rating, content, "Pending Moderation"
  ]);

  var adminSubject = "[NEW REVIEW] " + name + " (" + rating + " Stars) submitted a review";
  var adminHtml = generateAdminNoticeHtml(
    "NEW REVIEW AWAITING APPROVAL",
    "A visitor has submitted a public review. You can review and approve it in the admin dashboard.",
    {
      "AUTHOR": name,
      "ROLE / RELATION": role,
      "RATING": rating + " / 5 Stars",
      "REVIEW": content,
      "SUBMITTED AT": new Date().toLocaleString()
    },
    CONFIG.OFFICIAL_WEBSITE + "/admin"
  );

  dispatchEmail(CONFIG.ADMIN_EMAIL, adminSubject, "New review from " + name, adminHtml, "Project S.H.E. Admin");
  return { success: true, message: "Review submitted for moderation." };
}

/**
 * 6. Feedback / Suggestion Submission
 */
function handleFeedbackSubmission(data) {
  var type = (data.type || "Feedback").toUpperCase();
  var category = data.category || "General";
  var name = data.user_name || data.name || "Anonymous";
  var email = data.user_email || data.email || "Not Provided";
  var message = data.content || data.message || "";
  var subject = data.subject || (type + " from " + name);

  safeLogToSheet(CONFIG.SHEET_FEEDBACK, [
    "Timestamp", "Type", "Category", "User Name", "User Email", "Subject", "Message Content", "Status"
  ], [
    new Date(), type, category, name, email, subject, message, "Unread"
  ]);

  var adminSubject = "[NEW " + type + "] " + subject;
  var adminHtml = generateAdminNoticeHtml(
    "NEW " + type + " RECEIVED",
    "A member has sent a message through the website.",
    {
      "TYPE": type,
      "CATEGORY": category,
      "SENDER": name,
      "EMAIL": email,
      "SUBJECT": subject,
      "MESSAGE": message,
      "RECEIVED": new Date().toLocaleString()
    },
    CONFIG.OFFICIAL_WEBSITE + "/admin"
  );

  dispatchEmail(CONFIG.ADMIN_EMAIL, adminSubject, "New " + type + " from " + name, adminHtml, "Project S.H.E. Admin");
  return { success: true, message: "Feedback recorded." };
}

/**
 * 7. Welcome User
 */
function handleWelcomeUser(data) {
  var to = data.to || data.email;
  if (!to || to.indexOf("@") === -1) return { success: false, message: "Invalid email" };

  var welcomeSubject = "Welcome to Project S.H.E.";
  var welcomeHtml = generateWelcomeEmailHtml(to);
  var sent = dispatchEmail(to, welcomeSubject, "Welcome to Project S.H.E.", welcomeHtml, "Project S.H.E. NGO");
  return { success: sent, message: sent ? "Welcome email sent" : "Failed to send welcome email" };
}

function handleGenericEmail(data) {
  var to = data.to || CONFIG.ADMIN_EMAIL;
  var subject = data.subject || "Project S.H.E. Email";
  var body = data.body || "";
  var html = generateAdminNoticeHtml(subject, body, data.metadata || {}, CONFIG.OFFICIAL_WEBSITE);
  var sent = dispatchEmail(to, subject, body, html, "Project S.H.E.");
  return { success: sent, message: sent ? "Email dispatched" : "Failed to send email" };
}

// -----------------------------------------------------------------------------
// DUAL-ENGINE EMAIL SENDER
// -----------------------------------------------------------------------------

function dispatchEmail(to, subject, plainText, htmlBody, senderName) {
  var name = senderName || CONFIG.ORGANISATION_NAME;

  try {
    GmailApp.sendEmail(to, subject, plainText || "Project S.H.E. Email", {
      name: name,
      htmlBody: htmlBody
    });
    return true;
  } catch (errGmail) {
    Logger.log("GmailApp send error: " + errGmail.toString() + ". Attempting MailApp fallback...");
    try {
      MailApp.sendEmail({
        to: to,
        subject: subject,
        body: plainText || "Project S.H.E. Email",
        htmlBody: htmlBody,
        name: name
      });
      return true;
    } catch (errMail) {
      Logger.log("MailApp fallback also failed: " + errMail.toString());
      return false;
    }
  }
}

// -----------------------------------------------------------------------------
// AESTHETIC DARK-BRUTALIST HTML TEMPLATES WITH UNSUBSCRIBE BUTTON
// -----------------------------------------------------------------------------

/**
 * Template 1: Subscriber Welcome Email
 */
function generateWelcomeEmailHtml(recipientEmail) {
  var unsubUrl = CONFIG.OFFICIAL_WEBSITE + "/unsubscribe?email=" + encodeURIComponent(recipientEmail);

  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<title>Welcome to Project S.H.E.</title>' +
  '</head>' +
  '<body style="margin: 0; padding: 0; background-color: #060606; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #EDEDED;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #060606; min-height: 100vh; padding: 32px 12px;">' +
      '<tr>' +
        '<td align="center">' +
          '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #0E0E0E; border: 2px solid #E50914; box-shadow: 8px 8px 0px #E50914;">' +
            
            '<!-- Crimson Accent Bar -->' +
            '<tr><td height="5" style="background-color: #E50914; font-size: 0; line-height: 0;">&nbsp;</td></tr>' +

            '<!-- Organization Header -->' +
            '<tr>' +
              '<td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #1C1C1C;">' +
                '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                  '<tr>' +
                    '<td>' +
                      '<span style="display: block; font-family: monospace; font-size: 10px; font-weight: 800; letter-spacing: 2px; color: #E50914; text-transform: uppercase; margin-bottom: 4px;">' +
                        '// PROJECT S.H.E. COMMUNITY' +
                      '</span>' +
                      '<h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF; text-transform: uppercase; line-height: 1.1;">' +
                        'PROJECT S.H.E.' +
                      '</h1>' +
                      '<span style="font-family: monospace; font-size: 10px; color: #777777; letter-spacing: 1.5px; text-transform: uppercase;">' +
                        'SUPPORT • HELP • EMPOWER' +
                      '</span>' +
                    '</td>' +
                    '<td align="right" valign="top">' +
                      '<span style="display: inline-block; padding: 4px 8px; border: 1px solid #E50914; background-color: #1A0002; color: #E50914; font-family: monospace; font-size: 10px; font-weight: 800; letter-spacing: 1px;">' +
                        'WELCOME' +
                      '</span>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +

            '<!-- Hero Content -->' +
            '<tr>' +
              '<td style="padding: 28px 32px 20px 32px;">' +
                '<h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 900; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.3px; line-height: 1.3;">' +
                  'THANK YOU FOR STANDING WITH US.' +
                '</h2>' +
                '<p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.6; color: #BBBBBB;">' +
                  'Welcome to Project S.H.E. By joining our newsletter, you will receive honest updates about our work, survivor stories, legal literacy resources, and upcoming community events.' +
                '</p>' +
                '<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #BBBBBB;">' +
                  'We respect your inbox: <strong>we only send meaningful updates</strong> and never spam.' +
                '</p>' +
              '</td>' +
            '</tr>' +

            '<!-- Core Operational Pillars Card -->' +
            '<tr>' +
              '<td style="padding: 0 32px 28px 32px;">' +
                '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #141414; border-left: 3px solid #E50914; padding: 18px 20px;">' +
                  '<tr>' +
                    '<td>' +
                      '<span style="display: block; font-family: monospace; font-size: 10px; font-weight: bold; color: #E50914; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px;">' +
                        'OUR WORK &amp; IMPACT' +
                      '</span>' +
                      '<p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #CCCCCC;">' +
                        '⚖️ <strong>Direct Legal Aid:</strong> Free legal representation for domestic violence and abuse survivors.' +
                      '</p>' +
                      '<p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #CCCCCC;">' +
                        '🛡️ <strong>Safe House Support:</strong> Shelter, therapy, and basic needs in partnership with Sahodaya Help Home.' +
                      '</p>' +
                      '<p style="margin: 0; font-size: 12px; line-height: 1.5; color: #CCCCCC;">' +
                        '📢 <strong>Youth Awareness:</strong> Fundraisers like Battle of the Bands (BOTB), school workshops, and policy talks.' +
                      '</p>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +

            '<!-- CTA Button -->' +
            '<tr>' +
              '<td align="center" style="padding: 0 32px 32px 32px;">' +
                '<table role="presentation" cellspacing="0" cellpadding="0" border="0">' +
                  '<tr>' +
                    '<td align="center" style="background-color: #E50914; border: 1px solid #E50914;">' +
                      '<a href="' + CONFIG.OFFICIAL_WEBSITE + '" target="_blank" style="display: inline-block; padding: 14px 28px; font-family: monospace; font-size: 12px; font-weight: 900; letter-spacing: 1.5px; color: #FFFFFF; text-decoration: none; text-transform: uppercase;">' +
                        'VISIT OUR WEBSITE &rarr;' +
                      '</a>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +

            '<!-- Crisis Helpline Section -->' +
            '<tr>' +
              '<td style="background-color: #080808; border-top: 1px solid #1C1C1C; padding: 22px 32px;">' +
                '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                  '<tr>' +
                    '<td>' +
                      '<span style="display: block; font-family: monospace; font-size: 10px; color: #E50914; font-weight: bold; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px;">' +
                        '24/7 CRISIS RESPONSE' +
                      '</span>' +
                      '<p style="margin: 0 0 4px 0; font-size: 11px; color: #888888; font-family: monospace;">' +
                        'National Women Helpline: <strong style="color: #FFFFFF;">1091 / 181</strong>' +
                      '</p>' +
                      '<p style="margin: 0; font-size: 11px; color: #888888; font-family: monospace;">' +
                        'Project S.H.E. Desk: <strong style="color: #FFFFFF;">+91 98765 43210</strong> | <strong style="color: #FFFFFF;">projectshe.ngo@gmail.com</strong>' +
                      '</p>' +
                    '</td>' +
                  '</tr>' +
                '</table>' +
              '</td>' +
            '</tr>' +

            '<!-- Unsubscribe & Footer Section -->' +
            '<tr>' +
              '<td style="padding: 20px 32px; border-top: 1px solid #141414; text-align: center;">' +
                '<p style="margin: 0 0 8px 0; font-size: 11px; color: #666666; font-family: monospace;">' +
                  'Sent to ' + recipientEmail + ' • Section 8 Registered Non-Profit • Sarva Nirbhaya Foundation' +
                '</p>' +
                '<p style="margin: 0; font-size: 11px; font-family: monospace;">' +
                  '<a href="' + unsubUrl + '" target="_blank" style="color: #E50914; text-decoration: underline; font-weight: bold;">' +
                    'Unsubscribe from newsletters' +
                  '</a>' +
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
 * Template 2: Administrative Alert Email
 */
function generateAdminNoticeHtml(title, description, detailsMap, ctaUrl) {
  var rowsHtml = "";
  for (var key in detailsMap) {
    if (detailsMap.hasOwnProperty(key)) {
      rowsHtml += '<tr>' +
        '<td width="35%" style="padding: 10px 14px; background-color: #121212; border: 1px solid #222222; font-family: monospace; font-size: 11px; font-weight: bold; color: #AAAAAA; text-transform: uppercase;">' + key + '</td>' +
        '<td width="65%" style="padding: 10px 14px; background-color: #0A0A0A; border: 1px solid #222222; font-family: monospace; font-size: 11px; color: #FFFFFF; word-break: break-word;">' + detailsMap[key] + '</td>' +
      '</tr>';
    }
  }

  var ctaHtml = "";
  if (ctaUrl) {
    ctaHtml = '<tr><td align="center" style="padding: 24px 0 0 0;">' +
      '<a href="' + ctaUrl + '" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #E50914; color: #FFFFFF; font-family: monospace; font-size: 12px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #E50914;">' +
        'OPEN ADMIN DASHBOARD &rarr;' +
      '</a>' +
    '</td></tr>';
  }

  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head><meta charset="utf-8"></head>' +
  '<body style="margin: 0; padding: 0; background-color: #060606; font-family: -apple-system, sans-serif; color: #FFFFFF;">' +
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #060606; padding: 30px 10px;">' +
      '<tr><td align="center">' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0E0E0E; border: 2px solid #E50914; box-shadow: 8px 8px 0px #E50914; padding: 28px;">' +
          '<tr><td>' +
            '<span style="font-family: monospace; font-size: 10px; color: #E50914; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 6px;">' +
              '// WEBSITE ALERT' +
            '</span>' +
            '<h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 900; text-transform: uppercase; color: #FFFFFF; letter-spacing: -0.3px;">' +
              title +
            '</h2>' +
            '<p style="margin: 0 0 20px 0; font-size: 13px; color: #AAAAAA; line-height: 1.5;">' +
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
 * Template 3: Broadcast Email for Newsletters (With Unsubscribe Link & Customizable CTA Button)
 */
function generateBroadcastEmailHtml(subject, headline, subtitle, bodyContent, ctaText, ctaUrl, recipientEmail) {
  var unsubUrl = CONFIG.OFFICIAL_WEBSITE + "/unsubscribe?email=" + encodeURIComponent(recipientEmail);
  
  var subtitleHtml = "";
  if (subtitle && subtitle.trim()) {
    subtitleHtml = '<p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #E50914; text-transform: uppercase; letter-spacing: 1px;">' + subtitle + '</p>';
  }

  var ctaButtonHtml = "";
  if (ctaText && ctaUrl) {
    ctaButtonHtml = '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0 8px 0;">' +
      '<tr><td style="background-color: #E50914; border: 1px solid #E50914;">' +
        '<a href="' + ctaUrl + '" target="_blank" style="display: inline-block; padding: 14px 28px; font-family: monospace; font-size: 12px; font-weight: 900; letter-spacing: 1.5px; color: #FFFFFF; text-decoration: none; text-transform: uppercase;">' +
          ctaText + ' &rarr;' +
        '</a>' +
      '</td></tr>' +
    '</table>';
  }

  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head><meta charset="utf-8"></head>' +
  '<body style="margin: 0; padding: 0; background-color: #060606; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; color: #EDEDED;">' +
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #060606; padding: 32px 10px;">' +
      '<tr><td align="center">' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0E0E0E; border: 2px solid #E50914; box-shadow: 8px 8px 0px #E50914;">' +
          '<tr><td height="5" style="background-color: #E50914;">&nbsp;</td></tr>' +
          '<tr><td style="padding: 32px;">' +
            '<span style="display: block; font-family: monospace; font-size: 10px; font-weight: 900; color: #E50914; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">' +
              '// PROJECT S.H.E. NEWSLETTER' +
            '</span>' +
            '<h2 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 900; text-transform: uppercase; color: #FFFFFF; line-height: 1.25;">' +
              headline +
            '</h2>' +
            subtitleHtml +
            '<div style="font-size: 14px; line-height: 1.7; color: #CCCCCC; white-space: pre-line; margin-bottom: 20px;">' +
              bodyContent +
            '</div>' +
            ctaButtonHtml +
          '</td></tr>' +
          '<tr><td style="background-color: #080808; border-top: 1px solid #1C1C1C; padding: 20px 32px; text-align: center;">' +
            '<p style="margin: 0 0 8px 0; font-family: monospace; font-size: 11px; color: #666666;">' +
              'Sent to ' + recipientEmail + ' • Project S.H.E. NGO' +
            '</p>' +
            '<p style="margin: 0; font-family: monospace; font-size: 11px;">' +
              '<a href="' + unsubUrl + '" target="_blank" style="color: #E50914; text-decoration: underline; font-weight: bold;">' +
                'Unsubscribe from this newsletter' +
              '</a>' +
            '</p>' +
          '</td></tr>' +
        '</table>' +
      '</td></tr>' +
    '</table>' +
  '</body></html>';
}

// -----------------------------------------------------------------------------
// SPREADSHEET LOGGING HELPERS
// -----------------------------------------------------------------------------

function safeLogToSheet(sheetName, headers, rowData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    var sheet = getOrCreateSheet(ss, sheetName, headers);
    sheet.appendRow(rowData);
  } catch (err) {
    Logger.log("safeLogToSheet warning: " + err.toString());
  }
}

function safeLogSubscriber(email, source) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return;
    var sheet = getOrCreateSheet(ss, CONFIG.SHEET_SUBSCRIBERS, [
      "Timestamp", "Email", "Source", "Status"
    ]);

    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][1] && rows[i][1].toString().toLowerCase() === email) {
        // If they were previously unsubscribed, mark as Active again
        sheet.getRange(i + 1, 4).setValue("Active");
        return;
      }
    }
    sheet.appendRow([new Date(), email, source, "Active"]);
  } catch (err) {
    Logger.log("safeLogSubscriber warning: " + err.toString());
  }
}

function getActiveSubscribersFromSheet() {
  var emails = [];
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return emails;
    var sheet = ss.getSheetByName(CONFIG.SHEET_SUBSCRIBERS);
    if (!sheet) return emails;

    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      var email = (rows[i][1] || "").toString().trim().toLowerCase();
      var status = (rows[i][3] || "Active").toString();
      if (email && email.indexOf("@") !== -1 && status === "Active") {
        emails.push(email);
      }
    }
  } catch (err) {
    Logger.log("getActiveSubscribersFromSheet warning: " + err.toString());
  }
  return emails;
}

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

function getScriptProperty(key) {
  try {
    return PropertiesService.getScriptProperties().getProperty(key);
  } catch (e) {
    return null;
  }
}
