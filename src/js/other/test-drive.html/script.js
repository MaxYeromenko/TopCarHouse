if (isAuthTokenExpired()) window.location.href = '/';

import {
    createConsultationRequest,
    themeApplication, showServicesModalWindow
} from '../_utils/script.js';

showServicesModalWindow();
themeApplication();
createConsultationRequest();