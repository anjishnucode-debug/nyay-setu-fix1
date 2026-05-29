import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './pages/Landing';
import CitizenHome from './pages/citizen/CitizenHome';
import StatusTracker from './pages/citizen/StatusTracker';
import RightsBot from './pages/citizen/RightsBot';
import LegalAidFinder from './pages/citizen/LegalAidFinder';
import CourtCalendar from './pages/citizen/CourtCalendar';
import FileComplaint from './pages/citizen/FileComplaint';
import SmsAlerts from './pages/citizen/SmsAlerts';
import LegalHome from './pages/legal/LegalHome';
import NyayMitra from './pages/legal/NyayMitra';
import PrecedentFinder from './pages/legal/PrecedentFinder';
import UndertrialAlerts from './pages/legal/UndertrialAlerts';
import BailGenerator from './pages/legal/BailGenerator';
import RegisterPrisoner from './pages/legal/RegisterPrisoner';
import HearingSchedule from './pages/legal/HearingSchedule';
import DistrictAnalytics from './pages/legal/DistrictAnalytics';
import BailRiskReport from './pages/legal/BailRiskReport';
import NotFound from './pages/NotFound';
import './App.css';
import './index.css';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/citizen" element={<CitizenHome />} />
          <Route path="/citizen/status" element={<StatusTracker />} />
          <Route path="/citizen/rights" element={<RightsBot />} />
          <Route path="/citizen/legal-aid" element={<LegalAidFinder />} />
          <Route path="/citizen/calendar" element={<CourtCalendar />} />
          <Route path="/citizen/complaint" element={<FileComplaint />} />
          <Route path="/citizen/sms-alerts" element={<SmsAlerts />} />
          <Route path="/legal" element={<LegalHome />} />
          <Route path="/legal/nyay-mitra" element={<NyayMitra />} />
          <Route path="/legal/precedents" element={<PrecedentFinder />} />
          <Route path="/legal/alerts" element={<UndertrialAlerts />} />
          <Route path="/legal/bail" element={<BailGenerator />} />
          <Route path="/legal/register-prisoner" element={<RegisterPrisoner />} />
          <Route path="/legal/schedule" element={<HearingSchedule />} />
          <Route path="/legal/analytics" element={<DistrictAnalytics />} />
          <Route path="/legal/bail-risk" element={<BailRiskReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}