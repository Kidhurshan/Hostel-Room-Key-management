export type Language = 'en' | 'ta' | 'si';

export interface Translations {
  // Common
  settings: string;
  dashboard: string;
  welcome: string;
  logout: string;
  loading: string;
  cancel: string;
  save: string;
  accept: string;
  approve: string;
  room: string;
  student: string;
  students: string;
  name: string;
  signIn: string;
  
  // Settings
  appearance: string;
  darkMode: string;
  language: string;
  languageDescription: string;
  darkModeDescription: string;
  colorBlindMode: string;
  colorBlindModeDescription: string;
  resetPassword: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  updatePassword: string;
  updating: string;
  
  // Security Dashboard
  securityDashboard: string;
  securityMenu: string;
  keyAvailable: string;
  keyWithStudents: string;
  greenKeyWithStudents: string;
  redKeyAvailable: string;
  accessControlPanel: string;
  keyStatus: string;
  currentStatus: string;
  availableWithSecurity: string;
  withStudents: string;
  roomOccupants: string;
  securityProtocol: string;
  securityProtocolDescription: string;
  grantAccess: string;
  waitingForStudentResponse: string;
  waitingDescription: string;
  monitoringSubmission: string;
  cancelAndClose: string;
  
  // Warden Dashboard
  wardenDashboard: string;
  wardenMenu: string;
  wardenAdministrativePanel: string;
  nightPassPending: string;
  occupancy: string;
  nightPassRequest: string;
  pendingApproval: string;
  date: string;
  dispatchReturnTime: string;
  reason: string;
  approveNightPass: string;
  reviewLater: string;
  allClear: string;
  noPendingRequests: string;
  orangeAlert: string;
  nightPassRequestText: string;
  
  // Student Management
  studentManagement: string;
  allStudents: string;
  searchStudents: string;
  registrationNumber: string;
  roomNumber: string;
  status: string;
  action: string;
  active: string;
  inactive: string;
  activate: string;
  
  // Security Management
  securityManagement: string;
  hostelSecurities: string;
  addSecurity: string;
  addNewSecurityGuard: string;
  createSecurityAccount: string;
  personalInformation: string;
  fullName: string;
  phoneNumber: string;
  accountCredentials: string;
  username: string;
  password: string;
  securityGuidelines: string;
  securityGuidelinesDescription: string;
  addSecurityGuard: string;
  
  // Languages
  english: string;
  tamil: string;
  sinhala: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    settings: "Settings",
    dashboard: "Dashboard",
    welcome: "Welcome",
    logout: "Logout",
    loading: "Loading",
    cancel: "Cancel",
    save: "Save",
    accept: "Accept",
    approve: "Approve",
    room: "Room",
    student: "Student",
    students: "Students",
    name: "Name",
    signIn: "Sign in",
    
    // Settings
    appearance: "Appearance",
    darkMode: "Dark Mode",
    language: "Language",
    languageDescription: "Choose your preferred language",
    darkModeDescription: "Toggle between light and dark theme",
    colorBlindMode: "Color Blind Accessibility",
    colorBlindModeDescription: "Use color blind friendly colors (replaces red/green with blue/orange)",
    resetPassword: "Reset Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    updatePassword: "Update Password",
    updating: "Updating...",
    
    // Security Dashboard
    securityDashboard: "Security Dashboard",
    securityMenu: "Security Menu",
    keyAvailable: "Key Available",
    keyWithStudents: "Key with Students",
    greenKeyWithStudents: "🟢 Green: Key with students",
    redKeyAvailable: "🔴 Red: Key available with security",
    accessControlPanel: "Access Control Panel",
    keyStatus: "Key Status",
    currentStatus: "Current Status:",
    availableWithSecurity: "Available with Security",
    withStudents: "With Students",
    roomOccupants: "Room Occupants",
    securityProtocol: "Security Protocol",
    securityProtocolDescription: "Granting access will allow students to submit key transaction forms. Monitor for completion.",
    grantAccess: "Grant Access to Students",
    waitingForStudentResponse: "Waiting for Student Response",
    waitingDescription: "Students have been notified. They can now submit their key transaction forms.",
    monitoringSubmission: "Monitoring for form submission...",
    cancelAndClose: "Cancel & Close",
    
    // Warden Dashboard
    wardenDashboard: "Warden Dashboard",
    wardenMenu: "Warden Menu",
    wardenAdministrativePanel: "Warden Administrative Panel",
    nightPassPending: "Night Pass Pending",
    occupancy: "Occupancy",
    nightPassRequest: "Night Pass Request",
    pendingApproval: "Pending your approval",
    date: "Date",
    dispatchReturnTime: "Dispatch - Return Time",
    reason: "Reason",
    approveNightPass: "Approve Night Pass",
    reviewLater: "Review Later",
    allClear: "All Clear",
    noPendingRequests: "No pending night pass requests for this room",
    orangeAlert: "⚠️ Orange !: Night pass request",
    nightPassRequestText: "Night Pass Request",
    
    // Student Management
    studentManagement: "Student Management",
    allStudents: "All Students",
    searchStudents: "Search students...",
    registrationNumber: "Registration Number",
    roomNumber: "Room Number",
    status: "Status",
    action: "Action",
    active: "Active",
    inactive: "Inactive",
    activate: "Activate",
    
    // Security Management
    securityManagement: "Security Management",
    hostelSecurities: "Hostel Securities",
    addSecurity: "Add Security",
    addNewSecurityGuard: "Add Security Guard",
    createSecurityAccount: "Create new security personnel account",
    personalInformation: "Personal Information",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    accountCredentials: "Account Credentials",
    username: "Username",
    password: "Password",
    securityGuidelines: "Security Guidelines",
    securityGuidelinesDescription: "New security guard will have access to room monitoring and key management functions.",
    addSecurityGuard: "Add Security",
    
    // Languages
    english: "English",
    tamil: "Tamil",
    sinhala: "Sinhala"
  },
  
  ta: {
    // Common
    settings: "அமைப்புகள்",
    dashboard: "டாஷ்போர்டு",
    welcome: "வணக்கம்",
    logout: "வெளியேறு",
    loading: "ஏற்றுகிறது",
    cancel: "ரத்து செய்",
    save: "சேமி",
    accept: "ஏற்றுக்கொள்",
    approve: "அனுமதி",
    room: "அறை",
    student: "மாணவர்",
    students: "மாணவர்கள்",
    name: "பெயர்",
    signIn: "உள்நுழைய",
    
    // Settings
    appearance: "தோற்றம்",
    darkMode: "இருண்ட முறை",
    language: "மொழி",
    languageDescription: "உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    darkModeDescription: "வெளிச்சம் மற்றும் இருண்ட தீம் இடையே மாற்றவும்",
    colorBlindMode: "வண்ண குருட்டுத்தன்மை அணுகல்",
    colorBlindModeDescription: "வண்ண குருட்டுத்தன்மைக்கு ஏற்ற வண்ணங்களைப் பயன்படுத்துங்கள் (சிவப்பு/பச்சைக்கு பதிலாக நீலம்/ஆரஞ்சு)",
    resetPassword: "கடவுச்சொல் மீட்டமை",
    currentPassword: "தற்போதைய கடவுச்சொல்",
    newPassword: "புதிய கடவுச்சொல்",
    confirmPassword: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    updatePassword: "கடவுச்சொல்லை புதுப்பிக்கவும்",
    updating: "புதுப்பிக்கிறது...",
    
    // Security Dashboard
    securityDashboard: "பாதுகாப்பு டாஷ்போர்டு",
    securityMenu: "பாதுகாப்பு மெனு",
    keyAvailable: "சாவி கிடைக்கிறது",
    keyWithStudents: "மாணவர்களிடம் சாவி",
    greenKeyWithStudents: "🟢 பச்சை: மாணவர்களிடம் சாவி",
    redKeyAvailable: "🔴 சிவப்பு: பாதுகாப்பில் சாவி கிடைக்கிறது",
    accessControlPanel: "அணுகல் கட்டுப்பாட்டு பலகம்",
    keyStatus: "சாவி நிலை",
    currentStatus: "தற்போதைய நிலை:",
    availableWithSecurity: "பாதுகாப்பில் கிடைக்கிறது",
    withStudents: "மாணவர்களுடன்",
    roomOccupants: "அறை குடியிருப்பாளர்கள்",
    securityProtocol: "பாதுகாப்பு நெறிமுறை",
    securityProtocolDescription: "அணுகலை வழங்குவது மாணவர்கள் சாவி பரிவர்த்தனை படிவங்களை சமர்ப்பிக்க அனுமதிக்கும். முடிவைக் கண்காணிக்கவும்.",
    grantAccess: "மாணவர்களுக்கு அணுகல் வழங்கவும்",
    waitingForStudentResponse: "மாணவர் பதிலுக்காக காத்திருக்கிறது",
    waitingDescription: "மாணவர்களுக்கு அறிவிக்கப்பட்டுள்ளது. அவர்கள் இப்போது தங்கள் சாவி பரிவர்த்தனை படிவங்களை சமர்ப்பிக்க முடியும்.",
    monitoringSubmission: "படிவ சமர்ப்பணத்தைக் கண்காணிக்கிறது...",
    cancelAndClose: "ரத்து செய்து மூடு",
    
    // Warden Dashboard
    wardenDashboard: "வார்டன் டாஷ்போர்டு",
    wardenMenu: "வார்டன் மெனு",
    wardenAdministrativePanel: "வார்டன் நிர்வாக பலகம்",
    nightPassPending: "இரவு அனுமதி நிலுவையில்",
    occupancy: "குடியிருப்பு",
    nightPassRequest: "இரவு அனுமதி கோரிக்கை",
    pendingApproval: "உங்கள் அனுமதிக்காக நிலுவையில்",
    date: "தேதி",
    dispatchReturnTime: "புறப்பாடு - திரும்பும் நேரம்",
    reason: "காரணம்",
    approveNightPass: "இரவு அனுமதியை அனுமதிக்கவும்",
    reviewLater: "பின்னர் மதிப்பாய்வு செய்",
    allClear: "அனைத்தும் தெளிவு",
    noPendingRequests: "இந்த அறைக்கு நிலுவையில் உள்ள இரவு அனுமதி கோரிக்கைகள் இல்லை",
    orangeAlert: "⚠️ ஆரஞ்சு !: இரவு அனுமதி கோரிக்கை",
    nightPassRequestText: "இரவு அனுமதி கோரிக்கை",
    
    // Student Management
    studentManagement: "மாணவர் மேலாண்மை",
    allStudents: "அனைத்து மாணவர்கள்",
    searchStudents: "மாணவர்களைத் தேடு...",
    registrationNumber: "பதிவு எண்",
    roomNumber: "அறை எண்",
    status: "நிலை",
    action: "செயல்",
    active: "செயல்படும்",
    inactive: "செயல்படாத",
    activate: "செயல்படுத்து",
    
    // Security Management
    securityManagement: "பாதுகாப்பு மேலாண்மை",
    hostelSecurities: "விடுதி பாதுகாப்பு",
    addSecurity: "பாதுகாப்பு சேர்",
    addNewSecurityGuard: "பாதுகாப்பு காவலர் சேர்",
    createSecurityAccount: "புதிய பாதுகாப்பு பணியாளர் கணக்கை உருவாக்கவும்",
    personalInformation: "தனிப்பட்ட தகவல்",
    fullName: "முழு பெயர்",
    phoneNumber: "தொலைபேசி எண்",
    accountCredentials: "கணக்கு சான்றுகள்",
    username: "பயனர் பெயர்",
    password: "கடவுச்சொல்",
    securityGuidelines: "பாதுகாப்பு வழிகாட்டுதல்கள்",
    securityGuidelinesDescription: "புதிய பாதுகாப்பு காவலருக்கு அறை கண்காணிப்பு மற்றும் சாவி மேலாண்மை செயல்பாடுகளுக்கான அணுகல் இருக்கும்.",
    addSecurityGuard: "பாதுகாப்பு சேர்",
    
    // Languages
    english: "ஆங்கிலம்",
    tamil: "தமிழ்",
    sinhala: "சிங்களம்"
  },
  
  si: {
    // Common
    settings: "සැකසීම්",
    dashboard: "උපකරණ පුවරුව",
    welcome: "ආයුබෝවන්",
    logout: "ඉවත් වන්න",
    loading: "පූරණය වෙමින්",
    cancel: "අවලංගු කරන්න",
    save: "සුරකින්න",
    accept: "පිළිගන්න",
    approve: "අනුමත කරන්න",
    room: "කාමරය",
    student: "ශිෂ්‍ය",
    students: "ශිෂ්‍යයන්",
    name: "නම",
    signIn: "ඇතුළු වන්න",
    
    // Settings
    appearance: "පෙනුම",
    darkMode: "අඳුරු ක්‍රමය",
    language: "භාෂාව",
    languageDescription: "ඔබගේ කැමති භාෂාව තෝරන්න",
    darkModeDescription: "ආලෝක හා අඳුරු තේමා අතර මාරු වන්න",
    colorBlindMode: "වර්ණ අන්ධතා ප්‍රවේශය",
    colorBlindModeDescription: "වර්ණ අන්ධතාවට හිතකර වර්ණ භාවිතා කරන්න (රතු/කොළ වෙනුවට නිල්/තැඹිලි)",
    resetPassword: "මුර පදය යළි සකසන්න",
    currentPassword: "වර්තමාන මුර පදය",
    newPassword: "නව මුර පදය",
    confirmPassword: "නව මුර පදය තහවුරු කරන්න",
    updatePassword: "මුර පදය යාවත්කාලීන කරන්න",
    updating: "යාවත්කාලීන කරමින්...",
    
    // Security Dashboard
    securityDashboard: "ආරක්ෂක උපකරණ පුවරුව",
    securityMenu: "ආරක්ෂක මෙනුව",
    keyAvailable: "යතුර ලබා ගත හැක",
    keyWithStudents: "ශිෂ්‍යයන් සමඟ යතුර",
    greenKeyWithStudents: "🟢 කොළ: ශිෂ්‍යයන් සමඟ යතුර",
    redKeyAvailable: "🔴 රතු: ආරක්ෂාව සමඟ යතුර ලබා ගත හැක",
    accessControlPanel: "ප්‍රවේශ පාලන පුවරුව",
    keyStatus: "යතුර තත්ත්වය",
    currentStatus: "වර්තමාන තත්ත්වය:",
    availableWithSecurity: "ආරක්ෂාව සමඟ ලබා ගත හැක",
    withStudents: "ශිෂ්‍යයන් සමඟ",
    roomOccupants: "කාමර නිවැසියන්",
    securityProtocol: "ආරක්ෂක ප්‍රොටෝකෝලය",
    securityProtocolDescription: "ප්‍රවේශය ලබා දීම ශිෂ්‍යයන්ට යතුර ගනුදෙනු ආකෘති ඉදිරිපත් කිරීමට ඉඩ සලසයි. සම්පූර්ණ කිරීම නිරීක්ෂණය කරන්න.",
    grantAccess: "ශිෂ්‍යයන්ට ප්‍රවේශය ලබා දෙන්න",
    waitingForStudentResponse: "ශිෂ්‍ය ප්‍රතිචාරය සඳහා බලා සිටිමින්",
    waitingDescription: "ශිෂ්‍යයන්ට දැනුම් දී ඇත. ඔවුන්ට දැන් ඔවුන්ගේ යතුර ගනුදෙනු ආකෘති ඉදිරිපත් කළ හැක.",
    monitoringSubmission: "ආකෘති ඉදිරිපත් කිරීම නිරීක්ෂණය කරමින්...",
    cancelAndClose: "අවලංගු කර වසන්න",
    
    // Warden Dashboard
    wardenDashboard: "වෝර්ඩන් උපකරණ පුවරුව",
    wardenMenu: "වෝර්ඩන් මෙනුව",
    wardenAdministrativePanel: "වෝර්ඩන් පරිපාලන පුවරුව",
    nightPassPending: "රාත්‍රී අවසර නියම",
    occupancy: "වාසය",
    nightPassRequest: "රාත්‍රී අවසර ඉල්ලීම",
    pendingApproval: "ඔබගේ අනුමතිය සඳහා නියම",
    date: "දිනය",
    dispatchReturnTime: "යාම - එන කාලය",
    reason: "හේතුව",
    approveNightPass: "රාත්‍රී අවසර අනුමත කරන්න",
    reviewLater: "පසුව සමාලෝචනය කරන්න",
    allClear: "සියල්ල පැහැදිලි",
    noPendingRequests: "මෙම කාමරය සඳහා රාත්‍රී අවසර ඉල්ලීම් නියම නැත",
    orangeAlert: "⚠️ තැඹිලි !: රාත්‍රී අවසර ඉල්ලීම",
    nightPassRequestText: "රාත්‍රී අවසර ඉල්ලීම",
    
    // Student Management
    studentManagement: "ශිෂ්‍ය කළමනාකරණය",
    allStudents: "සියලුම ශිෂ්‍යයන්",
    searchStudents: "ශිෂ්‍යයන් සොයන්න...",
    registrationNumber: "ලියාපදිංචි අංකය",
    roomNumber: "කාමර අංකය",
    status: "තත්ත්වය",
    action: "ක්‍රියාව",
    active: "ක්‍රියාකාරී",
    inactive: "අක්‍රිය",
    activate: "සක්‍රිය කරන්න",
    
    // Security Management
    securityManagement: "ආරක්ෂක කළමනාකරණය",
    hostelSecurities: "නේවාසික ආරක්ෂාව",
    addSecurity: "ආරක්ෂකයා එකතු කරන්න",
    addNewSecurityGuard: "ආරක්ෂක ආරක්ෂකයා එකතු කරන්න",
    createSecurityAccount: "නව ආරක්ෂක පුද්ගල ගිණුමක් සාදන්න",
    personalInformation: "පුද්ගලික තොරතුරු",
    fullName: "සම්පූර්ණ නම",
    phoneNumber: "දුරකථන අංකය",
    accountCredentials: "ගිණුම් සහතික",
    username: "පරිශීලක නාමය",
    password: "මුර පදය",
    securityGuidelines: "ආරක්ෂක මාර්ගෝපදේශ",
    securityGuidelinesDescription: "නව ආරක්ෂක ආරක්ෂකයාට කාමර නිරීක්ෂණ සහ යතුර කළමනාකරණ කාර්යයන් සඳහා ප්‍රවේශය ලැබේ.",
    addSecurityGuard: "ආරක්ෂකයා එකතු කරන්න",
    
    // Languages
    english: "ඉංග්‍රීසි",
    tamil: "දෙමළ",
    sinhala: "සිංහල"
  }
};

export const getTranslation = (language: Language, key: keyof Translations): string => {
  try {
    if (!language || !translations[language]) {
      return translations.en[key] || key;
    }
    return translations[language][key] || translations.en[key] || key;
  } catch (error) {
    console.warn(`Translation error for key '${key}' and language '${language}':`, error);
    return key;
  }
};