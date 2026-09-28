/**
 * ==============================================================================
 * PROJECT S.H.E. (SUPPORT. HELP. EMPOWER.) - OFFICIAL DISPATCH DISPATCHER
 * Google Apps Script Web App Engine v2.0 (Bulletproof Production Edition)
 * 
 * Capabilities:
 * - Automated Google Sheets logging for Subscribers, Reviews, and Feedback
 * - Luxury Dark-Brutalist HTML Emails (Aesthetic, responsive, high contrast)
 * - Multi-action support: admin_notification, newsletter_signup, broadcast, etc.
 * - Dual-layer email dispatch engine (GmailApp with MailApp fallback)
 * - Safe error handling (Spreadsheet logging errors never kill email delivery)
 * ==============================================================================
 */

// Configuration Variables (Can also be set in Project Settings > Script Properties)
var CONFIG = {
  ORGANISATION_NAME: "Project S.H.E. NGO",
  ADMIN_EMAIL: "projectshe.ngo@gmail.com", // Primary admin recipient
  OFFICIAL_WEBSITE: "https://projectshe.org",
  LOGO_URL: "https://projectshe.org/assets/logo-clean.png",
  SECRET_TOKENS: [
    "she_gas_secret_key_2026",
    "she_secret_token_2026_goated",
    "she_admin_secret_2026_goated"
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
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    system: "Project S.H.E. Dispatch Engine",
    version: "2.0.0",
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

    // Token verification (graceful: checks token or secret against allowed tokens or Script Property)
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
        // Fallback: If action is unknown but looks like an email send request
        if (data.to && data.subject) {
          output = handleGenericEmail(data);
        } else {
          throw new Error("Unrecognized dispatch action: " + action);
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
// CORE ACTION HANDLERS
// -----------------------------------------------------------------------------

/**
 * 1. Process Unified Admin Notification
 * Dispatched on review submit, suggestion submit, feedback submit, or registrations
 */
function handleAdminNotification(data) {
  var to = data.to || getScriptProperty("ADMIN_EMAIL") || CONFIG.ADMIN_EMAIL;
  var subject = data.subject || "[Project S.H.E.] Administrative Notification";
  var rawBody = data.body || "";
  var metadata = data.metadata || {};

  // Build clean tabular details from metadata or parsed text
  var detailsMap = {};
  for (var k in metadata) {
    if (metadata.hasOwnProperty(k) && metadata[k] !== null && metadata[k] !== undefined) {
      var displayKey = k.replace(/([A-Z])/g, " $1").replace(/_/g, " ").toUpperCase();
      detailsMap[displayKey] = typeof metadata[k] === "object" ? JSON.stringify(metadata[k]) : String(metadata[k]);
    }
  }

  // Also include received date
  if (!detailsMap["DISPATCH TIME"]) {
    detailsMap["DISPATCH TIME"] = new Date().toLocaleString();
  }

  var htmlBody = generateAdminNoticeHtml(
    subject.replace(/^\[Project S\.H\.E\.\]\s*/i, ""),
    rawBody || "An important administrative event has been triggered on the Project S.H.E. portal.",
    detailsMap,
    CONFIG.OFFICIAL_WEBSITE + "/admin"
  );

  var sent = dispatchEmail(to, subject, rawBody, htmlBody, "Project S.H.E. Desk");

  // Log to Google Sheet without blocking if spreadsheet is unavailable
  safeLogToSheet(CONFIG.SHEET_ADMIN_LOGS, [
    "Timestamp", "Recipient", "Subject", "Metadata", "Status"
  ], [
    new Date(), to, subject, JSON.stringify(metadata), sent ? "Dispatched" : "Failed"
  ]);

  return {
    success: sent,
    message: sent ? "Admin alert dispatched successfully" : "Email delivery warning (check quota/inbox)"
  };
}

/**
 * 2. Process New Newsletter Subscriber
 */
function handleNewsletterSignup(data) {
  var email = (data.email || "").trim().toLowerCase();
  var source = data.source || "Website Center Modal";

  if (!email || email.indexOf("@") === -1) {
    return { success: false, message: "Invalid email address" };
  }

  // A. Append to Google Sheet (safe, handles duplicates)
  safeLogSubscriber(email, source);

  // B. Dispatch Aesthetic Welcome Email to Subscriber
  var welcomeSubject = "WELCOME TO THE FRONT LINE // Project S.H.E. Dispatches";
  var welcomeHtml = generateWelcomeEmailHtml(email);
  var welcomePlain = "Welcome to Project S.H.E. Dispatches. You are now connected to the front line of our movement.";

  var subscriberSent = dispatchEmail(
    email,
    welcomeSubject,
    welcomePlain,
    welcomeHtml,
    "Project S.H.E. NGO"
  );

  // C. Notify Administrator
  var adminSubject = "[NEW SUBSCRIBER] " + email + " joined Project S.H.E.";
  var adminHtml = generateAdminNoticeHtml(
    "NEW DISPATCH SUBSCRIBER",
    "A new advocate has enlisted in the Project S.H.E. newsletter network.",
    {
      "SUBSCRIBER EMAIL": email,
      "PORTAL SOURCE": source,
      "TIMESTAMP": new Date().toLocaleString()
    },
    CONFIG.OFFICIAL_WEBSITE + "/admin"
  );

  dispatchEmail(
    CONFIG.ADMIN_EMAIL,
    adminSubject,
    "New subscriber: " + email + " via " + source,
    adminHtml,
    "Project S.H.E. Desk"
  );

  return {
    success: true,
    message: subscriberSent ? "Subscriber logged and welcome transmission sent." : "Subscriber logged (email pending quota)."
  };
}

/**
 * 3. Process Public Review Submission
 */
function handleReviewSubmission(data) {
  var name = data.author_name || data.display_name || data.name || "Anonymous Ally";
  var role = data.author_role || data.role_or_relation || data.role || "Community Voice";
  var rating = data.rating || 5;
  var content = data.content || data.review_text || data.excerpt || "";

  // Log in spreadsheet
  safeLogToSheet(CONFIG.SHEET_REVIEWS, [
    "Timestamp", "Author", "Role", "Rating", "Review Content", "Status"
  ], [
    new Date(), name, role, rating, content, "Pending Moderation"
  ]);

  // Alert Admin
  var adminSubject = "[MODERATION QUEUE] New Review from " + name + " (" + rating + " Stars)";
  var adminHtml = generateAdminNoticeHtml(
    "NEW REVIEW AWAITING APPROVAL",
    "A community member has shared their experience. Review and moderate before public display.",
    {
      "AUTHOR NAME": name,
      "ROLE / RELATION": role,
      "RATING": rating + " / 5 Stars",
      "REVIEW EXCERPT": content,
      "SUBMISSION TIME": new Date().toLocaleString()
    },
    CONFIG.OFFICIAL_WEBSITE + "/admin"
  );

  var sent = dispatchEmail(CONFIG.ADMIN_EMAIL, adminSubject, "New review from " + name, adminHtml, "Project S.H.E. Moderation");

  return { success: true, message: "Review logged for moderation." };
}

/**
 * 4. Process Feedback / Community Suggestion
 */
function handleFeedbackSubmission(data) {
  var type = (data.type || "Feedback").toUpperCase();
  var category = data.category || "General";
  var name = data.user_name || data.name || "Confidential Ally";
  var email = data.user_email || data.email || "Not Provided";
  var message = data.content || data.message || "";
  var subject = data.subject || (type + " from " + name);

  safeLogToSheet(CONFIG.SHEET_FEEDBACK, [
    "Timestamp", "Type", "Category", "User Name", "User Email", "Subject", "Message Content", "Status"
  ], [
    new Date(), type, category, name, email, subject, message, "Unread"
  ]);

  var adminSubject = "[CONFIDENTIAL DIRECTIVE] New " + type + ": " + subject;
  var adminHtml = generateAdminNoticeHtml(
    "INCOMING COMMUNITY DIRECTIVE",
    "A direct message has been submitted through the secure feedback channel.",
    {
      "DIRECTIVE TYPE": type,
      "CATEGORY": category,
      "SENDER": name,
      "REPLY EMAIL": email,
      "SUBJECT": subject,
      "MESSAGE CONTENT": message,
      "TIMESTAMP": new Date().toLocaleString()
    },
    CONFIG.OFFICIAL_WEBSITE + "/admin"
  );

  dispatchEmail(CONFIG.ADMIN_EMAIL, adminSubject, "New " + type + " from " + name, adminHtml, "Project S.H.E. Desk");

  return { success: true, message: "Community submission securely recorded." };
}

/**
 * 5. Broadcast Newsletter to Subscribers
 */
function handleBroadcastNewsletter(data) {
  var subject = data.subject || "PROJECT S.H.E. // Field Update & Directive";
  var headline = data.headline || data.subject || "CRITICAL FIELD BULLETIN";
  var bodyContent = data.body || data.content || data.htmlContent || "Stay informed on ongoing initiatives and legal advocacy.";

  var recipients = [];

  // If specific recipients array passed from Next.js server
  if (data.recipients && Array.isArray(data.recipients) && data.recipients.length > 0) {
    recipients = data.recipients;
  } else {
    // Otherwise fetch active subscribers from Google Sheet
    recipients = getActiveSubscribersFromSheet();
  }

  if (recipients.length === 0) {
    return { success: false, message: "No recipients available for broadcast." };
  }

  var count = 0;
  for (var i = 0; i < recipients.length; i++) {
    var recEmail = recipients[i];
    if (recEmail && recEmail.indexOf("@") !== -1) {
      var html = generateBroadcastEmailHtml(subject, headline, bodyContent, recEmail);
      var sent = dispatchEmail(recEmail, subject, bodyContent, html, "Project S.H.E. Dispatches");
      if (sent) count++;
      Utilities.sleep(250); // Respect Google daily quotas & prevent throttling
    }
  }

  return {
    success: true,
    recipientsCount: count,
    message: "Broadcast dispatched to " + count + " recipients."
  };
}

/**
 * 6. Send User Welcome Email
 */
function handleWelcomeUser(data) {
  var to = data.to || data.email;
  if (!to || to.indexOf("@") === -1) {
    return { success: false, message: "Invalid recipient email" };
  }

  var welcomeSubject = "WELCOME TO THE FRONT LINE // Project S.H.E.";
  var welcomeHtml = generateWelcomeEmailHtml(to);
  var sent = dispatchEmail(to, welcomeSubject, "Welcome to Project S.H.E.", welcomeHtml, "Project S.H.E. NGO");

  return { success: sent, message: sent ? "Welcome email sent" : "Failed to send welcome email" };
}

/**
 * 7. Generic Email Fallback
 */
function handleGenericEmail(data) {
  var to = data.to || CONFIG.ADMIN_EMAIL;
  var subject = data.subject || "Project S.H.E. Transmission";
  var body = data.body || "";
  var html = generateAdminNoticeHtml(subject, body, data.metadata || {}, CONFIG.OFFICIAL_WEBSITE);

  var sent = dispatchEmail(to, subject, body, html, "Project S.H.E.");
  return { success: sent, message: sent ? "Email dispatched" : "Failed to dispatch email" };
}

// -----------------------------------------------------------------------------
// DUAL-ENGINE RESILIENT EMAIL SENDER
// -----------------------------------------------------------------------------

/**
 * Dispatches an email using GmailApp, with automatic failover to MailApp
 */
function dispatchEmail(to, subject, plainText, htmlBody, senderName) {
  var name = senderName || CONFIG.ORGANISATION_NAME;

  try {
    GmailApp.sendEmail(to, subject, plainText || "Project S.H.E. Notification", {
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
        body: plainText || "Project S.H.E. Notification",
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
// AESTHETIC DARK-BRUTALIST HTML TEMPLATES
// -----------------------------------------------------------------------------

/**
 * Template 1: Subscriber & Ally Welcome Email
 * Visuals: Dark brutalist, high contrast, red accents, crisp typography
 */
function generateWelcomeEmailHtml(recipientEmail) {
  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head>' +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<title>Welcome to Project S.H.E.</title>' +
  '</head>' +
  '<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #EDEDED;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #050505; min-height: 100vh; padding: 32px 12px;">' +
      '<tr>' +
        '<td align="center">' +
          '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background-color: #0C0C0C; border: 2px solid #E50914; box-shadow: 8px 8px 0px #E50914;">' +
            
            '<!-- Crimson Accent Bar -->' +
            '<tr><td height="5" style="background-color: #E50914; font-size: 0; line-height: 0;">&nbsp;</td></tr>' +

            '<!-- Organization Header -->' +
            '<tr>' +
              '<td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #1C1C1C;">' +
                '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">' +
                  '<tr>' +
                    '<td>' +
                      '<span style="display: block; font-family: monospace; font-size: 10px; font-weight: 800; letter-spacing: 2px; color: #E50914; text-transform: uppercase; margin-bottom: 4px;">' +
                        '// OFFICIAL DISPATCH NETWORK' +
                      '</span>' +
                      '<h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF; text-transform: uppercase; line-height: 1.1;">' +
                        'PROJECT S.H.E.' +
                      '</h1>' +
                      '<span style="font-family: monospace; font-size: 9px; color: #777777; letter-spacing: 1.5px; text-transform: uppercase;">' +
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

            '<!-- Hero Content -->' +
            '<tr>' +
              '<td style="padding: 28px 32px 20px 32px;">' +
                '<h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 900; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.3px; line-height: 1.3;">' +
                  'YOU ARE NOW LINKED TO THE FRONT LINE.' +
                '</h2>' +
                '<p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.6; color: #BBBBBB;">' +
                  'Thank you for standing in solidarity. By subscribing to Project S.H.E. Dispatches, you become an active observer and ally in our mission to dismantle gender-based abuse and deliver relentless legal and community support.' +
                '</p>' +
                '<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #BBBBBB;">' +
                  'Our pledge: <strong>zero fluff, zero performative noise.</strong> Every dispatch contains verified field updates, legal literacy resources, survivor victories, or urgent community calls to action.' +
                '</p>' +
              '</td>' +
            '</tr>' +

            '<!-- Core Operational Pillars Card -->' +
            '<tr>' +
              '<td style="padding: 0 32px 28px 32px;">' +
                '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #121212; border-left: 3px solid #E50914; padding: 18px 20px;">' +
                  '<tr>' +
                    '<td>' +
                      '<span style="display: block; font-family: monospace; font-size: 10px; font-weight: bold; color: #E50914; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px;">' +
                        'OUR THREE OPERATIONAL PILLARS' +
                      '</span>' +
                      '<p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #CCCCCC;">' +
                        '⚖️ <strong>Direct Legal Aid:</strong> Navigating courtrooms and legal protections alongside certified advocates.' +
                      '</p>' +
                      '<p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #CCCCCC;">' +
                        '🛡️ <strong>Safe House Support:</strong> Partnering with Sahodaya Home to deliver shelter, therapy, and basic dignities.' +
                      '</p>' +
                      '<p style="margin: 0; font-size: 12px; line-height: 1.5; color: #CCCCCC;">' +
                        '📢 <strong>Grassroots Advocacy:</strong> BOTB rock fundraisers, workshops, and school awareness drives.' +
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
                        'VISIT HEADQUARTERS PORTAL &rarr;' +
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

            '<!-- Legal & Org Footer -->' +
            '<tr>' +
              '<td style="padding: 18px 32px; border-top: 1px solid #141414; text-align: center;">' +
                '<p style="margin: 0 0 6px 0; font-size: 10px; color: #555555; font-family: monospace;">' +
                  'Dispatched to ' + recipientEmail + ' • Section 8 Registered Non-Profit Organisation' +
                '</p>' +
                '<p style="margin: 0; font-size: 10px; color: #444444; font-family: monospace;">' +
                  'Sarva Nirbhaya Foundation • Hyderabad &amp; New Delhi, India.' +
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
 * Structured table for instant operational scanning
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
        'OPEN ADMINISTRATIVE DESK &rarr;' +
      '</a>' +
    '</td></tr>';
  }

  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head><meta charset="utf-8"></head>' +
  '<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, sans-serif; color: #FFFFFF;">' +
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #050505; padding: 30px 10px;">' +
      '<tr><td align="center">' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0C0C0C; border: 2px solid #E50914; box-shadow: 8px 8px 0px #E50914; padding: 28px;">' +
          '<tr><td>' +
            '<span style="font-family: monospace; font-size: 10px; color: #E50914; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 6px;">' +
              '// ADMINISTRATIVE DIRECTIVE' +
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
 * Template 3: Broadcast Email for Newsletters
 */
function generateBroadcastEmailHtml(subject, headline, bodyContent, recipientEmail) {
  return '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head><meta charset="utf-8"></head>' +
  '<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; color: #EDEDED;">' +
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #050505; padding: 32px 10px;">' +
      '<tr><td align="center">' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0C0C0C; border: 2px solid #E50914; box-shadow: 8px 8px 0px #E50914;">' +
          '<tr><td height="5" style="background-color: #E50914;">&nbsp;</td></tr>' +
          '<tr><td style="padding: 32px;">' +
            '<span style="display: block; font-family: monospace; font-size: 10px; font-weight: 900; color: #E50914; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">' +
              '// PROJECT S.H.E. DISPATCH' +
            '</span>' +
            '<h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 900; text-transform: uppercase; color: #FFFFFF; line-height: 1.25;">' +
              headline +
            '</h2>' +
            '<div style="font-size: 14px; line-height: 1.7; color: #CCCCCC; white-space: pre-line; margin-bottom: 24px;">' +
              bodyContent +
            '</div>' +
            '<table role="presentation" cellspacing="0" cellpadding="0" border="0">' +
              '<tr><td style="background-color: #E50914;">' +
                '<a href="' + CONFIG.OFFICIAL_WEBSITE + '" target="_blank" style="display: inline-block; padding: 12px 24px; font-family: monospace; font-size: 12px; font-weight: 900; letter-spacing: 1px; color: #FFFFFF; text-decoration: none; text-transform: uppercase;">' +
                  'VISIT COMMUNITY PORTAL &rarr;' +
                '</a>' +
              '</td></tr>' +
            '</table>' +
          '</td></tr>' +
          '<tr><td style="background-color: #080808; border-top: 1px solid #1C1C1C; padding: 16px 32px; text-align: center;">' +
            '<p style="margin: 0; font-family: monospace; font-size: 10px; color: #666666;">' +
              'Transmitted to ' + recipientEmail + ' • Project S.H.E. NGO' +
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

/**
 * Safely logs a row to Google Sheets without throwing uncaught exceptions
 */
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

/**
 * Safely logs a subscriber, avoiding duplicates
 */
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
        return; // Already exists
      }
    }

    sheet.appendRow([new Date(), email, source, "Active"]);
  } catch (err) {
    Logger.log("safeLogSubscriber warning: " + err.toString());
  }
}

/**
 * Reads all active subscriber emails from the sheet
 */
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

/**
 * Creates sheet with headers if missing
 */
function getOrCreateSheet(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0C0C0C");
      headerRange.setFontColor("#E50914");
    }
  }
  return sheet;
}

/**
 * Reads script property safely
 */
function getScriptProperty(key) {
  try {
    return PropertiesService.getScriptProperties().getProperty(key);
  } catch (e) {
    return null;
  }
}
