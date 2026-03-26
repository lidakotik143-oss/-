import React from 'react';
import { FaCog } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import CustomizationPanel from './account/CustomizationPanel';
import AdvancedSettingsPanel from './account/AdvancedSettingsPanel';

export default function SettingsScreen() {
  const { t, theme, fontSize } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className={`${theme.cardBg} p-5 rounded-2xl shadow flex items-center gap-3`}>
        <FaCog className={`text-2xl ${theme.accentText}`} />
        <div>
          <h2 className={`${fontSize.subheading} font-bold ${theme.headerText}`}>
            {t('\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438', 'Settings')}
          </h2>
          <p className={`${fontSize.small} ${theme.textSecondary}`}>
            {t('\u0422\u0435\u043c\u0430, \u0448\u0440\u0438\u0444\u0442, \u044f\u0437\u044b\u043a \u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u043d\u044b\u0435 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b', 'Theme, font, language and advanced options')}
          </p>
        </div>
      </div>

      <CustomizationPanel />
      <AdvancedSettingsPanel />
    </div>
  );
}
