import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English text is used as the key, so anything missing from `mr` simply stays in English.
// To translate more of the site: wrap the text with t("English text") and add it below.
const mr = {
  Shop: "खरेदी", Help: "मदत", Company: "कंपनी", "All products": "सर्व उत्पादने", "My account": "माझे खाते", "Need help? Contact us": "मदत हवी? संपर्क करा", "Shipping & Returns": "शिपिंग व परतावा", "Terms & Conditions": "अटी व शर्ती", "Privacy Policy": "गोपनीयता धोरण",
  Wishlist: "आवडती यादी", Settings: "सेटिंग्ज", "MY WISHLIST": "माझी आवडती यादी", "Saved products": "जतन केलेली उत्पादने", items: "वस्तू", "Your wishlist is empty": "तुमची आवडती यादी रिकामी आहे", "Tap the heart on any product to save it here.": "उत्पादन येथे जतन करण्यासाठी हृदयावर टॅप करा.", "Browse products": "उत्पादने पहा",
  SETTINGS: "सेटिंग्ज", "Website settings": "वेबसाइट सेटिंग्ज", Language: "भाषा", Display: "डिस्प्ले", "Text and page size": "अक्षर व पानाचा आकार", Small: "लहान", Normal: "सामान्य", Large: "मोठा", "Extra large": "खूप मोठा", "Reduce animations": "अ‍ॅनिमेशन कमी करा", "Turns off twinkling lights and slide effects": "चमकणारे दिवे व स्लाइड इफेक्ट बंद करा",
  Notifications: "सूचना", "Offers & sale alerts": "ऑफर्स व सेल सूचना", "Diwali deals, coupons and new arrivals": "दिवाळी ऑफर्स, कूपन आणि नवीन उत्पादने", "Order updates": "ऑर्डर अपडेट्स", "Confirmation, shipping and delivery": "पुष्टी, शिपिंग आणि डिलिव्हरी",
  "Delivery & account": "डिलिव्हरी व खाते", "Delivery PIN code": "डिलिव्हरी पिन कोड", Save: "जतन करा", Saved: "जतन झाले", "Edit profile & address": "प्रोफाइल व पत्ता बदला", "Enter a 6 digit PIN code": "६ अंकी पिन कोड टाका", "Your data on this device": "या डिव्हाइसवरील तुमचा डेटा",
  "Clear wishlist": "आवडती यादी साफ करा", "Empty bag": "बॅग रिकामी करा", "Reset settings": "सेटिंग्ज रीसेट करा", "Wishlist cleared": "आवडती यादी साफ केली", "Bag emptied": "बॅग रिकामी केली", "Settings reset": "सेटिंग्ज रीसेट झाल्या", "About GramSupply": "ग्रामसप्लायबद्दल", "Admin panel": "अ‍ॅडमिन पॅनेल",
  "DIWALI DHAMAKA SALE": "दिवाळी धमाका सेल", "— Extra ₹500 off with code": "— कोडसह अतिरिक्त ₹५०० सूट", "· Free delivery above ₹4,999": "· ₹४,९९९ वरील ऑर्डरवर मोफत डिलिव्हरी",
  "Ends in": "संपायला", d: "दि", h: "तास", m: "मि", s: "से",
  "Search for lights, CCTV, furniture and more": "दिवे, CCTV, फर्निचर आणि बरेच काही शोधा",
  Login: "लॉगिन", Logout: "लॉगआउट", "Sign up": "नोंदणी करा", "Delivering to": "डिलिव्हरी:", "Set delivery location": "डिलिव्हरी ठिकाण निवडा",
  "Enter your PIN code": "तुमचा पिन कोड टाका", "6 digit PIN code": "६ अंकी पिन कोड", Apply: "लागू करा", More: "अधिक", "About us": "आमच्याबद्दल", "Contact us": "संपर्क करा", Cart: "कार्ट",
  "Diwali Sale": "दिवाळी सेल", All: "सर्व", Categories: "वर्ग",
  "Cleaning & Sanitation": "स्वच्छता व सफाई", "Street & Outdoor Lighting": "रस्ते व बाह्य प्रकाश", "CCTV & Security": "CCTV व सुरक्षा", "Computers & Office Technology": "संगणक व कार्यालयीन तंत्रज्ञान",
  "Water Systems": "पाणी यंत्रणा", Furniture: "फर्निचर", "Playground & Open Gym": "खेळाचे मैदान व ओपन जिम", "Village Infrastructure": "गाव पायाभूत सुविधा", "Power, Solar & Safety": "वीज, सौर व सुरक्षा",
  Cleaning: "स्वच्छता", Lighting: "प्रकाश", CCTV: "CCTV", Computers: "संगणक", Water: "पाणी", Playground: "खेळाचे मैदान", Infrastructure: "पायाभूत सुविधा", "Solar & Safety": "सौर व सुरक्षा", Street: "रस्ते", Village: "गाव", Power: "वीज",
  "Up to 60% off": "६०% पर्यंत सूट", "Flat 45% off": "फ्लॅट ४५% सूट", "Min. 35% off": "किमान ३५% सूट",
  "Light up every corner of your village & office": "तुमचे गाव आणि कार्यालयाचा प्रत्येक कोपरा उजळवा", "CCTV, fire safety & solar power at festive prices": "CCTV, अग्निसुरक्षा आणि सौर ऊर्जा सणासुदीच्या दरात", "Chairs, desks, computers and cupboards": "खुर्च्या, टेबल, संगणक आणि कपाटे",
  "SAFE DIWALI": "सुरक्षित दिवाळी", "NAYA OFFICE, NAYA SAAL": "नवे कार्यालय, नवे वर्ष",
  OFF: "सूट", "UP TO": "पर्यंत", "Shop the sale": "सेलमध्ये खरेदी करा", "Bulk order enquiry": "मोठ्या ऑर्डरची चौकशी", "— flat ₹500 off above ₹5,000": "— ₹५,००० वरील ऑर्डरवर ₹५०० सूट",
  "Flat ₹500 off": "₹५०० फ्लॅट सूट", "On orders above ₹5,000": "₹५,००० वरील ऑर्डरवर", "Extra 8% off": "अतिरिक्त ८% सूट", "On 10+ units of one product": "एकाच वस्तूच्या १०+ नगांवर",
  "10% off": "१०% सूट", "On your first order, up to ₹1,500": "पहिल्या ऑर्डरवर, ₹१,५०० पर्यंत", "Free delivery": "मोफत डिलिव्हरी", "On orders above ₹4,999": "₹४,९९९ वरील ऑर्डरवर", Copied: "कॉपी झाले",
  "Festive deals by category": "वर्गानुसार सणासुदीच्या ऑफर्स", "Shop now": "आता खरेदी करा", "⚡ Lightning deals": "⚡ लाइटनिंग डील्स", "Prices reset at midnight — grab them before they do": "मध्यरात्री किमती बदलतात — त्याआधी खरेदी करा",
  HRS: "तास", MIN: "मिनिटे", SEC: "सेकंद", "Add to bag": "बॅगमध्ये टाका", "claimed — hurry!": "विकले गेले — घाई करा!", "Min. order:": "किमान ऑर्डर:", units: "नग", "Get a quote": "कोटेशन मिळवा", "added to bag": "बॅगमध्ये टाकले", "View bag": "बॅग पहा",
  "REQUEST FOR QUOTATION": "कोटेशनसाठी विनंती", "Buying 10 or more?": "१० किंवा अधिक खरेदी करताय?", "Get an extra 8% off": "अतिरिक्त ८% सूट मिळवा", "Send enquiry": "चौकशी पाठवा",
  "GO SOLAR THIS DIWALI": "या दिवाळीत सौरऊर्जा निवडा", "Solar panels & safety gear": "सोलर पॅनल आणि सुरक्षा साधने", "up to 42% off": "४२% पर्यंत सूट", "Explore now": "आता पहा",
  "Trending this Diwali": "या दिवाळीत ट्रेंडिंग", "No deals here yet.": "येथे अद्याप ऑफर्स नाहीत.", "Send us an enquiry": "आम्हाला चौकशी पाठवा",
  "Welcome to GramSupply": "ग्रामसप्लायमध्ये स्वागत", "Welcome back,": "पुन्हा स्वागत,", "Source supplies for your village, school or office.": "तुमचे गाव, शाळा किंवा कार्यालयासाठी साहित्य मिळवा.", "Sign in": "साइन इन", "Join free": "मोफत सामील व्हा",
  "Request for quotation": "कोटेशनसाठी विनंती", "Tell us what you need — get quotes within a day.": "तुम्हाला काय हवे ते सांगा — एका दिवसात कोटेशन मिळवा.", "Get quotes": "कोटेशन मिळवा", "Order protection · Verified suppliers": "ऑर्डर सुरक्षा · प्रमाणित पुरवठादार",
  "On orders above ₹4,999 ": "₹४,९९९ वरील ऑर्डरवर", "Secure payments": "सुरक्षित पेमेंट", "Safe and easy checkout": "सुरक्षित आणि सोपे चेकआउट", "Quality checked": "गुणवत्ता तपासलेले", "Trusted institutional suppliers": "विश्वासार्ह संस्थात्मक पुरवठादार", "Help when you need it": "गरज असेल तेव्हा मदत", "Call or message our team": "आमच्या टीमला कॉल किंवा मेसेज करा",
  "Shubh Deepavali! Supplies for institutions, villages and offices.": "शुभ दीपावली! संस्था, गावे आणि कार्यालयांसाठी साहित्य.", Products: "उत्पादने", "Bulk enquiry": "मोठ्या ऑर्डरची चौकशी", "All rights reserved.": "सर्व हक्क राखीव.",
  "Twin Dustbin Set with Mop Trolley": "जुळी कचराकुंडी संच व मॉप ट्रॉली", "Solar Street Light 60W": "सोलर स्ट्रीट लाईट ६०W", "Bullet CCTV Camera 4MP": "बुलेट CCTV कॅमेरा ४MP", "Desktop Computer with Printer": "प्रिंटरसह डेस्कटॉप संगणक",
  "Commercial RO Plant 500 LPH": "व्यावसायिक RO प्लांट ५०० LPH", "Ergonomic Mesh Office Chair": "एर्गोनॉमिक मेष ऑफिस खुर्ची", "Outdoor Playground Slide": "बाहेरील खेळाचा घसरगुंडी", "Cast Iron Manhole Cover": "कास्ट आयर्न मॅनहोल झाकण", "ABC Fire Extinguisher 6kg": "ABC अग्निशमन यंत्र ६ किलो",
};
const saved = (() => { try { return localStorage.getItem("gs_lang"); } catch { return null; } })() || "en";
i18n.use(initReactI18next).init({ resources: { mr: { translation: mr }, en: { translation: {} } }, lng: saved, fallbackLng: "en", keySeparator: false, nsSeparator: false, interpolation: { escapeValue: false } });
document.documentElement.lang = saved;
i18n.on("languageChanged", (l) => { document.documentElement.lang = l; try { localStorage.setItem("gs_lang", l); } catch { /* ignore */ } });
export default i18n;
