import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faSignOutAlt,faCog,faUser,faMobileAlt,faEnvelope,faHome,faInfoCircle,faTh,faMicrophoneSlash,faCogs,faThLarge,
    faRobot,faHandPaper,faRecordVinyl,faComments,faUsers,faUserPlus,faShieldAlt,faDesktop,faVideo,faVideoSlash,
    faExpand,faCalendarAlt,faPlus,faPlusSquare,faRocket,faBolt,faTimes,faVolumeUp,faMicrophone,faKeyboard,
    faChevronLeft,faChevronRight,faEyeSlash,faEye,faCopy,faLink,} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faSignOutAlt,faCog,faUser,faMobileAlt,faEnvelope,faHome,faInfoCircle,faTh,faMicrophoneSlash,faCogs,
    faThLarge,faRobot,faHandPaper,faRecordVinyl,faComments,faUsers,faUserPlus,faShieldAlt,faDesktop,faVideo,
    faVideoSlash,faExpand,faCalendarAlt,faPlus,faPlusSquare,faRocket,faBolt,faTimes,faVolumeUp,faMicrophone,faKeyboard,
    faChevronLeft,faChevronRight,faEyeSlash,faEye,faCopy,faLink)

const app = createApp(App);
app.use(store);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app');
