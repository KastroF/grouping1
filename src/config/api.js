const BASE_URL = "https://grouping-node-raar.onrender.com";
const SOCKET_URL = BASE_URL;

const API = {
  // Auth
  USER_REGISTER: `${BASE_URL}/api/user/register`,
  USER_SIGNIN: `${BASE_URL}/api/user/signin`,
  USER_SIGNIN_GOOGLE: `${BASE_URL}/api/user/signinwithgoogle`,
  USER_CONNECT_APPLE: `${BASE_URL}/api/user/connectwithapple`,
  USER_GO_TO_EMAIL: `${BASE_URL}/api/user/gotoemail`,
  USER_CHANGE_PASSWORD: `${BASE_URL}/api/user/changepassword`,
  USER_CHANGE_NAME: `${BASE_URL}/api/user/changename`,
  USER_CHANGE_PHOTO: `${BASE_URL}/api/user/changephoto`,
  USER_UPDATE_FCM: `${BASE_URL}/api/user/updatefcmToken`,
  USER_CONTACT_US: `${BASE_URL}/api/user/contactus`,

  // Annonces
  ANNONCE_LIST: `${BASE_URL}/api/annonce/announces`,
  ANNONCE_GET_ALL: `${BASE_URL}/api/annonce/avoirlesannonces`,
  ANNONCE_GET_ONE: `${BASE_URL}/api/annonce/getannoncee`,
  ANNONCE_GET_BY_USER: `${BASE_URL}/api/annonce/getannouncementbyid`,
  ANNONCE_MORE: `${BASE_URL}/api/annonce/moreannounces`,
  ANNONCE_SEARCH: `${BASE_URL}/api/annonce/search`,
  ANNONCE_ADD: `${BASE_URL}/api/annonce/addannouncement`,
  ANNONCE_ADD_PDF: `${BASE_URL}/api/annonce/addAnnouncementWithPdf`,
  ANNONCE_ADD_IMAGES: `${BASE_URL}/api/annonce/addAnnouncementWithImages`,
  ANNONCE_ADD_CONTAINER: `${BASE_URL}/api/annonce/ajouterunconteneur`,
  ANNONCE_MODIFY_KILO: `${BASE_URL}/api/annonce/modifierkilo`,
  ANNONCE_MODIFY_IMG: `${BASE_URL}/api/annonce/modifierannonceimg`,
  ANNONCE_MODIFY_PDF: `${BASE_URL}/api/annonce/modifierannoncepdf`,

  // Localisation
  COUNTRY_LIST: `${BASE_URL}/api/country/getcountries`,
  CITY_LIST_BY_COUNTRY: `${BASE_URL}/api/city/getcitiesbycountryid`,

  // Messages
  MESSAGE_GET: `${BASE_URL}/api/message/getmessages`,
  MESSAGE_ADD_IMAGE: `${BASE_URL}/api/message/addmessagewithimage`,

  // Notifications
  NOTIF_GET: `${BASE_URL}/api/notification/getnotifications`,
  NOTIF_DELETE: `${BASE_URL}/api/notification/deletenotif`,
  NOTIF_NOT_READ: `${BASE_URL}/api/notification/notread`,
  NOTIF_VIEW: `${BASE_URL}/api/notification/viewnotifs`,
};

export { BASE_URL, SOCKET_URL, API };
